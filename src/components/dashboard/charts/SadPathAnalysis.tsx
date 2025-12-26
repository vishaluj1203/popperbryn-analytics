import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface SadPathAnalysisProps {
    mainData: any[];
    subData: any[];
}

export const SadPathAnalysis: React.FC<SadPathAnalysisProps> = ({ mainData, subData }) => {
    return (
        <GlassCard>
            <h3 className="text-xl font-medium mb-8 text-slate-200">Sad Path Analysis</h3>
            <div className="h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={mainData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            stroke="none"
                        >
                            {mainData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                        </Pie>
                        <Pie
                            data={subData}
                            cx="50%"
                            cy="50%"
                            innerRadius={110}
                            outerRadius={140}
                            dataKey="value"
                            stroke="none"
                        >
                            {subData.map((entry, index) => (
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
        </GlassCard>
    );
};
