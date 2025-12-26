import React from 'react';
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BarChart2, Save } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface DailyCallVolumeProps {
    data: any[];
    onValueChange: (index: number, value: string) => void;
    onSave: () => void;
    isLoading: boolean;
    isEmailSubmitted: boolean;
}

export const DailyCallVolume: React.FC<DailyCallVolumeProps> = ({
    data,
    onValueChange,
    onSave,
    isLoading,
    isEmailSubmitted
}) => {
    return (
        <GlassCard className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary" /> Daily Call Volume
                    </h3>
                    <p className="text-sm text-slate-400">Modify values in the inputs below</p>
                </div>
                <button
                    onClick={onSave}
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
                {data.map((item: any, i: number) => (
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
                            onChange={(e) => onValueChange(i, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded text-center text-xs py-1 focus:outline-none focus:border-primary transition-colors hover:border-white/20 relative z-10"
                        />
                        <span className="text-[10px] text-slate-500 uppercase font-medium">{item.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={data}>
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
        </GlassCard>
    );
};
