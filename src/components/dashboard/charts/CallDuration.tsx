import React from 'react';
import {
    AreaChart, Area, Tooltip, ResponsiveContainer
} from 'recharts';
import { GlassCard } from '../../ui/GlassCard';

interface CallDurationProps {
    data: any[];
}

export const CallDuration: React.FC<CallDurationProps> = ({ data }) => {
    return (
        <GlassCard>
            <h3 className="text-xl font-medium mb-8 text-slate-200">Call Duration Analysis</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
        </GlassCard>
    );
};
