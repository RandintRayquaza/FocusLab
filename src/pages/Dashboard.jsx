import React, { useMemo } from 'react';
import { useDataStore } from '../context/DataContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { seedMockData } from '../utils/mockDataSeeder';
import { 
  detectPeakFocusTime, analyzeSleepCorrelation, monitorStress 
} from '../utils/insightEngine';

export default function Dashboard() {
  const { sessions, dailyChecks, streak } = useDataStore();

  const handleSeed = () => {
    seedMockData();
  };

  // 1. Calculate Summary Stats
  const { totalHours, avgScore } = useMemo(() => {
    let hrs = 0;
    let scoreSum = 0;
    sessions.forEach(s => {
      hrs += (s.duration / 1000 / 60 / 60);
      scoreSum += s.focusScore;
    });
    return {
      totalHours: hrs.toFixed(1),
      avgScore: sessions.length ? Math.round(scoreSum / sessions.length) : 0
    };
  }, [sessions]);

  // 2. Prepare 7-Day Trend Data
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => s.startTime.startsWith(dateStr));
      const _avg = daySessions.length 
        ? daySessions.reduce((acc, s) => acc + s.focusScore, 0) / daySessions.length 
        : 0;
        
      data.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateStr,
        score: Math.round(_avg)
      });
    }
    return data;
  }, [sessions]);

  // 3. Prepare Mood vs Focus Scatter Data
  const scatterData = useMemo(() => {
    return sessions.map(s => ({
      mood: s.mood,
      score: s.focusScore,
      subject: s.subject
    }));
  }, [sessions]);

  // 4. Generate Insights
  const peakTime = useMemo(() => detectPeakFocusTime(sessions), [sessions]);
  const sleepInsight = useMemo(() => analyzeSleepCorrelation(sessions, dailyChecks), [sessions, dailyChecks]);
  const stressWarning = useMemo(() => monitorStress(dailyChecks), [dailyChecks]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-hover p-3 rounded-lg border border-white/10 shadow-xl">
          <p className="text-secondary text-xs mb-1">{label}</p>
          <p className="font-bold text-primary-500">
            Avg Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-text-secondary">Your cognitive performance insights.</p>
        </div>
        
        <button 
          onClick={handleSeed}
          className="bg-surface hover:bg-surface-hover border border-white/10 px-4 py-2 rounded-xl text-sm transition-colors"
        >
          Load Demo Data
        </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-semibold">Avg Focus Score</h3>
          <p className="text-4xl font-black text-accent-success">{avgScore}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-semibold">Study Hours</h3>
          <p className="text-4xl font-black">{totalHours}<span className="text-xl text-text-secondary">h</span></p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-semibold">Streak</h3>
          <p className="text-4xl font-black text-accent-warning">{streak.current}<span className="text-xl text-text-secondary">d</span></p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-semibold">Sessions</h3>
          <p className="text-4xl font-black text-primary-500">{sessions.length}</p>
        </div>
      </div>

      {/* Intelligence Insights Panel */}
      <div className="glass p-6 rounded-2xl border border-primary-500/20 bg-primary-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full"></div>
        <h2 className="text-lg font-bold mb-4 flex items-center">
           <span className="w-2 h-2 rounded-full bg-primary-500 mr-3 animate-pulse"></span>
           Intelligence Engine Insights
        </h2>
        
        <ul className="space-y-3 relative z-10 text-sm md:text-base text-text-secondary">
          <li className="flex items-start">
            <span className="mr-2">🕒</span> 
            <span className="text-text-primary">{peakTime}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💤</span>
            <span className="text-text-primary">{sleepInsight}</span>
          </li>
          {stressWarning && (
            <li className="flex items-start text-accent-danger font-medium">
              <span className="mr-2">⚠️</span>
              {stressWarning}
            </li>
          )}
        </ul>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 7-Day Trend */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">7-Day Focus Trend</h3>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#a6adc8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#a6adc8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--color-primary-500)" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--color-background)', stroke: 'var(--color-primary-500)' }}
                  activeDot={{ r: 6, fill: 'var(--color-primary-500)', stroke: 'white' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood vs Focus Scatter */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Mood Impact Analysis</h3>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  dataKey="mood" 
                  name="Mood Level" 
                  domain={[1, 5]} 
                  stroke="#a6adc8"
                  tickCount={5}
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="score" 
                  name="Focus Score" 
                  domain={[0, 100]} 
                  stroke="#a6adc8"
                  fontSize={12}
                />
                <ZAxis type="category" dataKey="subject" name="Subject" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface-hover p-3 rounded-lg border border-white/10 shadow-xl">
                          <p className="font-bold text-white mb-1">{payload[2].value}</p>
                          <p className="text-xs text-text-secondary">Mood: {payload[0].value}/5</p>
                          <p className="text-xs text-text-secondary">Score: {payload[1].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Sessions" data={scatterData} fill="var(--color-accent-success)" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}
