import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { ProjectRole } from '@/types/project';

interface InviteMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inviteEmail: string;
    setInviteEmail: (email: string) => void;
    inviteRole: ProjectRole;
    setInviteRole: (role: ProjectRole) => void;
    accessPassword: string;
    setAccessPassword: (password: string) => void;
    confirmAccessPassword: string;
    setConfirmAccessPassword: (password: string) => void;
    projectPassword: string;
    setProjectPassword: (password: string) => void;
    showAccessPassword: boolean;
    setShowAccessPassword: (show: boolean) => void;
    showConfirmAccessPassword: boolean;
    setShowConfirmAccessPassword: (show: boolean) => void;
    showProjectPassword: boolean;
    setShowProjectPassword: (show: boolean) => void;
    passwordError: string;
    isPasswordValid: boolean;
    canInviteMore: boolean;
    onInvite: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
                                                                 open,
                                                                 onOpenChange,
                                                                 inviteEmail,
                                                                 setInviteEmail,
                                                                 inviteRole,
                                                                 setInviteRole,
                                                                 accessPassword,
                                                                 setAccessPassword,
                                                                 confirmAccessPassword,
                                                                 setConfirmAccessPassword,
                                                                 projectPassword,
                                                                 setProjectPassword,
                                                                 showAccessPassword,
                                                                 setShowAccessPassword,
                                                                 showConfirmAccessPassword,
                                                                 setShowConfirmAccessPassword,
                                                                 showProjectPassword,
                                                                 setShowProjectPassword,
                                                                 passwordError,
                                                                 isPasswordValid,
                                                                 canInviteMore,
                                                                 onInvite,
                                                             }) => {
    const [emailError, setEmailError] = useState('');

    const PasswordRequirement = ({ label, isValid }: { label: string; isValid: boolean }) => (
        <div className="flex items-center space-x-2">
            {isValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${isValid ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
        </div>
    );

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!re.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInviteEmail(value);
        if (emailError) {
            validateEmail(value);
        }
    };

    const handleInvite = () => {
        if (!validateEmail(inviteEmail)) {
            return;
        }
        onInvite();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] bg-black border border-purple-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Invite a new member to collaborate on this project
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="off"
                            value={inviteEmail}
                            onChange={handleEmailChange}
                            onBlur={() => validateEmail(inviteEmail)}
                            placeholder="user@example.com"
                            className={`bg-black/70 border-purple-800 text-white ${
                                emailError ? 'border-red-500' : ''
                            }`}
                        />
                        {emailError && (
                            <p className="text-xs text-red-500 mt-1">{emailError}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-300">
                            Role
                        </Label>
                        <Select
                            value={inviteRole}
                            onValueChange={(value) => setInviteRole(value as ProjectRole)}
                        >
                            <SelectTrigger className="w-full bg-black/70 border border-purple-800 text-white">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/70 border border-purple-800 text-white">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-400 mt-1">
                            {inviteRole === 'admin'
                                ? 'Admins can manage environment variables and project settings'
                                : 'Users have read-only access to environment variables'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="accessPassword" className="text-gray-300">
                                Access Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="accessPassword"
                                type={showAccessPassword ? 'text' : 'password'}
                                value={accessPassword}
                                autoComplete="new-password"
                                onChange={(e) => setAccessPassword(e.target.value)}
                                placeholder="Set a password for the new member"
                                className="bg-black/70 border border-purple-800 text-white pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                                onClick={() => setShowAccessPassword(!showAccessPassword)}
                            >
                                {showAccessPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-yellow-400 mt-1">
                            Note: Please share this password with your team member. We're currently working on a secure way to transfer this password to the dedicated member.
                        </p>
                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <PasswordRequirement
                                    label="8+ characters"
                                    isValid={accessPassword.length >= 8}
                                />
                                <PasswordRequirement
                                    label="Uppercase letter"
                                    isValid={/[A-Z]/.test(accessPassword)}
                                />
                                <PasswordRequirement
                                    label="Lowercase letter"
                                    isValid={/[a-z]/.test(accessPassword)}
                                />
                                <PasswordRequirement
                                    label="Number"
                                    isValid={/\d/.test(accessPassword)}
                                />
                                <PasswordRequirement
                                    label="Special character"
                                    isValid={/[!@#$%^&*(),.?":{}|<>]/.test(accessPassword)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="confirmAccessPassword" className="text-gray-300">
                                Confirm Access Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="confirmAccessPassword"
                                type={showConfirmAccessPassword ? 'text' : 'password'}
                                value={confirmAccessPassword}
                                autoComplete="new-password"
                                onChange={(e) => setConfirmAccessPassword(e.target.value)}
                                placeholder="Confirm the password"
                                className={`bg-black/70 border border-purple-800 text-white pr-10 ${
                                    confirmAccessPassword && accessPassword !== confirmAccessPassword ? 'border-red-500' : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmAccessPassword(!showConfirmAccessPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showConfirmAccessPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {confirmAccessPassword && accessPassword !== confirmAccessPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                        {confirmAccessPassword && accessPassword === confirmAccessPassword && accessPassword && (
                            <div className="flex items-center text-xs text-green-500 mt-1">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Passwords match
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="projectPassword" className="text-gray-300">
                                Project Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="projectPassword"
                                type={showProjectPassword ? 'text' : 'password'}
                                value={projectPassword}
                                autoComplete="off"
                                onChange={(e) => setProjectPassword(e.target.value)}
                                placeholder="Enter your project password"
                                className="bg-black/70 border border-purple-800 text-white pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowProjectPassword(!showProjectPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showProjectPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                        }}
                        className="border-gray-700 text-gray hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleInvite}
                        disabled={!isPasswordValid || !projectPassword.trim() || !!emailError}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Send Invitation
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};