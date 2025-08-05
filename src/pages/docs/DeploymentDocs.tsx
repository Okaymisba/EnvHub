import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Book, Shield, Users, Terminal, CloudUpload, Server, Cpu, Database, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocsLayout from '@/components/DocsLayout';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DeploymentDocsProps {
  initialSection?: string;
}

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { label: 'Introduction', path: '/docs/getting-started/introduction#introduction' },
      { label: 'Installation', path: '/docs/getting-started/installation#installation' },
      { label: 'Usage', path: '/docs/getting-started/usage#usage' }
    ]
  },
  {
    title: 'CLI Documentation',
    icon: Terminal,
    items: [
      { label: 'Installation', path: '/docs/cli/installation#installation' },
      { label: 'Authentication', path: '/docs/cli/authentication#authentication' },
      { label: 'Project Management', path: '/docs/cli/project-management#project-management' },
      { label: 'Environment Variables', path: '/docs/cli/variables#environment-variables' }
    ]
  },
  {
    title: 'Deployment',
    icon: CloudUpload,
    items: [
      { label: 'Overview', path: '/docs/deployment/overview#overview' },
      { label: 'Deployment Guide', path: '/docs/deployment/deployment-guide#deployment-guide' },
      { label: 'CI/CD Integration', path: '/docs/deployment/ci-cd-integration#ci-cd-integration' }
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { label: 'Encryption Overview', path: '/docs/security/encryption#encryption' },
      { label: 'Access Control', path: '/docs/security/access-control#access-control' },
      { label: 'Best Practices', path: '/docs/security/best-practices#best-practices' },
      { label: 'Security Measures', path: '/docs/security/security-measures#security-measures' }
    ]
  },
  {
    title: 'Team Collaboration',
    icon: Users,
    items: [
      { label: 'Getting Started', path: '/docs/team/getting-started#introduction' },
      { label: 'Managing Team Members', path: '/docs/team/members#members' },
      { label: 'Access Control', path: '/docs/team/access-control#access-control' },
      { label: 'Best Practices', path: '/docs/team/best-practices#best-practices' }
    ]
  }
];

