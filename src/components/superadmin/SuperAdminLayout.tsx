import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { isSuperAdmin } from '../../lib/superadmin';
import { LogOut, Crown, Building2, CreditCard, LifeBuoy, Activity, Settings, Megaphone, ShieldAlert } from 'lucide-react';
import { SuperTenantsView } from './SuperTenantsView';
import { SuperBillingView } from './SuperBillingView';
import { SuperSupportView } from './SuperSupportView';
import { SuperOpsView } from './SuperOpsView';
import { SuperConfigView } from './SuperConfigView';

type Tab = 'tenants' | 'billing' | 'support' | 'ops' | 'config';

export const SuperAdminLayout: React.FC = () => {
  const { currentUser, logout } = useGym();
  const [tab, setTab] = useState<Tab>('tenants');

  if (!isSuperAdmin(currentUser)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
          <h1 className="font-black text-white">Zona Maestra — Solo SuperAdmin</h1>
          <p className="text-xs text-slate-400">Tu rol es {currentUser?.role}. Pedí acceso maestro.</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'tenants', label: 'Gimnasios', icon: <Building2 className="w-4 h-4" /> },
    { id: 'billing', label: 'Facturación', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'support', label: 'Soporte', icon: <LifeBuoy className="w-4 h-4" /> },
    { id: 'ops', label: 'Monitoreo', icon: <Activity className="w-4 h-4" /> },
    { id: 'config', label: 'Sistema', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-black">M</div>
          <div>
            <p className="text-sm font-black">MAESTRO</p>
            <p className="text-[11px] text-violet-300">SuperAdmin FuerzaFit</p>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${tab===t.id?'bg-violet-600 text-white':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <div className="text-xs mb-2"><p className="font-bold text-white truncate">{currentUser?.name}</p><p className="text-slate-400 truncate text-[11px]">{currentUser?.email}</p></div>
          <button onClick={() => logout()} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2"><LogOut className="w-4 h-4"/>Salir</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-black">Zona Maestra</span>
            <span className="hidden sm:inline text-xs text-slate-400">— 4 pilares: tenants · monetización · soporte · sistema</span>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} className={`p-2 rounded-xl ${tab===t.id?'bg-violet-600 text-white':'bg-slate-800 text-slate-400'}`}>{t.icon}</button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.12),_transparent_60%)]">
          {tab==='tenants' && <SuperTenantsView />}
          {tab==='billing' && <SuperBillingView />}
          {tab==='support' && <SuperSupportView />}
          {tab==='ops' && <SuperOpsView />}
          {tab==='config' && <SuperConfigView />}
        </main>
      </div>
    </div>
  );
};
