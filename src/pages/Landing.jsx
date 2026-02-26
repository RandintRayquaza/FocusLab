import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef();

  useGSAP(() => {
    // Hero Animation
    gsap.from('.hero-element', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Scroll Animations for feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: i * 0.1
      });
    });

    // Intelligence Engine Demo Section
    gsap.from('.engine-demo', {
      scrollTrigger: {
        trigger: '.engine-section',
        start: 'top 70%',
      },
      scale: 0.8,
      opacity: 0,
      rotationX: 15,
      duration: 1.2,
      ease: 'power4.out',
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full point-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-success/10 blur-[150px] rounded-full point-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center p-6 pt-20 text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-sm font-semibold tracking-wide hero-element">
          National Science Day Edition
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 hero-element max-w-5xl leading-tight">
          Unlock Your <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-accent-success to-primary-500 bg-300% animate-gradient">
            Peak Focus.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-12 hero-element leading-relaxed">
          The first fully deterministic, privacy-first cognitive performance engine. 
          Zero backend. Zero APIs. 100% Behavioral Science.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 hero-element w-full sm:w-auto px-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:-translate-y-1 w-full sm:w-auto"
          >
            Launch Prototype
            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
          </button>
          
          <a href="#how-it-works" className="px-8 py-4 glass border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-lg transition-all duration-300 w-full sm:w-auto">
            Read the Science
          </a>
        </div>
      </section>

      {/* Features Array */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Intelligence Without the Cloud.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Deterministic Scoring",
              icon: "📊",
              desc: "Focus score calculated mathematically based on attention span theory, duration, break ratios, and distraction frequencies."
            },
            {
              title: "Smart Pomodoro",
              icon: "⏱️",
              desc: "The engine analyzes your last 10 sessions to predict and dynamically adjust your perfect focus window length."
            },
            {
              title: "100% Local Privacy",
              icon: "🔒",
              desc: "Your cognitive data never leaves your device. Everything runs via LocalStorage and client-side processing."
            }
          ].map((feat, i) => (
            <div key={i} className="feature-card glass p-8 rounded-[2rem] border border-white/5 hover:border-primary-500/30 transition-colors duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-500"></div>
              <div className="text-5xl mb-6">{feat.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engine Demo visual */}
      <section className="engine-section py-24 px-6 z-10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="engine-demo glass rounded-[3rem] p-2 md:p-12 border border-white/10 bg-surface-hover/50 shadow-2xl shadow-primary-500/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Behavioral Insight Engine</h2>
                <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                  We replaced generic AI wrappers with hard logic. By triangulating daily stress, sleep quality, and active study performance, FocusLab builds a unique cognitive profile for you.
                </p>
                <ul className="space-y-4">
                  {['Peak Time Detection', 'Burnout Prevention', 'Sleep-Focus Correlation'].map((item, i) => (
                    <li key={i} className="flex items-center text-lg font-medium">
                      <span className="w-6 h-6 rounded-full bg-accent-success/20 text-accent-success flex items-center justify-center mr-3 text-sm">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                {/* Decorative mock UI */}
                <div className="glass p-6 rounded-2xl border border-primary-500/30 bg-primary-500/5 rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-accent-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-accent-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-accent-success"></div>
                  </div>
                  <div className="space-y-4 font-mono text-sm leading-relaxed text-text-secondary">
                    <p><span className="text-primary-500">const</span> <span className="text-accent-warning">insightEngine</span> = <span className="text-accent-success">analyze</span>(localData);</p>
                    <p className="pl-4">if (sleep {'<'} 6.5 && focusDrop {'>'} 10%) {'{'}</p>
                    <p className="pl-8 text-white">yield "Critical rest required";</p>
                    <p className="pl-4">{'}'}</p>
                    <p className="pl-4 text-white hover:text-primary-500 transition-colors cursor-default">
                      // No API keys. Zero latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-text-secondary border-t border-white/5 mt-12 z-10 relative">
        <p className="font-medium">FocusLab v2.0</p>
        <p className="text-sm mt-2 opacity-50">Built for National Science Day.</p>
      </footer>
    </div>
  );
}
