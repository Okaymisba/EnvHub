import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {ArrowLeft, Calendar, CreditCard, X, HelpCircle} from 'lucide-react';
import {Subscription, SubscriptionService} from '@/services/subscriptionService';
import {useToast} from '@/hooks/use-toast';
import {createPortal} from "react-dom";

interface SubscriptionManagerProps {
    onClose: () => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({onClose}) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            const currentSubscription = await SubscriptionService.getCurrentSubscription();
            setSubscription(currentSubscription);
        } catch (error) {
            console.error('Failed to load subscription:', error);
            toast({
                title: 'Error',
                description: 'Failed to load subscription information',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (variantId: number, productName: string) => {
        try {
            setUpgrading(true);
            const checkoutUrl = await SubscriptionService.createCheckout(variantId, productName);
            window.open(checkoutUrl, '_blank');
        } catch (error) {
            console.error('Failed to create checkout:', error);
            toast({
                title: 'Error',
                description: 'Failed to create checkout session',
                variant: 'destructive'
            });
        } finally {
            setUpgrading(false);
        }
    };

    const handleCancel = async () => {
        if (!subscription) return;

        if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
            try {
                await SubscriptionService.cancelSubscription(subscription.lemon_squeezy_id);
                toast({
                    title: 'Subscription Cancelled',
                    description: 'Your subscription has been cancelled successfully'
                });
                await loadSubscription();
            } catch (error) {
                console.error('Failed to cancel subscription:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to cancel subscription',
                    variant: 'destructive'
                });
            }
        }
    };

    const limits = SubscriptionService.getSubscriptionLimits(subscription);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-white mt-4">Loading subscription...</p>
                </div>
            </div>
        );
    }

    return createPortal (
        <div className="fixed inset-0 bg-black/90 border border-purple-900 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/90 border border-purple-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-purple-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <ArrowLeft className="h-4 w-4 text-white"/>
                        </Button>
                        <h2 className="text-2xl font-semibold text-white">Subscription Management</h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Current Plan */}
                    <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="h-5 w-5"/>
                                    Current Plan
                                </CardTitle>
                                <Badge variant={subscription ? 'default' : 'secondary'} className="bg-gradient-to-r from-purple-700 to-blue-700 text-gray-100">
                                    {limits.plan}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Projects</p>
                                    <p className="text-lg font-semibold text-white">{limits.projects}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Env Variables</p>
                                    <p className="text-lg font-semibold text-white">{limits.envVarsPerProject} each</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Team Members</p>
                                    <p className="text-lg font-semibold text-white">{limits.teamMembers}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">CLI Access</p>
                                    <p className="text-lg font-semibold text-white">
                                        {limits.hasCliAccess ? 'Full' : 'Limited'}
                                    </p>
                                </div>
                            </div>

                            {subscription && (
                                <div className="pt-6 mt-6 border-t border-gray-700/50 relative">
                                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                        <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-gray-100 px-3 py-1 rounded-full border border-gray-700/50 shadow-lg">
                                            <span className="text-xs font-medium ">SUBSCRIPTION STATUS</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-black/90 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                                                    <Calendar className="h-5 w-5 text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {subscription.renews_at ? 'Next Billing Date' : 'Expires On'}
                                                    </p>
                                                    <p className="text-sm text-white">
                                                        {new Date(subscription.renews_at || subscription.ends_at || '').toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={subscription.status === 'active' ? 'default' : 'destructive'}
                                                className="px-3 py-1.5 text-xs font-semibold shadow-md  bg-gradient-to-r from-purple-700 to-blue-700 text-gray-100"
                                            >
                                                {subscription.status_formatted}
                                            </Badge>
                                        </div>

                                        {subscription.card_brand && subscription.card_last_four && (
                                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br bg-black/90 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                                                {/* Card background pattern */}
                                                <div className="absolute inset-0 opacity-30">
                                                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                                </div>
                                                
                                                {/* Card content */}
                                                <div className="relative p-6">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-2">
                                                            {/* Card brand logo */}
                                                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                                                <CreditCard className="h-6 w-6 text-blue-300" />
                                                            </div>
                                                            <span className="text-sm font-medium text-white">
                                                                {subscription.card_brand.toUpperCase()}
                                                            </span>
                                                        </div>

                                                    </div>
                                                    
                                                    {/* Card number */}
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            <span className="text-white font-mono tracking-widest text-lg">
                                                                {subscription.card_last_four}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-white mt-1">Card number</p>
                                                    </div>
                                                    
                                                    {/* Card footer */}
                                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                        <div className="flex flex-col">
                                                            <p className="text-lg text-white">Expires</p>
                                                            <p className="text-sm text-white font-medium">••/••</p>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-1">
                                                                <p className="text-lg text-white">CVV</p>
                                                                <HelpCircle className="h-3 w-3 text-white/50" />
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Glow effect on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upgrade Options */}
                    {(!subscription || subscription.status !== 'active') && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Upgrade Your Plan</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-white">Pro Plan</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Perfect for individual developers
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-4">$4<span
                                            className="text-sm text-gray-400">/month</span></div>
                                        <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                            <li>• 10 projects (then $0.50 per project)</li>
                                            <li>• 50 env variables each (then $0.005 per env)</li>
                                            <li>• Full CLI access</li>
                                            <li>• No ads</li>
                                            <li>• Up to 5 team members (then $0.10 per member)</li>
                                        </ul>
                                        <Button
                                            onClick={() => handleUpgrade(881719, 'Pro')}
                                            disabled={upgrading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 group duration-300 transition-all"
                                        >
                                            {upgrading ? 'Processing...' : 'Upgrade to Pro'}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-white">Team Plan</CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Best for growing teams
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-4">$10<span
                                            className="text-sm text-gray-400">/month</span></div>
                                        <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                            <li>• 50 projects (then $0.50 per project)</li>
                                            <li>• 200 env variables each (then $0.005 per env)</li>
                                            <li>• Full CLI access</li>
                                            <li>• No ads</li>
                                            <li>• Up to 25 team members (then $0.10 per member)</li>
                                        </ul>
                                        <Button
                                            onClick={() => handleUpgrade(881732, 'Team')}
                                            disabled={upgrading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 group duration-300 transition-all"
                                        >
                                            {upgrading ? 'Processing...' : 'Upgrade to Team'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Cancel Subscription */}
                    {subscription && subscription.status === 'active' && (
                        <Card className="bg-gray-800 border-red-600">
                            <CardHeader>
                                <CardTitle className="text-red-400">Danger Zone</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Cancel your subscription. This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={handleCancel}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Cancel Subscription
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>,
            typeof window !== 'undefined' ? document.body : (null as any)
    );
};
