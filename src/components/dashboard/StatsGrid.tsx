import React from 'react';
import { PhoneCall, Clock, CheckCircle, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { statsOverview } from '../../mocks/analyticsData';

export const StatsGrid: React.FC = () => {
    const iconMap: Record<string, any> = {
        'Total Calls': PhoneCall,
        'Avg Latency': Clock,
        'Success Rate': CheckCircle,
        'Active Agents': Activity,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsOverview.map((stat, i) => {
                const Icon = iconMap[stat.label] || Activity;
                return (
                    <GlassCard key={i} className="group hover:border-primary/50 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
                    </GlassCard>
                );
            })}
        </div>
    );
};
