export const initialCallVolume = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 280 },
    { name: 'Fri', value: 590 },
    { name: 'Sat', value: 320 },
    { name: 'Sun', value: 150 },
];

export const durationData = [
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

export const sadPathMain = [
    { name: 'Caller Identification', value: 45, color: '#bfdbfe' },
    { name: 'Unsupported Language', value: 35, color: '#93c5fd' },
    { name: 'Customer Hostility', value: 20, color: '#bef264' },
];

export const sadPathSub = [
    { name: 'User refused to confirm identity', value: 25, color: '#d1e6ff' },
    { name: 'Incorrect caller identity', value: 20, color: '#e2f0ff' },
    { name: 'Assistant did not speak French', value: 20, color: '#aacfff' },
    { name: 'Assistant did not speak Spanish', value: 15, color: '#bcdbff' },
    { name: 'Verbal Aggression', value: 12, color: '#d9f99d' },
    { name: 'Other hostility', value: 8, color: '#ecfccb' },
];

export const performanceData = [
    { time: '00:00', latency: 45, accuracy: 92 },
    { time: '04:00', latency: 42, accuracy: 94 },
    { time: '08:00', latency: 55, accuracy: 88 },
    { time: '12:00', latency: 62, accuracy: 91 },
    { time: '16:00', latency: 48, accuracy: 95 },
    { time: '20:00', latency: 40, accuracy: 93 },
];

export const statsOverview = [
    { label: 'Total Calls', value: '12,482', trend: '+12%', color: 'text-primary' },
    { label: 'Avg Latency', value: '450ms', trend: '-5%', color: 'text-accent' },
    { label: 'Success Rate', value: '94.2%', trend: '+2%', color: 'text-emerald-400' },
    { label: 'Active Agents', value: '24', trend: 'stable', color: 'text-blue-400' },
];
