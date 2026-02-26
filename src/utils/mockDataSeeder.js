import { STORAGE_KEYS } from './storage';

const SUBJECTS = ['Calculus', 'Physics', 'Computer Science', 'Literature', 'History'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];

export function seedMockData() {
  const now = new Date();
  
  // 1. Generate Daily Checks (Last 30 Days)
  const dailyChecks = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dailyChecks.push({
      date: d.toISOString().split('T')[0],
      mood: randomInt(2, 5), // Slight bias to positive
      sleep: randomFloat(5.5, 9.0).toFixed(1),
      stress: randomInt(1, 4),
    });
  }

  // 2. Generate Sessions (2-4 per day for last 30 days)
  const sessions = [];
  let sessionId = 1;

  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    
    // Varying number of sessions per day
    const sessionsToday = randomInt(1, 5); 
    
    for (let j = 0; j < sessionsToday; j++) {
      // Sessions usually happen between 9 AM and 8 PM
      const hour = randomInt(9, 20);
      const minute = randomInt(0, 59);
      
      const startTime = new Date(d);
      startTime.setHours(hour, minute, 0);
      
      // Duration between 15 mins and 120 mins
      const durationMins = randomInt(15, 120);
      const durationMs = durationMins * 60 * 1000;
      
      const endTime = new Date(startTime.getTime() + durationMs);
      
      const breaks = Math.floor(durationMins / 30);
      const distractions = randomInt(0, Math.floor(durationMins / 15));
      
      // Correlate score slightly with time of day (simulate peak times)
      let scoreBase = 70;
      if (hour >= 15 && hour <= 18) scoreBase += 15; // Peak focus late afternoon
      if (hour < 10) scoreBase -= 10; // Groggy morning
      
      const session = {
        id: `demo_session_${sessionId++}`,
        subject: randomChoice(SUBJECTS),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMs, // ms
        breaks,
        distractionCount: distractions,
        mood: dailyChecks.find(c => c.date === d.toISOString().split('T')[0])?.mood || 3,
        focusScore: Math.min(100, Math.max(10, scoreBase + randomInt(-15, 15))), // Cap 10-100
        pomodoroUsed: Math.random() > 0.3
      };
      
      sessions.push(session);
    }
  }
  
  // Sort descending by start time
  sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  // Write to DB
  window.localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  window.localStorage.setItem(STORAGE_KEYS.DAILY_CHECKS, JSON.stringify(dailyChecks));
  window.localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ current: 4, longest: 12, lastStudyDate: now.toISOString() }));
  
  // Dispatch a custom event so context can re-sync if needed, 
  // or just reload page since it's a demo hard-reset.
  window.location.reload();
}
