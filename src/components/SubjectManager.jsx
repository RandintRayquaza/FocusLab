import React, { useState } from 'react';
import { useDataStore } from '../context/DataContext';
import { Plus, Trash2 } from 'lucide-react';

export default function SubjectManager() {
  const { subjects, setSubjects } = useDataStore();
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    
    // Check for duplicates (case insensitive)
    if (subjects.some(sub => sub.toLowerCase() === trimmed.toLowerCase())) {
      setNewSubject('');
      return;
    }

    setSubjects(prev => [...prev, trimmed]);
    setNewSubject('');
  };

  const handleDeleteSubject = (subjectToDelete) => {
    setSubjects(prev => prev.filter(sub => sub !== subjectToDelete));
  };

  return (
    <div className="glass p-6 rounded-2xl border border-white/5">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="bg-primary-500/20 text-primary-500 p-2 rounded-lg mr-3">📚</span>
        Manage Subjects
      </h3>
      
      <form onSubmit={handleAddSubject} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="New subject..." 
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
        <button 
          type="submit"
          disabled={!newSubject.trim()}
          className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all flex items-center justify-center"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {subjects.map(subject => (
          <div key={subject} className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-white/5 text-sm">
            <span>{subject}</span>
            {subjects.length > 1 && (
              <button 
                onClick={() => handleDeleteSubject(subject)}
                className="text-text-secondary hover:text-accent-danger transition-colors p-1 rounded hover:bg-white/5"
                title="Delete Subject"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="text-sm text-text-secondary italic">No subjects added. Add one to start tracking.</div>
        )}
      </div>
    </div>
  );
}
