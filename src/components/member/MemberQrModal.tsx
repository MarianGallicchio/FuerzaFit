import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  IdCard
} from 'lucide-react';
import { motion } from 'motion/react';

interface MemberQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPayment?: () => void;
}

export const MemberQrModal: React.FC<MemberQrModalProps> = ({ isOpen, onClose, onOpenPayment }) => {
  const { currentUser, getMembershipForUser, getPlanById, branches, selectedBranchId } = useGym();

  const membership = currentUser ? getMembershipForUser(currentUser.id) : null;
  const plan = membership ? getPlanById(membership.planId) : null;
  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  if (!isOpen || !currentUser) return null;

  const now = new Date();
  const expiryDate = membership ? new Date(membership.endDate) : null;
  const isExpired = expiryDate ? expiryDate < now : true;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  const graceDays = plan?.gracePeriodDays || 0;
  const isInGracePeriod = isExpired && expiryDate && (now.getTime() - expiryDate.getTime()) <= graceDays * 24 * 60 * 60 * 1000;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden text-center"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wider text-emerald-400 uppercase">Mi credencial de socio</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Profile brief */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-md"
          />
          <div className="text-left">
            <p className="font-extrabold text-base text-white leading-tight">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{plan?.name || 'Socio FuerzaFit'}</p>
          </div>
        </div>

        {/* DNI - ÚNICO MÉTODO DE INGRESO */}
        <div className="mx-auto w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-5 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">Mi DNI · único ingreso al gym</p>
          <p className="text-4xl font-black tracking-[0.2em] text-white font-mono mt-1">
            {currentUser.dni || 'Sin DNI'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">Mostrá este número en recepción o tipea tu DNI en la ventana que te muestra el admin.</p>
          {!currentUser.dni && (
            <p className="text-[11px] text-amber-300 mt-1">Pedí en recepción que carguen tu DNI.</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2">
          <IdCard className="w-4 h-4 text-emerald-400" />
          <span>Ingreso solo con DNI — nada para escanear</span>
        </div>

        {/* Status indicator Card */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estado de Membresía:</span>
            {membership?.status === 'suspended' ? (
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Suspendida
              </span>
            ) : isExpired ? (
              isInGracePeriod ? (
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Período de Gracia
                </span>
              ) : (
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Vencida
                </span>
              )
            ) : (
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Activa ({daysLeft} días restantes)
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Vence el:</span>
            <span className="font-medium text-slate-200">
              {expiryDate ? expiryDate.toLocaleDateString('es-AR') : 'Sin membresía'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sede Actual:</span>
            <span className="font-medium text-slate-200 truncate max-w-[170px]">{currentBranch.name}</span>
          </div>
        </div>

        {/* Action buttons - solo DNI, sin escanear */}
        <div className="mt-5 space-y-2">
          {(isExpired || (daysLeft <= 5 && !isExpired)) && onOpenPayment && (
            <button
              onClick={() => {
                onClose();
                onOpenPayment?.();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
            >
              Renovar con Mercado Pago
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
