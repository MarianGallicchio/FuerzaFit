import React, { useMemo, useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { PaymentModal } from './components/common/PaymentModal';
import { AuthModal } from './components/common/AuthModal';
import { MemberQrModal } from './components/member/MemberQrModal';
import { SupabaseSetupNotice } from './components/common/SupabaseSetupNotice';
import { isSupabaseConfigured } from './lib/supabase';
import { getAppMode, getAppModeConfig, isRoleAllowedInMode, buildModeUrl } from './lib/appMode';
import { ShieldCheck, User, LogOut, ArrowRight } from 'lucide-react';

// Distinct Role Layouts & Landing Page
import { LandingPage } from './components/common/LandingPage';
import { MemberLayout } from './components/member/MemberLayout';
import { AdminLayout } from './components/admin/AdminLayout';

const AppShell: React.FC = () => {
  const { currentUser, logout, getMembershipForUser, getPlanById } = useGym();

  // Modo de acceso: ?app=admin | ?app=socio | full (mismo deploy, dos links)
  const appMode = useMemo(() => getAppMode(), []);
  const modeConfig = useMemo(() => getAppModeConfig(appMode), [appMode]);
  const lockedRole = appMode === 'admin' ? ('admin' as const) : appMode === 'member' ? ('member' as const) : null;

  // Landing Page vs App View state
  const [showLanding, setShowLanding] = useState(false);
  const [selectedPlanForReg, setSelectedPlanForReg] = useState<string | undefined>(undefined);

  // Global Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register' | 'admin' | 'register_gym'>(
    // En links bloqueados, el modal abre directo en el rol correcto
    appMode === 'admin' ? 'admin' : 'login'
  );
  const [dismissNotice, setDismissNotice] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin' | 'register_gym' = 'login', planId?: string) => {
    // En links bloqueados no se permite cruzar de rol
    if (lockedRole === 'admin' && (mode === 'login' || mode === 'register')) {
      setAuthModalInitialMode('admin');
    } else if (lockedRole === 'member' && (mode === 'admin' || mode === 'register_gym')) {
      setAuthModalInitialMode('login');
    } else {
      setAuthModalInitialMode(mode);
    }
    setSelectedPlanForReg(planId);
    setIsAuthModalOpen(true);
  };

  const isAdmin = currentUser?.role === 'admin';
  const membership = currentUser && !isAdmin ? getMembershipForUser(currentUser.id) : null;
  const currentPlan = membership ? getPlanById(membership.planId) : null;

  // Guard: si hay sesión pero el rol no pertenece a este link, bloquear
  const roleAllowed = !currentUser || isRoleAllowedInMode(currentUser.role, appMode);

  return (
    <>
      {/* Franja de modo en links separados (no mezcla datos ni roles) */}
      {appMode !== 'full' && (
        <div className={`sticky top-0 z-40 px-4 py-1.5 text-center text-[11px] font-bold tracking-wide border-b ${
          appMode === 'admin'
            ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        }`}>
          {modeConfig.badge} · {modeConfig.loginHint}
        </div>
      )}

      {/* Notice if Supabase credentials are not configured */}
      {!isSupabaseConfigured && !dismissNotice && (
        <SupabaseSetupNotice onDismiss={() => setDismissNotice(true)} />
      )}

      {/* Bloqueo por rol cruzado: el dueño no entra por link socios y viceversa */}
      {currentUser && !roleAllowed ? (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center font-black ${
              appMode === 'admin' ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
            }`}>
              {appMode === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{modeConfig.badge}</p>
              <h1 className="text-xl font-black text-white mt-1">Esta cuenta no corresponde a este acceso</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {appMode === 'admin'
                  ? `La cuenta ${currentUser.email} es de socio. Este link es solo para dueño/staff. Abrí el link de socios para continuar.`
                  : `La cuenta ${currentUser.email} es de staff/administración. Este link es solo para socios. Abrí el link de administración para continuar.`}
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <a
                href={buildModeUrl(appMode === 'admin' ? 'member' : 'admin')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
              >
                <span>Ir al acceso correcto</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => logout()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión e ingresar con otra cuenta</span>
              </button>
            </div>
          </div>
        </div>
      ) : /* 1. If not authenticated OR explicitly viewing public landing page */
      !currentUser || showLanding ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
          onGoToDashboard={() => setShowLanding(false)}
          onLogout={logout}
        />
      ) : isAdmin ? (
        /* 2. Admin / Gym Owner Experience (SaaS ERP with Desktop Sidebar & Dense Tables) */
        <AdminLayout
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onOpenAuthModal={(mode) => handleOpenAuth(mode === 'profiles' ? 'login' : mode)}
          onViewLanding={() => setShowLanding(true)}
        />
      ) : (
        /* 3. Member / Athlete Experience (Consumer Fitness App, Mobile-First & Motivational) */
        <MemberLayout
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onOpenAuthModal={(mode) => handleOpenAuth(mode === 'profiles' ? 'login' : mode)}
          onViewLanding={() => setShowLanding(true)}
        />
      )}

      {/* Global Modals */}
      <MemberQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={currentPlan}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setShowLanding(false);
        }}
        initialMode={authModalInitialMode}
        initialPlanId={selectedPlanForReg}
        lockedRole={lockedRole}
      />
    </>
  );
};

export default function App() {
  return (
    <GymProvider>
      <AppShell />
    </GymProvider>
  );
}
