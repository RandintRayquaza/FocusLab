# 🧠 MindTrack AI

MindTrack AI is a **100% frontend, privacy-first cognitive performance analytics platform**. It helps you track your study sessions, measure your focus, and understand how your sleep, stress, and mood affect your cognitive performance.

Built entirely to run locally in your browser, your data never leaves your device. No backend, no API keys, zero latency.

![MindTrack AI Prototype](https://img.shields.io/badge/Status-Prototype-success?style=for-the-badge) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Key Features

### 🔒 100% Offline & Private

All data is stored securely in your browser's `localStorage`. There are no external database connections or AI APIs. MindTrack AI guarantees absolute privacy.

### ⏱️ Smart Focus Timer with "Smart Lock"

A customizable Pomodoro timer that tracks your deep work.
**The Smart Lock mechanism:** If you try to pause your session, the timer _keeps running_ in the background until you correctly answer a randomized question based on your current subject. Only true focus allows a pause!

### 📊 Behavioral Intelligence Engine

Instead of generic LLM wrappers, MindTrack AI uses deterministic mathematical modeling to calculate:

- **Live Focus Score** (0-100) based on duration, distractions, and breaks.
- **Smart Pomodoro Recommendations** based on your past performance.
- **Sleep & Stress Correlations** to detect cognitive burnout before it happens.

### 📈 Advanced Analytics Dashboard

Visualize your past 7 days of performance:

- Weekly subject distribution (Bar Charts).
- Most studied subjects and total active hours.
- Mood vs. Focus scatter plots.
- Intelligent text-based insights dynamically generated from your patterns.

### 📚 Subject Management

Dynamically add, manage, and track custom subjects beyond the default Math, Physics, and Chemistry.

---

## 🛠️ Technology Stack

- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS (v3), custom glassmorphism utilities
- **Animations:** GSAP (ScrollTrigger), Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context API + LocalStorage Hooks

---

## 🚀 Getting Started

Since MindTrack AI is a purely frontend application, getting started is incredibly fast.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RandintRayquaza/FocusLab.git
   cd "MindTrack AI"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Demo Mode

Don't want to start from scratch?
Navigate to the **Dashboard** and click **"Load Demo Data"**. The data seeder will instantly mathematically generate 30 days of highly realistic daily check-ins and study sessions for you to explore the analytics engine.

---

## 📱 Mobile Responsive

MindTrack AI is designed with a mobile-first approach. The UI gracefully degrades, stacking timer controls and shifting the sidebar to a bottom navigation bar on smaller screens.

---

## 📜 License

This project was built for National Science Day. Open-sourced under the MIT License.
