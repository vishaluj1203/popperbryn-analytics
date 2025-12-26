import React, { useState } from 'react';
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Area, Cell, PieChart, Pie, Line, ComposedChart, AreaChart
} from 'recharts';
import {
    Activity, PhoneCall, Clock, CheckCircle, AlertCircle,
    Save, Mail, RefreshCcw, BarChart2, Info
} from 'lucide-react';
import { supabase } from './lib/supabase';

// --- Mock Data ---
const initialCallVolume = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 280 },
    { name: 'Fri', value: 590 },
    { name: 'Sat', value: 320 },
    { name: 'Sun', value: 150 },
];

const durationData = [
    { s: 0, count: 20 },
    { s: 30, count: 45 },
    { s: 60, count: 120 },
    { s: 90, count: 250 },
    { s: 120, count: 400 },
    { s: 150, count: 480 },
    { s: 180, count: 410 },
    { s: 210, count: 280 },
    { s: 240, count: 150 },
    { s: 270, count: 80 },
    { s: 300, count: 40 },
];

const sadPathMain = [
    { name: 'Caller Identification', value: 45, color: '#bfdbfe' },
    { name: 'Unsupported Language', value: 35, color: '#93c5fd' },
    { name: 'Customer Hostility', value: 20, color: '#bef264' },
];

const sadPathSub = [
    { name: 'User refused to confirm identity', value: 25, color: '#d1e6ff' },
    { name: 'Incorrect caller identity', value: 20, color: '#e2f0ff' },
    { name: 'Assistant did not speak French', value: 20, color: '#aacfff' },
    { name: 'Assistant did not speak Spanish', value: 15, color: '#bcdbff' },
    { name: 'Verbal Aggression', value: 12, color: '#d9f99d' },
    { name: 'Other hostility', value: 8, color: '#ecfccb' },
];

const performanceData = [
    { time: '00:00', latency: 45, accuracy: 92 },
    { time: '04:00', latency: 42, accuracy: 94 },
    { time: '08:00', latency: 55, accuracy: 88 },
    { time: '12:00', latency: 62, accuracy: 91 },
    { time: '16:00', latency: 48, accuracy: 95 },
    { time: '20:00', latency: 40, accuracy: 93 },
];

export default function Dashboard() {
    const [email, setEmail] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [callVolume, setCallVolume] = useState<any[]>(() => [...initialCallVolume]);
    const [prevValue, setPrevValue] = useState<any>(null);
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);

    // Check if user has configured environment variables
    const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY);

    // Load user data if email exists
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
                setCallVolume(data.chart_data.map((d: any) => ({ ...d }))); // Deep copy
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
            {/* Configuration Warning */}
            {!isSupabaseConfigured && (
                <div className="bg-amber-400/10 border border-amber-400/20 text-amber-400 p-4 rounded-lg flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        <strong>Storage Configuration Missing:</strong> Check <code>SUPABASE_SETUP.md</code> to enable real storage.
                    </p>
                </div>
            )}

            {/* Header */}
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

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Calls', value: '12,482', icon: PhoneCall, trend: '+12%', color: 'text-primary' },
                    { label: 'Avg Latency', value: '450ms', icon: Clock, trend: '-5%', color: 'text-accent' },
                    { label: 'Success Rate', value: '94.2%', icon: CheckCircle, trend: '+2%', color: 'text-emerald-400' },
                    { label: 'Active Agents', value: '24', icon: Activity, trend: 'stable', color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 group hover:border-primary/50 transition-all cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-primary" /> Daily Call Volume
                            </h3>
                            <p className="text-sm text-slate-400">Modify values in the inputs below</p>
                        </div>
                        <button
                            onClick={handleSaveClick}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${isEmailSubmitted
                                ? 'bg-primary text-primary-foreground hover:shadow-lg shadow-primary/20'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Analytics'}
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-8 items-end h-48">
                        {callVolume.map((item: any, i: number) => (
                            <div key={item.name} className="flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-sm transition-all duration-500 relative"
                                    style={{ height: `${(Math.min(Number(item.value) || 0, 600) / 600) * 100}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-bold text-primary">
                                        {item.value || 0}
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    value={item.value === undefined ? '' : item.value}
                                    onChange={(e) => handleValueChange(i, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded text-center text-xs py-1 focus:outline-none focus:border-primary transition-colors hover:border-white/20 relative z-10"
                                />
                                <span className="text-[10px] text-slate-500 uppercase font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={callVolume}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                                <YAxis fontSize={11} stroke="#64748b" />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" /> System Reliability
                    </h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" fontSize={11} stroke="#64748b" />
                                <YAxis fontSize={11} stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="accuracy" stroke="#818cf8" fillOpacity={1} fill="url(#colorAcc)" />
                                <Line type="monotone" dataKey="latency" stroke="#38bdf8" dot={false} strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* NEW Charts Row from Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Call Duration Analysis */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-medium mb-8 text-slate-200">Call Duration Analysis</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={durationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                    labelFormatter={(v) => `${v}s`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#38bdf8"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorDur)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] text-slate-500 font-medium px-4">
                        <span>0S</span>
                        <span>60S</span>
                        <span>120S</span>
                        <span>180S</span>
                        <span>240S</span>
                        <span>300S</span>
                    </div>
                </div>

                {/* Sad Path Analysis */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-medium mb-8 text-slate-200">Sad Path Analysis</h3>
                    <div className="h-[350px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sadPathMain}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sadPathMain.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Pie>
                                <Pie
                                    data={sadPathSub}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={110}
                                    outerRadius={140}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sadPathSub.map((entry, index) => (
                                        <Cell key={`cell-sub-${index}`} fill={entry.color} fillOpacity={0.5} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-200" /> Caller Identification</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-300" /> Unsupported Language</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-lime-300" /> Customer Hostility</div>
                        <div className="flex items-center gap-2 text-slate-500 italic flex-wrap"><Info className="w-3 h-3" /> Includes Spanish/French and Verbal Aggression sub-categories</div>
                    </div>
                </div>
            </div>

            {/* Persistence Modals */}
            {showEmailPrompt && (
                <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="glass-card max-w-sm w-full p-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold">Email Required</h2>
                        <p className="text-slate-400 text-sm">Connect your email to save custom values.</p>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                                <button type="button" onClick={() => setShowEmailPrompt(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-sm font-semibold">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm">Continue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showOverwriteConfirm && (
                <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="glass-card max-w-xl w-full p-8 space-y-8">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                            <AlertCircle /> Overwrite Previous Data?
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Current (Local)</p>
                                {callVolume.slice(0, 5).map(d => <div key={d.name} className="flex justify-between text-xs font-mono"><span className="text-slate-500">{d.name}</span><span>{d.value}</span></div>)}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Saved (Cloud)</p>
                                {prevValue && prevValue.slice(0, 5).map((d: any) => <div key={d.name} className="flex justify-between text-xs font-mono text-slate-400"><span className="text-slate-600">{d.name}</span><span>{d.value}</span></div>)}
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button onClick={() => setShowOverwriteConfirm(false)} className="flex-1 px-4 py-3 border border-white/10 rounded-lg font-semibold">Keep Current</button>
                            <button onClick={() => saveToSupabase(callVolume)} className="flex-[2] px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold">Overwrite Data</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
