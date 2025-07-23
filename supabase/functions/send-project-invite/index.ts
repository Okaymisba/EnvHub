// supabase/functions/send-project-invite/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const { projectName, project_id, inviter_id, invited_email, role, password } = await req.json();
        if (!project_id || !inviter_id || !invited_email || !role || !password) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
        }

        // Store in database
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') || '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Verify inviter has permission to assign this role
        const { data: inviterRole, error: roleError } = await supabase
            .from('project_members')
            .select('role')
            .eq('project_id', project_id)
            .eq('user_id', inviter_id)
            .single();

        if (roleError || !inviterRole) {
            return new Response(
                JSON.stringify({ error: "Inviter not found in project or insufficient permissions" }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Check if inviter can assign this role
        const inviterCanAssign = (
            inviterRole.role === 'owner' ||
            (inviterRole.role === 'admin' && role !== 'owner')
        );

        if (!inviterCanAssign) {
            return new Response(
                JSON.stringify({ error: "Insufficient permissions to assign this role" }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const encoded_password = btoa(password);
        const token = crypto.randomUUID();

        const { data, error } = await supabase
            .from('secrets')
            .insert(
                {
                    project_id: project_id,
                    inviter_id: inviter_id,
                    invited_email: invited_email,
                    role: role,
                    encoded_password: encoded_password,
                    token: token
                }
            );
        console.log('Data:', data);
        console.log('Error:', error);

        if (error) {
            console.error('Error storing invite in database:', error);
            return new Response(
                JSON.stringify({ error: "Failed to store invite in database" }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const subject = `You've been invited to join ${projectName}`;
        const htmlContent = `
  <p>Hello,</p>
  <p>You are being invited to the project <strong>${projectName}</strong>.</p>
  <p>To accept the invitation:</p>
  <ol>
    <li>Visit <a href="https://envhub.net" target="_blank">envhub.net</a></li>
    <li>Click on the <strong>profile icon</strong> in the top right</li>
    <li>Go to <strong>Inbox</strong></li>
    <li>There you will find the invitation and can accept it</li>
  </ol>
  <p>
    The project owner has also set a password for you to access the project.
    You can view this password by clicking the link below:
  </p>
  <p style="margin: 16px 0;">
    <a href="https://envhub.net/invitations/${token}" 
       style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:4px;">
      View Project Access Password
    </a>
  </p>
  <p style="color: red; font-weight: bold;">
    ⚠️ You can access this link only once. Make sure to save the password securely.
  </p>
  <p>If you were not expecting this invitation, you can safely ignore this email.</p>
`;


        await sendBrevoEmail(invited_email, subject, htmlContent);

        return new Response(JSON.stringify({ success: true }), {
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    } catch (err) {
        console.error("Error sending invitation:", err);
        return new Response(
            JSON.stringify({ error: "Failed to send email", details: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

async function sendBrevoEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
) {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
        throw new Error("BREVO_API_KEY is not configured");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
        },
        body: JSON.stringify({
            sender: {
                name: "EnvHub",
                email: "notifications@envhub.net",
            },
            to: [{ email: to }],
            subject,
            htmlContent,
            textContent: textContent || htmlContent.replace(/<[^>]*>/g, ""),
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}
