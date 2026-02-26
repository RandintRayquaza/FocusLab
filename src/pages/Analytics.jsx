import React, { useMemo } from 'react';
import { useDataStore } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Analytics() {
  const { sessions } = useDataStore();

  const analyticsData = useMemo(() => {
    // 1. Filter sessions from last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // We parse createdAt using Date, simple approach for LocalStorage
    const recentSessions = sessions.filter(s => new Date(s.createdAt) >= sevenDaysAgo);

    // 2. Group by subject and count occurrences
    const subjectCounts = {};
    let totalTime = 0;

    recentSessions.forEach(s => {
      subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1;
      totalTime += (s.duration || 0);
    });

    const chartData = Object.keys(subjectCounts).map(subject => ({
      subject,
      count: subjectCounts[subject]
    })).sort((a, b) => b.count - a.count); // Highest first

    const mostStudied = chartData.length > 0 ? chartData[0].subject : 'None';

    return {
      chartData,
      totalTime,
      mostStudied,
      recentCount: recentSessions.length
    };
  }, [sessions]);

  // Format total minutes to hours and minutes
  const formatTotalTime = (totalMins) => {
    if (totalMins < 60) return `${totalMins}m`;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Weekly Analytics</h1>
        <p className="text-text-secondary text-lg">Your study performance over the last 7 days.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl point-events-none"></div>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-2">Total Study Time</p>
          <p className="text-4xl font-black text-white">{formatTotalTime(analyticsData.totalTime)}</p>
          <p className="text-sm mt-2 text-text-secondary">Across {analyticsData.recentCount} sessions</p>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-warning/10 rounded-full blur-3xl point-events-none"></div>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-2">Most Studied</p>
          <p className="text-4xl font-black text-accent-warning">{analyticsData.mostStudied}</p>
          <p className="text-sm mt-2 text-text-secondary">Highest session count</p>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-success/10 rounded-full blur-3xl point-events-none"></div>
           <p className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-2">Active Habits</p>
           <p className="text-4xl font-black text-accent-success">{analyticsData.chartData.length}</p>
           <p className="text-sm mt-2 text-text-secondary">Subjects covered this week</p>
        </div>
      </div>

      <div className="glass p-6 md:p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-8">Sessions per Subject</h3>
        {analyticsData.chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3c" vertical={false} />
                <XAxis 
                  dataKey="subject" 
                  stroke="#a6adc8" 
                  tick={{fill: '#a6adc8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#a6adc8" 
                  tick={{fill: '#a6adc8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{fill: '#2a2a3c'}}
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#cdd6f4' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Sessions"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {analyticsData.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-text-secondary italic">
            No session data recorded in the last 7 days.
          </div>
        )}
      </div>

    </div>
  );
}
