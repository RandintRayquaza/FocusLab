import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Session from './pages/Session';
import DailyCheck from './pages/DailyCheck';
import Analytics from './pages/Analytics';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />

        {/* App Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session" element={<Session />} />
          <Route path="/check-in" element={<DailyCheck />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </DataProvider>
  )
}

export default App;
