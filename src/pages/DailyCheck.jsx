import React, { useState } from 'react';
import { useDataStore } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function DailyCheck() {
  const { addDailyCheck, dailyChecks } = useDataStore();
  const navigate = useNavigate();

  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = dailyChecks.some(c => c.date === todayStr);

  const handleSave = () => {
    addDailyCheck({
      date: todayStr,
      mood,
      sleep,
      stress
    });
    setIsSaved(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  if (hasCheckedInToday && !isSaved) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="glass p-12 rounded-3xl text-center max-w-md w-full">
            <span className="text-4xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold mb-2">Already Checked In!</h2>
            <p className="text-text-secondary mb-6">Your data for today ({todayStr}) is saved.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-surface hover:bg-surface-hover border border-white/10 px-6 py-2 rounded-xl text-sm transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 rounded-3xl w-full max-w-lg relative overflow-hidden">
        
        <h2 className="text-3xl font-bold mb-2">Daily Check-in</h2>
        <p className="text-text-secondary mb-8">Calibrating your intelligence engine.</p>

        {isSaved ? (
          <div className="py-12 text-center animate-fade-in">
             <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-primary-500 mb-2">Engine Calibrated</h3>
            <p className="text-text-secondary text-sm">Redirecting to Dashboard...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Mood Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold">Mood</label>
                <span className="text-primary-500 font-bold">{mood}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={mood} 
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full accent-primary-500 h-2 bg-surface rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>Terrible</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Sleep Score */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold">Sleep Quality (Hours)</label>
                <span className="text-primary-500 font-bold">{sleep}h</span>
              </div>
              <input 
                type="range" min="0" max="12" step="0.5"
                value={sleep} 
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-primary-500 h-2 bg-surface rounded-lg appearance-none cursor-pointer" 
              />
            </div>

            {/* Stress Level */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold">Stress Level</label>
                <span className="text-accent-warning font-bold">{stress}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={stress} 
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-warning h-2 bg-surface rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>Relaxed</span>
                <span>Overwhelmed</span>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold mt-4 transition-colors"
            >
              Save Check-in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
