import React, { useState } from 'react';
import { Mail, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';

import { StatsGrid } from './components/dashboard/StatsGrid';
import { DailyCallVolume } from './components/dashboard/charts/DailyCallVolume';
import { SystemReliability } from './components/dashboard/charts/SystemReliability';
import { CallDuration } from './components/dashboard/charts/CallDuration';
import { SadPathAnalysis } from './components/dashboard/charts/SadPathAnalysis';
import { EmailPromptModal } from './components/dashboard/modals/EmailPromptModal';
import { OverwriteConfirmModal } from './components/dashboard/modals/OverwriteConfirmModal';

import {
    initialCallVolume,
    durationData,
    sadPathMain,
    sadPathSub,
    performanceData
} from './mocks/analyticsData';

export default function Dashboard() {
    const [email, setEmail] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [callVolume, setCallVolume] = useState<any[]>(() => [...initialCallVolume]);
    const [prevValue, setPrevValue] = useState<any>(null);
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);

    const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY);

    const checkExistingData = async (userEmail: string) => {
        if (!isSupabaseConfigured) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_analytics')
                .select('chart_data')
                .eq('email', userEmail)
                .maybeSingle();

            if (data && data.chart_data) {
                setPrevValue(data.chart_data);
                setCallVolume(data.chart_data.map((d: any) => ({ ...d })));
            } else if (error) {
                console.error("Supabase check error:", error);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
        setIsLoading(false);
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsEmailSubmitted(true);
            setShowEmailPrompt(false);
            checkExistingData(email);
        }
    };

    const handleValueChange = (index: number, newValueString: string) => {
        setCallVolume(prev => {
            const next = [...prev];
            const val = newValueString === '' ? '' : parseInt(newValueString, 10);
            next[index] = {
                ...next[index],
                value: typeof val === 'number' && isNaN(val) ? 0 : val
            };
            return next;
        });
    };

    const saveToSupabase = async (dataToSave: any) => {
        if (!isSupabaseConfigured) {
            alert("Note: Supabase connection not configured. Settings saved locally for this session.");
            setPrevValue(dataToSave.map((d: any) => ({ ...d, value: Number(d.value) || 0 })));
            setShowOverwriteConfirm(false);
            return;
        }

        setIsLoading(true);
        const sanitizedData = dataToSave.map((d: any) => ({
            ...d,
            value: d.value === '' ? 0 : Number(d.value)
        }));

        const { error } = await supabase
            .from('user_analytics')
            .upsert({ email, chart_data: sanitizedData }, { onConflict: 'email' });

        if (!error) {
            setPrevValue(sanitizedData);
            setCallVolume(sanitizedData);
            setShowOverwriteConfirm(false);
        } else {
            console.error("Supabase Error:", error);
            alert("Error saving: " + error.message);
        }
        setIsLoading(false);
    };

    const handleSaveClick = () => {
        if (!isEmailSubmitted) {
            setShowEmailPrompt(true);
            return;
        }

        const currentSerialized = JSON.stringify(callVolume.map(d => ({ name: d.name, value: Number(d.value) || 0 })));
        const prevSerialized = prevValue ? JSON.stringify(prevValue.map((d: any) => ({ name: d.name, value: Number(d.value) || 0 }))) : null;
        const hasChanged = prevSerialized && currentSerialized !== prevSerialized;

        if (prevValue && hasChanged) {
            setShowOverwriteConfirm(true);
        } else if (!prevValue) {
            saveToSupabase(callVolume);
        } else {
            alert("No changes detected. Your data is already up to date.");
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 relative">
            {!isSupabaseConfigured && (
                <div className="bg-amber-400/10 border border-amber-400/20 text-amber-400 p-4 rounded-lg flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        <strong>Storage Configuration Missing:</strong> Check <code>SUPABASE_SETUP.md</code> to enable real storage.
                    </p>
                </div>
            )}

            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Voice Agent Analytics</h1>
                    <p className="text-slate-400">Observability for AI-driven customer interactions</p>
                </div>

                {!isEmailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="flex gap-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="email"
                                placeholder="Connect email to save"
                                className="bg-card border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all text-sm">
                            Connect
                        </button>
                    </form>
                ) : (
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{email}</span>
                        <button onClick={() => { setIsEmailSubmitted(false); setPrevValue(null); }} className="ml-2 hover:text-white transition-colors">
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <StatsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyCallVolume
                    data={callVolume}
                    onValueChange={handleValueChange}
                    onSave={handleSaveClick}
                    isLoading={isLoading}
                    isEmailSubmitted={isEmailSubmitted}
                />
                <SystemReliability data={performanceData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CallDuration data={durationData} />
                <SadPathAnalysis mainData={sadPathMain} subData={sadPathSub} />
            </div>

            {/* Modals */}
            <EmailPromptModal
                isOpen={showEmailPrompt}
                email={email}
                setEmail={setEmail}
                onSubmit={handleEmailSubmit}
                onClose={() => setShowEmailPrompt(false)}
            />

            <OverwriteConfirmModal
                isOpen={showOverwriteConfirm}
                currentData={callVolume}
                savedData={prevValue}
                onConfirm={() => saveToSupabase(callVolume)}
                onCancel={() => setShowOverwriteConfirm(false)}
            />
        </div>
    );
}
