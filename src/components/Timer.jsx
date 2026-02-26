import React, { useState, useEffect, useRef } from 'react';
import { useDataStore } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import SmartLockModal from './SmartLockModal';
import { Play, Pause, Square, Coffee, PlusCircle } from 'lucide-react';

export default function Timer() {
  const { subjects, addSession } = useDataStore();
  const navigate = useNavigate();

  // Configuration State
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || 'Math');
  const [inputMinutes, setInputMinutes] = useState(25);
  
  // Timer State
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'paused', 'rest'
  const [timeLeft, setTimeLeft] = useState(inputMinutes * 60);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  
  // Session Tracking Statistics
  const [totalStudyTime, setTotalStudyTime] = useState(0); // Track elapsed instead of remaining for stats
  const [breaksCount, setBreaksCount] = useState(0);

  // Smart Lock State
  const [showSmartLock, setShowSmartLock] = useState(false);

  // References
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(inputMinutes * 60);
    }
  }, [inputMinutes, status]);

  // Main Timer Tick
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
        setTotalStudyTime(prev => prev + 1);
      }, 1000);
    } else if (status === 'rest') {
      timerRef.current = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            handleEndRest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleStart = () => {
    if (inputMinutes <= 0) return;
    setStatus('running');
  };

  const handlePauseRequest = () => {
    // Show smart lock and keep timer running. Modals handle logic.
    setShowSmartLock(true);
  };

  const handleSmartLockSuccess = () => {
    setShowSmartLock(false);
    setStatus('paused');
  };

  const handleResume = () => {
    setStatus('running');
  };

  const handleAddFiveMins = () => {
    setTimeLeft(prev => prev + (5 * 60));
  };

  const handleTakeRest = () => {
    if (status === 'rest') return; // Prevent multiple rest
    setBreaksCount(prev => prev + 1);
    setStatus('rest');
    setRestTimeLeft(5 * 60); // Default 5 mins rest
  };

  const handleEndRest = () => {
    setStatus('running');
  };

  const handleTerminate = () => {
    // Save session upon manual termination or completion
    saveSessionAndExit();
  };

  const handleCompleteSession = () => {
    // Save session when timer hits 0 naturally
    setStatus('idle');
    saveSessionAndExit();
  };

  const saveSessionAndExit = () => {
    // Only save if we actually studied
    if (totalStudyTime > 5) {
      addSession({
        id: crypto.randomUUID(),
        subject: selectedSubject,
        duration: Math.floor(totalStudyTime / 60), // in minutes
        breaks: breaksCount,
        distractionCount: 0, // Not explicitly defined in new UI, defaulting to 0
        createdAt: new Date().toISOString()
      });
    }
    navigate('/analytics');
  };

  // Time Formatting HH:MM:SS
  const formatTime = (secondsTotal) => {
    if (secondsTotal < 0) secondsTotal = 0;
    const h = Math.floor(secondsTotal / 3600);
    const m = Math.floor((secondsTotal % 3600) / 60);
    const s = secondsTotal % 60;
    
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      
      {/* Smart Lock Overlay */}
      {showSmartLock && (
        <SmartLockModal 
          subject={selectedSubject} 
          onUnlock={handleSmartLockSuccess} 
        />
      )}

      {/* Configuration Phase */}
      {status === 'idle' && (
        <div className="glass p-8 rounded-3xl animate-fade-in relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl point-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-primary-500">⏱️</span> Configure Session
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="e.g. 25"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={inputMinutes <= 0 || !selectedSubject}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Play size={20} fill="currentColor" />
              Start Focus Session
            </button>
          </div>
        </div>
      )}

      {/* Active Timer Phase */}
      {status !== 'idle' && (
        <div className="glass p-8 rounded-3xl text-center border border-white/10 relative overflow-hidden shadow-2xl shadow-primary-500/5">
          
          {status === 'rest' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-accent-success animate-pulse"></div>
          )}
          
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-surface-hover border border-white/5 text-sm font-bold tracking-wider mb-6 text-primary-500 uppercase">
              {status === 'rest' ? 'Taking Rest' : `Focusing on ${selectedSubject}`}
            </span>
            
            <div className={`text-6xl md:text-8xl font-black tracking-tighter tabular-nums ${status === 'rest' ? 'text-accent-success' : 'text-white'}`}>
              {status === 'rest' ? formatTime(restTimeLeft) : formatTime(timeLeft)}
            </div>
            {status === 'paused' && (
              <p className="text-accent-warning mt-4 font-bold flex items-center justify-center gap-2">
                <Pause size={16} /> Paused
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            
            {status === 'running' && (
              <button 
                onClick={handlePauseRequest}
                className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-white/10 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                <Pause size={18} />
                Pause
              </button>
            )}

            {status === 'paused' && (
              <button 
                onClick={handleResume}
                className="flex flex-1 items-center justify-center gap-2 bg-accent-success hover:bg-emerald-400 text-background px-6 py-3 rounded-xl transition-colors font-bold"
              >
                <Play size={18} fill="currentColor" />
                Resume
              </button>
            )}

            {(status === 'running' || status === 'paused') && (
              <button 
                onClick={handleTakeRest}
                className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-white/10 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                <Coffee size={18} />
                Rest
              </button>
            )}

            {status === 'rest' && (
              <button 
                onClick={handleEndRest}
                className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-white/10 text-white px-6 py-3 rounded-xl transition-colors font-medium w-full sm:w-auto"
              >
                <Play size={18} />
                End Rest Early
              </button>
            )}

            <button 
              onClick={handleAddFiveMins}
              className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border border-white/10 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              <PlusCircle size={18} />
              +5 Min
            </button>

            <button 
              onClick={handleTerminate}
              className="flex items-center justify-center gap-2 bg-accent-danger/10 hover:bg-accent-danger text-accent-danger hover:text-white border border-accent-danger/20 hover:border-transparent px-6 py-3 rounded-xl transition-colors font-bold mt-4 sm:mt-0 w-full sm:w-auto"
            >
              <Square size={18} fill="currentColor" />
              Terminate
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
