import React from 'react';
import { Mail } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { GlassCard } from '../../ui/GlassCard';

interface EmailPromptModalProps {
    isOpen: boolean;
    email: string;
    setEmail: (email: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export const EmailPromptModal: React.FC<EmailPromptModalProps> = ({
    isOpen,
    email,
    setEmail,
    onSubmit,
    onClose
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <GlassCard className="max-w-sm mx-auto text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">Email Required</h2>
                <p className="text-slate-400 text-sm">Connect your email to save custom values.</p>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-card border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        required
                    />
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-sm font-semibold text-white hover:bg-white/5 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">Continue</button>
                    </div>
                </form>
            </GlassCard>
        </Modal>
    );
};