const deploymentSections = [
  {
    id: 'overview',
    title: 'Deployment Overview',
    icon: Server,
    description: 'Learn how to deploy your apps with EnvHub.',
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Application Deployment with EnvHub</h3>
        <p className="text-gray-300">
          Learn how to deploy your applications to various cloud platforms using Docker and securely inject environment variables with EnvHub.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center mb-4">
              <Cpu className="w-6 h-6 text-blue-400 mr-3" />
              <h4 className="text-lg font-medium text-white">Docker Deployment</h4>
            </div>
            <p className="text-gray-400">Containerize your application with Docker and use EnvHub to manage environment variables across different environments.</p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center mb-4">
              <CloudUpload className="w-6 h-6 text-purple-400 mr-3" />
              <h4 className="text-lg font-medium text-white">Cloud Platforms</h4>
            </div>
            <p className="text-gray-400">Deploy your containerized applications to popular cloud platforms with EnvHub's secure environment variable injection.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'deployment-guide',
    title: 'Deployment Guide',
    icon: CloudUpload,
    description: 'Learn how to deploy your application with Docker and EnvHub',
    content: (
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold text-white">Containerized Deployment with EnvHub</h3>
        <p className="text-gray-300">
          Follow this guide to containerize your application and deploy it to any cloud platform with EnvHub for environment variable management.
        </p>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xl font-medium text-white mb-4">1. Prepare Dockerfile</h4>
            <p className="text-gray-300 mb-4">
              In this example, we'll demonstrate the deployment process using a FastAPI application.
            </p>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
              {/* Header */}
              <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                📁 Project Structure
              </div>

              {/* Syntax-highlighted content */}
              <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter
                    language="bash"
                    style={vscDarkPlus}
                    wrapLongLines
                    customStyle={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: '0.25rem 0.5rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                    codeTagProps={{
                      style: {
                        color: 'inherit',
                        background: 'transparent',
                      },
                    }}
                    PreTag={({ children, ...props }) => (
                        <div {...props} style={{
                          color: 'inherit',
                          background: 'transparent',
                          padding: '0 1rem',
                          margin: 0,
                        }}>
                          {children}
                        </div>
                    )}
                >
                  {`your-fastapi-app/
├── main.py           # Your FastAPI application
├── requirements.txt  # Python dependencies
├── .env              # Local development variables (gitignored)
├── .envhub           # EnvHub configuration
└── Dockerfile        # Multi-stage build file`}
                </SyntaxHighlighter>
              </div>
            </div>



            <p className="text-gray-300 mb-4 pt-6 pb-4">
              <code className="bg-purple-900/30 px-1 py-0.5 rounded">main.py</code> implements a REST API endpoint that generates structured commit messages by analyzing git diffs, while <code className="bg-purple-900/30 px-1 py-0.5 rounded">requirements.txt</code> specifies the Python dependencies required for the application.
            </p>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
              {/* Header */}
              <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                <span className="text-gray-300">main.py</span>
              </div>

              {/* Code content */}
              <div className="px-4 pt-4 pb-6 overflow-x-auto">
                <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    wrapLongLines
                    customStyle={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: '0.25rem 0.5rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                    codeTagProps={{
                      style: {
                        color: 'inherit',
                        background: 'transparent',
                      },
                    }}
                    PreTag={({ children, ...props }) => (
                        <div {...props} style={{
                          color: 'inherit',
                          background: 'transparent',
                          padding: '0 1rem',
                          margin: 0,
                        }}>
                          {children}
                        </div>
                    )}
                >
                  {`
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
import os

app = FastAPI()

class DiffRequest(BaseModel):
    diff: str

@app.post("/generate-commit")
async def generate_commit(request: DiffRequest):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents=f"""Act as a professional Git commit message generator.
Analyze the following code changes (git diff) and generate a concise, clear, and accurate commit
message. Use the Conventional Commits format only if appropriate (fix, docs, refactor, chore, etc.).
Avoid using feat unless the change introduces a meaningful, user-facing feature.
Include specific details about what was changed.

Here are the code changes:
{request.diff}

Commit message:"""
    )
    return {"commit_message": response.text.strip()}
`}
                </SyntaxHighlighter>
              </div>
            </div>

            <p className="text-gray-300 mb-4 pt-6 pb-4">
              Now we will build a Dockerfile for this application. Let's create a multi-stage <code className="bg-purple-900/30 px-1 py-0.5 rounded">Dockerfile</code> that will first set up the <code className="bg-purple-900/30 px-1 py-0.5 rounded">envhub-cli</code> and then build the final application image. Ensure your <code className="bg-purple-900/30 px-1 py-0.5 rounded">.dockerignore</code> file is properly configured to exclude unnecessary files from the build context.
            </p>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
              {/* Header */}
              <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                <span className="text-yellow-400">🐳</span>
                <span className="text-gray-300">Dockerfile</span>
              </div>

              {/* Code block */}
              <div className="px-4 pt-4 pb-6 overflow-x-auto">
                <SyntaxHighlighter
                    language="dockerfile"
                    style={vscDarkPlus}
                    wrapLongLines
                    customStyle={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: '0.25rem 0.5rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                    codeTagProps={{
                      style: {
                        color: 'inherit',
                        background: 'transparent',
                      },
                    }}
                    PreTag={({ children, ...props }) => (
                        <div {...props} style={{
                          color: 'inherit',
                          background: 'transparent',
                          padding: '0 1rem',
                          margin: 0,
                        }}>
                          {children}
                        </div>
                    )}
                >
                  {`
# ================================
# Stage 1 — Build envhub binary
# ================================
FROM python:3.12-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential wget git python3-dev gcc && \\
    pip install --no-cache-dir pyinstaller

# Set working directory
WORKDIR /envhub-src

# Clone the repository
RUN git clone https://github.com/Okaymisba/EnvHub-CLI.git . && \\
    git checkout master

# Install the package in development mode
RUN pip install -e .

# Build the binary
RUN pyinstaller --onefile --name envhub envhub/__main__.py

# ================================
# Stage 2 — Final image
# ================================
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Step 1: Copy your local FastAPI requirements
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# Step 2: Copy your FastAPI project files
COPY . .                 

# Step 3: Copy built envhub binary and make it executable
COPY --from=builder /envhub-src/dist/envhub /usr/local/bin/envhub
RUN chmod +x /usr/local/bin/envhub

# Step 4 (Option 1): If you want to directly run your application with out having a proper 
# decrypted .env, then use this command. This will directly inject all the env variables
# without creating a .env into your application before starting it up.
CMD ["envhub", "decrypt-prod", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Step 4 (Option 2): If you want to run your application with a proper .env file, 
# Then use this method as this will create a .env file then run your application.
RUN envhub decrypt-prod

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
`}
                </SyntaxHighlighter>
              </div>
            </div>

          </div>

          <div>
            <h4 className="text-xl font-medium text-white mb-4">2. Deploying Your FastAPI Application</h4>
            <p className="text-gray-300 mb-4">
              With the Dockerfile in place, you're ready to deploy your application to any cloud provider. However, there are a few important steps to complete before proceeding with the deployment.
            </p>
            <div className="space-y-6">
              <div>
              <h5 className="text-lg font-medium text-purple-300 mb-2">Configuring Environment Variables for EnvHub</h5>
                <p className="text-gray-300 mb-4">
                  This guide demonstrates deploying a <a href="https://github.com/Okaymisba/API-for-Commit-message-generator" className="text-blue-400 hover:underline">FastAPI application</a> to <a href="https://render.com/" className="text-blue-400 hover:underline">Render</a>. The deployment process is similar across most cloud providers. Begin by selecting your target repository, then configure these two essential environment variables:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><code className="bg-purple-900/30 px-1 py-0.5 rounded">ENVHUB_API_KEY</code></li>
                    <li><code className="bg-purple-900/30 px-1 py-0.5 rounded">ENVHUB_PASSWORD</code></li>
                  </ul>
                </p>
                <div className="border-l-4 border-purple-600 rounded-lg p-4 bg-gray-900/30">
                  <h5 className="text-lg font-medium text-purple-300 mb-2">Important Notes</h5>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>Retrieve your project's API key from the project settings in the Project Page.</li>
                    <li><code className="bg-purple-900/30 px-1 py-0.5 rounded">ENVHUB_PASSWORD</code> is the project password that you set when creating the project.</li>
                    <li>Ensure your repository includes the Dockerfile with the <code className="bg-purple-900/30 px-1 py-0.5 rounded">envhub-cli</code> configuration as outlined in the previous section.</li>
                  </ul>
                </div>
                <div className="my-6">
                  <img
                      src="/env_vars_in_render.png"
                      alt="Environment variables configuration in Render"
                      className="rounded-lg border border-gray-700 shadow-lg w-full max-w-3xl mx-auto"
                  />
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Adding environment variables in Render's dashboard
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-medium text-purple-300 mb-2">Build and Deploy Process</h5>
                <p className="text-gray-300 mb-4">
                  You can now proceed with building and deploying your application to your preferred cloud provider. The deployment process will utilize the Dockerfile we've configured with EnvHub integration.
                </p>
                <p className="text-gray-300 mb-4">
                  Once the deployment completes successfully, verify that your application is running as expected. For the FastAPI example application, we can test the endpoint by sending a POST request to:
                </p>
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
                  {/* Header */}
                  <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                    <span className="text-gray-300">Bash</span>
                  </div>

                  {/* Code block */}
                  <div className="px-4 pt-4 pb-6 overflow-x-auto">
                    <SyntaxHighlighter
                        language="bash"
                        style={vscDarkPlus}
                        wrapLongLines
                        customStyle={{
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          margin: 0,
                          padding: '0.25rem 0.5rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          color: 'inherit',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                        codeTagProps={{
                          style: {
                            color: 'inherit',
                            background: 'transparent',
                          },
                        }}
                        PreTag={({ children, ...props }) => (
                            <div {...props} style={{
                              color: 'inherit',
                              background: 'transparent',
                              padding: '0 1rem',
                              margin: 0,
                            }}>
                              {children}
                            </div>
                        )}
                    >
                      {`
curl -X POST https://api-for-commit-message-generator.onrender.com/generate-commit \\
  -H "Content-Type: application/json" \\
  -d '{
    "diff": "diff --git a/file.txt b/file.txt\\nindex 123..456 100644\\n--- a/file.txt\\n+++ b/file.txt\\n@@ -1,1 +1,1 @@\\n+This is a change"
}'`}
                    </SyntaxHighlighter>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 pt-4">
                  The API will return a JSON response in the following format:
                </p>
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
                  {/* Header */}
                  <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                    <span className="text-gray-300">Bash</span>
                  </div>

                  {/* Code block */}
                  <div className="px-4 pt-4 pb-6 overflow-x-auto">
                    <SyntaxHighlighter
                        language="bash"
                        style={vscDarkPlus}
                        wrapLongLines
                        customStyle={{
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          margin: 0,
                          padding: '0.25rem 0.5rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          color: 'inherit',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                        codeTagProps={{
                          style: {
                            color: 'inherit',
                            background: 'transparent',
                          },
                        }}
                        PreTag={({ children, ...props }) => (
                            <div {...props} style={{
                              color: 'inherit',
                              background: 'transparent',
                              padding: '0 1rem',
                              margin: 0,
                            }}>
                              {children}
                            </div>
                        )}
                    >
                      {`
{
  "commit_message": "Refactor: Update file.txt content"
}`}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 pt-4">
                    This confirms that the application has successfully authenticated with the Gemini API using the provided credentials and is generating structured commit messages as expected.
                </p>

                <div className="mt-8 p-4 bg-gray-900/40 rounded-lg border-l-4 border-purple-600">
                  <h4 className="text-lg font-medium text-purple-300 mb-2">Need Help with Deployment?</h4>
                  <p className="text-gray-300 mb-3">
                    If you encounter any issues while deploying to any cloud provider or have questions about the process, our community is here to help.
                  </p>
                  <a 
                    href="https://github.com/Okaymisba/EnvHub/discussions/new?category=q-a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-300 hover:text-purple-400 hover:underline transition-colors"
                  >
                    Ask a question in GitHub Discussions
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'ci-cd-integration',
    title: 'CI/CD Integration',
    icon: CloudUpload,
    description: 'Learn how to integrate EnvHub with your CI/CD pipeline',
    content: (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Automated Deployments with GitHub Actions</h3>
        <p className="text-gray-300">
          Streamline your deployment workflow by integrating EnvHub with GitHub Actions. This setup ensures your FastAPI application is automatically deployed with secure environment variable management.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-medium text-white mb-4">GitHub Actions Workflow</h4>
            <p className="text-gray-300 mb-4">
              Below is a complete GitHub Actions workflow that automates the deployment of this FastAPI application to Render. This workflow:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Automatically triggers on pushes to the main branch</li>
              <li>Sets up Python 3.12 environment</li>
              <li>Installs EnvHub CLI for secure secret management</li>
              <li>Decrypts production environment variables</li>
              <li>Deploys your application using Render's deployment webhook</li>
            </ul>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden text-sm shadow-md ring-1 ring-purple-600/30">
              <div className="bg-gray-900/50 text-gray-200 px-4 py-2 font-mono text-xs rounded-t-xl flex items-center gap-2">
                <span className="text-gray-300">.github/workflows/deploy.yml</span>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language="yaml"
                    style={vscDarkPlus}
                    wrapLongLines
                    customStyle={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: '0.75rem 1rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                    codeTagProps={{
                      style: {
                        color: 'inherit',
                        background: 'transparent',
                        lineHeight: 1.5,
                      },
                    }}
                    PreTag={({ children, ...props }) => (
                        <div {...props} style={{ 
                          color: 'inherit', 
                          background: 'transparent',
                          padding: '0 1rem',
                          margin: 0,
                        }}>
                          {children}
                        </div>
                    )}
                >
                  {`
name: Deploy to Render

on:
  push:
    branches: [ main ]

env:
  # Required EnvHub credentials for decryption
  ENVHUB_API_KEY: \${{ secrets.ENVHUB_API_KEY }}      # API key for EnvHub authentication
  ENVHUB_PASSWORD: \${{ secrets.ENVHUB_PASSWORD }}    # Project password for EnvHub decryption

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Set up Python and install EnvHub CLI - these steps prepare the environment
      # to securely fetch and deploy your application using EnvHub
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
        
          python-version: '3.12'
      
      - name: Install EnvHub CLI using pipx
        run: |
        
          python -m pip install --user pipx
          python -m pipx ensurepath
          export PATH="$PATH:$HOME/.local/bin"
          pipx install envhub-cli
          envhub --version

      # Deploy the application
      # This step will:
      # 1. Decrypt production environment variables using EnvHub
      # 2. Load the environment variables into the current shell
      # 3. Trigger a new deployment on Render using the webhook
      # 4. Clean up sensitive environment files after deployment
      - name: Deploy to Render
        run: |
            
          # Decrypt production environment variables and store them in .env
          envhub decrypt-prod
          
          # Source the environment variables
          set -a
          source .env
          set +a
        
          # Trigger Render deployment webhook
          curl "$RENDER_DEPLOY_HOOK_ENVHUB"

          # Clean up sensitive data
          rm -f .env
`}
                </SyntaxHighlighter>

              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
              <h4 className="text-lg font-medium text-blue-300 mb-2">Required Secrets</h4>
              <p className="text-blue-200 text-sm mb-4">Make sure to set these secrets in your GitHub repository settings:</p>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-blue-900/50 px-2 py-1 rounded">ENVHUB_API_KEY</code> - Your EnvHub API key</li>
                <li><code className="bg-blue-900/50 px-2 py-1 rounded">ENVHUB_PASSWORD</code> - Your EnvHub password</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6">
            <h4 className="text-xl font-medium text-white mb-4">How It Works</h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>The workflow is triggered on every push to the main branch</li>
              <li>It sets up Python 3.12 environment</li>
              <li>Installs EnvHub CLI using pipx for isolated installation</li>
              <li>Decrypts production environment variables using <code className="bg-gray-800 px-1 py-0.5 rounded">envhub decrypt-prod</code></li>
              <li>Sources the environment variables into the current shell</li>
              <li>Triggers a deployment on Render using the webhook URL</li>
              <li>Cleans up the decrypted <code className="bg-gray-800 px-1 py-0.5 rounded">.env</code> file</li>
            </ol>
          </div>
        </div>
      </div>
    )
  },
];

const DeploymentDocs: React.FC<DeploymentDocsProps> = ({ initialSection = 'overview' }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection && containerRef.current) {
      const section = document.getElementById(initialSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);

  return (
    <DocsLayout sections={sections}>
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans" ref={containerRef}>
        <Helmet>
          <title>Deployment Guide - EnvHub Vault Keeper</title>
          <meta name="description" content="Comprehensive guide to deploying EnvHub Vault Keeper in various environments and configurations." />
        </Helmet>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <div className="animate-fade-in-up mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Deployment Guide
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive guide to deploying your application with EnvHub.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Table of Contents</h2>
              <div className="space-y-4">
                {deploymentSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start p-4 rounded-lg hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-4 group-hover:bg-blue-500/20 transition-colors">
                      <section.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{section.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-20 pb-20">
              {deploymentSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                      <section.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
};

export default DeploymentDocs;
