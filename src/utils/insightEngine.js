
export function calculateFocusScore({ durationMins, breaks, distractions, mood }) {
  const optimalDuration = 45; 
  
  // 1. Duration logic (up to 40 pts)
  const durationScore = Math.min(40, (durationMins / optimalDuration) * 40);
  
  // 2. Break ratio (up to 40 pts). A 60m session with 5 mins break is good.
  const breakRatioScore = Math.min(40, ((durationMins - (breaks * 5)) / durationMins) * 40);

  // 3. Distractions (up to 20 pts)
  const distractionScore = Math.max(0, 20 - (distractions * 5));

  // Base Score
  let score = durationScore + breakRatioScore + distractionScore;

  // Mood Multiplier
  let multiplier = 1.0;
  if (mood >= 5) multiplier = 1.1;
  else if (mood <= 2) multiplier = 0.9;

  return Math.max(10, Math.min(100, Math.round(score * multiplier)));
}

/**
 * Analyzes Peak Focus Time Window
 */
export function detectPeakFocusTime(sessions) {
  if (!sessions || sessions.length < 5) {
    return "Need more sessions to calculate peak focus time.";
  }

  const hourBuckets = Array(24).fill(0).map(() => ({ totalScore: 0, count: 0 }));

  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    hourBuckets[hour].totalScore += session.focusScore;
    hourBuckets[hour].count += 1;
  });

  let bestHour = -1;
  let maxAvg = 0;

  hourBuckets.forEach((bucket, hour) => {
    if (bucket.count > 0) {
      const avg = bucket.totalScore / bucket.count;
      if (avg > maxAvg && bucket.count >= 2) {
        maxAvg = avg;
        bestHour = hour;
      }
    }
  });

  if (bestHour === -1) return "Keep studying! System is analyzing your schedule.";
  
  const formattedStart = bestHour > 12 ? `${bestHour - 12} PM` : `${bestHour || 12} AM`;
  const formattedEnd = (bestHour + 2) > 12 ? `${(bestHour + 2) - 12} PM` : `${bestHour + 2} AM`;

  return `Your peak cognitive performance occurs between ${formattedStart} and ${formattedEnd}.`;
}

/**
 * Analyzes correlation between sleep and focus score
 */
export function analyzeSleepCorrelation(sessions, dailyChecks) {
  if (!dailyChecks || dailyChecks.length < 3 || !sessions || sessions.length < 3) {
    return "Consistently log sleep for personalized insights.";
  }

  // Calculate avg focus per day
  const focusByDate = {};
  sessions.forEach(s => {
    const dateStr = s.startTime.split('T')[0];
    if (!focusByDate[dateStr]) focusByDate[dateStr] = { sum: 0, count: 0 };
    focusByDate[dateStr].sum += s.focusScore;
    focusByDate[dateStr].count++;
  });

  let lowSleepDays = 0;
  let lowSleepFocusAvg = 0;
  let normalSleepFocusAvg = 0;
  let normalSleepDays = 0;

  dailyChecks.forEach(check => {
    if (focusByDate[check.date]) {
      const dailyAvg = focusByDate[check.date].sum / focusByDate[check.date].count;
      if (check.sleep < 6.5) {
        lowSleepDays++;
        lowSleepFocusAvg += dailyAvg;
      } else {
        normalSleepDays++;
        normalSleepFocusAvg += dailyAvg;
      }
    }
  });

  if (lowSleepDays === 0) return "Great job maintaining healthy sleep habits!";
  if (normalSleepDays === 0) return "Warning: Chronicle sleep deficit detected. Please rest.";

  lowSleepFocusAvg /= lowSleepDays;
  normalSleepFocusAvg /= normalSleepDays;

  if (normalSleepFocusAvg > lowSleepFocusAvg * 1.1) {
    const drop = Math.round(((normalSleepFocusAvg - lowSleepFocusAvg) / normalSleepFocusAvg) * 100);
    return `Low sleep (<6.5h) reduces your focus capacity by approximately ${drop}%.`;
  }
  
  return "Your focus remains resilient regardless of sleep, but aim for 7+ hours for memory consolidation.";
}

/**
 * Predicts optimal Pomodoro length based on recent performance
 */
export function predictSmartPomodoro(sessions) {
  if (!sessions || sessions.length < 5) return 25; // Default

  // Look at last 10 sessions
  const recent = sessions.slice(0, 10);
  let totalDurationMins = 0;
  let totalScore = 0;
  
  recent.forEach(s => {
    totalDurationMins += (s.duration / 1000 / 60);
    totalScore += s.focusScore;
  });

  const avgDuration = totalDurationMins / recent.length;
  const avgScore = totalScore / recent.length;

  let recommendation = avgDuration;

  if (avgScore > 80) recommendation += 5; // Can handle more
  else if (avgScore < 50) recommendation -= 5; // Overloaded

  // Clamp between 15 and 60
  return Math.max(15, Math.min(60, Math.round(recommendation)));
}

/**
 * Stress monitor
 */
export function monitorStress(dailyChecks) {
  if (!dailyChecks || dailyChecks.length < 3) return null;
  const recent = dailyChecks.slice(0, 3);
  const avgStress = recent.reduce((sum, c) => sum + c.stress, 0) / 3;
  
  if (avgStress >= 3.5) {
    return "High cognitive load detected. Consider lighter study sessions today and prioritize recovery.";
  }
  return null; // No warning needed
}
