import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScorecardProvider } from './context/ScorecardContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LandingPage from './pages/LandingPage';
import CalculatorPage from './pages/CalculatorPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScorecardProvider>
        <div className="app-root">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/"           element={<LandingPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/results"    element={<ResultsPage />} />
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ScorecardProvider>
    </BrowserRouter>
  );
}
