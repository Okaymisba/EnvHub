import React, {useEffect, useState} from 'react';
import { SupabaseService } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeedbackPage = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        message: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/signup');
                return;
            }
            setUser(user);
            setFormData(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || ''
            }));
        };
        fetchUser();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            
            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to submit feedback.",
                    variant: "destructive",
                });
                return;
            }

            await SupabaseService.insertFeedback(
                formData.name,
                user.email || '',
                formData.rating,
                formData.message
            );

            toast({
                title: "Thank you!",
                description: "Your feedback has been submitted successfully.",
            });

            setFormData(prev => ({
                ...prev,
                rating: 0,
                message: '',
            }));
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast({
                title: "Error",
                description: "Failed to submit feedback. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({
            ...prev,
            rating,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-x-hidden p-4">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <Card className="w-full max-w-md bg-black/90 border border-purple-900 shadow-xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/favicon.ico"
                            alt="EnvHub Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        Share Your Feedback
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        We'd love to hear your thoughts and suggestions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                                Your Name *
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                How would you rate your experience? *
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="p-1 focus:outline-none"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                                Your Feedback *
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Tell us what you think..."
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={5}
                                required
                                className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400 min-h-[120px]"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !formData.message || formData.rating === 0 || !formData.name}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-6"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <style>{`
                .animate-pulse-slow {
                    animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default FeedbackPage;