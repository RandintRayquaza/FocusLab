import React, { useState, useEffect } from 'react';
import { getRandomQuestion } from '../utils/questionBank';

export default function SmartLockModal({ subject, onUnlock }) {
  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    // Pick a random question when the modal mounts
    setQuestionData(getRandomQuestion(subject));
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionData) return;

    const trimmedInput = answer.trim().toLowerCase();
    const expectedAnswer = questionData.answer.trim().toLowerCase();

    if (trimmedInput === expectedAnswer) {
      setErrorText('');
      onUnlock();
    } else {
      setErrorText('Incorrect answer. The timer is still running!');
      setAnswer('');
    }
  };

  if (!questionData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl shadow-primary-500/10 border border-primary-500/20 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-danger via-accent-warning to-accent-success animate-gradient bg-300%"></div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-danger/20 text-accent-danger rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Smart Lock Active</h2>
          <p className="text-text-secondary text-sm">
            To pause your session, prove your focus. The timer is <strong className="text-accent-warning">still running</strong>.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-4 mb-6 text-center border border-white/5">
          <span className="text-xs text-primary-500 font-bold uppercase tracking-wider block mb-1">Subject: {subject}</span>
          <p className="font-medium text-lg">{questionData.question}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              autoFocus
              placeholder="Your answer..." 
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setErrorText(''); }}
              className={`w-full bg-surface border ${errorText ? 'border-accent-danger focus:border-accent-danger' : 'border-white/10 focus:border-primary-500'} rounded-xl px-4 py-3 focus:outline-none transition-colors`}
            />
            {errorText && (
              <p className="text-accent-danger text-sm mt-2 font-medium">{errorText}</p>
            )}
          </div>
          <button 
            type="submit"
            disabled={!answer.trim()}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
          >
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
}
