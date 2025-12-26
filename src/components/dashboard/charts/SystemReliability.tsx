import React from 'react';
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface SystemReliabilityProps {
    data: any[];
}

export const SystemReliability: React.FC<SystemReliabilityProps> = ({ data }) => {
    return (
        <GlassCard>
            <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" /> System Reliability
            </h3>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
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
        </GlassCard>
    );
};
