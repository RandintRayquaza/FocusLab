import React from 'react';
import Timer from '../components/Timer';
import SubjectManager from '../components/SubjectManager';

export default function Session() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
      
      <div className="w-full max-w-lg order-2 lg:order-1">
        <div className="text-center lg:text-left mb-8">
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 text-primary-500 rounded-full text-sm font-bold tracking-wider mb-4 border border-primary-500/20">
            Smart Tracker
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Deep Work Session</h1>
          <p className="text-text-secondary text-lg">
            Configure your study block. Once started, the Smart Lock will test your focus before letting you pause.
          </p>
        </div>
        <SubjectManager />
      </div>

      <div className="w-full max-w-lg order-1 lg:order-2">
         <Timer />
      </div>

    </div>
  );
}
