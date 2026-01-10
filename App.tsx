import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { QuoteForm } from './components/QuoteForm';
import { QuoteResultCard } from './components/QuoteResultCard';
import { AuthModal } from './components/AuthModal';
import { RequestQuoteModal } from './components/RequestQuoteModal';
import { SuccessModal } from './components/SuccessModal';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CoverageModal } from './components/CoverageModal';
import { QuoteRequest, QuoteResult, User, CustomerDetails } from './types';
import { authService } from './services/authService';
import { rommaanaApi } from './services/api'; // Updated import
import { useLanguage } from './contexts/LanguageContext';
import { EmbeddedWidget } from './components/EmbeddedWidget';

function App() {
  // Check for Embed Route
  const isEmbed = window.location.pathname === '/embed';

  if (isEmbed) {
    return <EmbeddedWidget />;
  }

  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);

  // Navigation State
  const [view, setView] = useState<'HOME' | 'DASHBOARD' | 'ADMIN'>('HOME');

  // Quote State
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Initialization
  useEffect(() => {
    const initUser = async () => {
      // First get local session for fast initial load
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.role === 'ADMIN') setView('ADMIN');

        // Then refresh from server to catch role updates
        const refreshed = await authService.refreshUserProfile();
        if (refreshed) {
          setCurrentUser(refreshed);
          if (refreshed.role === 'ADMIN') setView('ADMIN');
          else if (view === 'ADMIN') setView('HOME');
        }
      }
    };
    initUser();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setView('ADMIN');
    } else {
      if (!quoteResult) {
        setView('DASHBOARD');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setView('HOME');
    handleResetQuote();
  };

  const handleQuoteGenerated = (result: QuoteResult, request: QuoteRequest) => {
    setQuoteResult(result);
    setQuoteRequest(request);
  };

  const handleResetQuote = () => {
    setQuoteResult(null);
    setQuoteRequest(null);
  };

  const handleRequestQuoteClick = () => {
    setIsRequestModalOpen(true);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleSubmitQuoteRequest = async (details: CustomerDetails) => {
    if (!quoteResult || !quoteRequest) return;

    setIsSubmittingQuote(true);
    try {
      // Use consolidated API
      await rommaanaApi.quotes.submit({
        customer: details,
        quoteRequest,
        quoteResult
      });
      setIsRequestModalOpen(false);

      // Show Success
      triggerConfetti();
      setIsSuccessModalOpen(true);

      handleResetQuote();
    } catch (e) {
      console.error(e);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmittingQuote(false);
    }
  }

  // Determine what to render based on View and Role
  const renderContent = () => {
    if (view === 'ADMIN' && currentUser?.role === 'ADMIN') {
      return <AdminDashboard user={currentUser} />;
    }

    if (view === 'DASHBOARD' && currentUser) {
      return <Dashboard user={currentUser} onShopNew={() => setView('HOME')} />;
    }

    // Default Home View
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Content or Result */}
          <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-32">
            {!quoteResult ? (
              <div className="animate-fadeIn space-y-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-pomegranate-100 text-pomegranate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{t('hero.partnerBadge')}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pomegranate-900 leading-tight">
                  {t('hero.title')} <span className="text-pomegranate-600">{t('hero.titleHighlight')}</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  {t('hero.subtitle')}
                </p>

                <div className="bg-white border-s-4 border-gold-500 p-6 rounded-e-xl shadow-sm max-w-xl">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <img
                        src="https://giraffy.com/storage/images/brands/5U5vBaOI45eaHKA4XKfjTUzivD0F2psTYPtOqNIw.png"
                        alt="Al Etihad"
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium italic text-lg leading-relaxed">
                        "{t('hero.etihadDesc')}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn delay-100">


                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-gold-100 p-3 rounded-lg text-gold-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('hero.bestPrice')}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-normal">{t('hero.bestPriceDesc')}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0-2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('hero.verified')}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-normal">{t('hero.verifiedDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-pomegranate-50 border border-pomegranate-100 rounded-xl p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-pomegranate-900 mb-4">{t('hero.whyRommaana')}</h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">{t('hero.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">{t('hero.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">{t('hero.feature3')}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Calculator and Features */}
          <div className="lg:col-span-5 space-y-6">
            {!quoteResult ? (
              <>
                <QuoteForm onQuoteGenerated={handleQuoteGenerated} />
              </>
            ) : (
              <QuoteResultCard
                result={quoteResult}
                request={quoteRequest!}
                onReset={handleResetQuote}
                onRequestQuote={handleRequestQuoteClick}
                onViewDetailedCoverage={() => setIsCoverageModalOpen(true)}
                isProcessing={false}
              />
            )}
          </div>

        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        user={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onDashboardClick={() => currentUser?.role === 'ADMIN' ? setView('ADMIN') : setView('DASHBOARD')}
        onLogoClick={() => setView('HOME')}
      />

      {renderContent()}


      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RequestQuoteModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleSubmitQuoteRequest}
        isSubmitting={isSubmittingQuote}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <CoverageModal
        isOpen={isCoverageModalOpen}
        onClose={() => setIsCoverageModalOpen(false)}
      />
    </div>
  );
}

export default App;