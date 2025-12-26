import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { GlassCard } from '../../ui/GlassCard';

interface OverwriteConfirmModalProps {
    isOpen: boolean;
    currentData: any[];
    savedData: any[];
    onConfirm: () => void;
    onCancel: () => void;
}

export const OverwriteConfirmModal: React.FC<OverwriteConfirmModalProps> = ({
    isOpen,
    currentData,
    savedData,
    onConfirm,
    onCancel
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <GlassCard className="max-w-xl mx-auto space-y-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                    <AlertCircle /> Overwrite Previous Data?
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Current (Local)</p>
                        {currentData.slice(0, 7).map(d => (
                            <div key={d.name} className="flex justify-between text-xs font-mono text-white">
                                <span className="text-slate-500">{d.name}</span>
                                <span>{d.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Saved (Cloud)</p>
                        {savedData && savedData.slice(0, 7).map((d: any) => (
                            <div key={d.name} className="flex justify-between text-xs font-mono text-slate-400">
                                <span className="text-slate-600">{d.name}</span>
                                <span>{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button onClick={onCancel} className="flex-1 px-4 py-3 border border-white/10 rounded-lg font-semibold text-white hover:bg-white/5 transition-colors">Keep Current</button>
                    <button onClick={onConfirm} className="flex-[2] px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity">Overwrite Data</button>
                </div>
            </GlassCard>
        </Modal>
    );
};
