import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Building2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { AdminRetentionDashboard } from './AdminRetentionDashboard';

export const AdminReportsView: React.FC = () => {
  const { payments, users, memberships, branches, classes } = useGym();

  const [activeReportTab, setActiveReportTab] = useState<'retention_occupancy' | 'financial'>('retention_occupancy');
  const [dateRange, setDateRange] = useState('month');

  // Peak hours data
  const peakHoursData = [
    { hour: '07:00', socios: 35 },
    { hour: '09:00', socios: 42 },
    { hour: '11:00', socios: 28 },
    { hour: '13:00', socios: 38 },
    { hour: '16:00', socios: 45 },
    { hour: '18:00', socios: 88 },
    { hour: '19:00', socios: 94 },
    { hour: '20:00', socios: 82 },
    { hour: '21:30', socios: 40 }
  ];

  // Retention & Churn trend
  const retentionData = [
    { month: 'May', retencion: 92, churn: 8 },
    { month: 'Jun', retencion: 94, churn: 6 },
    { month: 'Jul', retencion: 91, churn: 9 },
    { month: 'Ago', retencion: 95, churn: 5 },
    { month: 'Sep', retencion: 96, churn: 4 }
  ];

  const handleExportCSV = () => {
    alert('Exportando reporte contable completo a formato CSV / Excel...');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveReportTab('retention_occupancy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeReportTab === 'retention_occupancy'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Retención 12M & Ocupación Horaria (Recharts)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('financial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeReportTab === 'financial'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Facturación & MRR</span>
        </button>
      </div>

      {activeReportTab === 'retention_occupancy' ? (
        <AdminRetentionDashboard
          memberships={memberships}
          users={users}
          classes={classes}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Analítica & Inteligencia de Negocio
                </span>
                <span className="text-xs text-slate-400">LATAM Gym KPIs</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Reportes Financieros & Facturación</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Métricas de ingresos recurrentes (MRR), horarios de máxima afluencia y flujo de fondos.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Planilla Excel / CSV</span>
            </button>
          </div>


      {/* Financial KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">MRR (Ingreso Recurrente)</span>
          <p className="text-2xl font-black text-white">$5,640,000 <span className="text-xs font-normal text-slate-400">ARS</span></p>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +14.2% vs mes anterior
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasa de Retención</span>
          <p className="text-2xl font-black text-emerald-400">96.0%</p>
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Churn reducido a solo 4%
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ARPU (Ticket Promedio)</span>
          <p className="text-2xl font-black text-sky-400">$38,500 <span className="text-xs font-normal text-slate-400">ARS</span></p>
          <p className="text-xs text-slate-400">Por socio activo / mes</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cobranza Mercado Pago</span>
          <p className="text-2xl font-black text-emerald-400">92%</p>
          <p className="text-xs text-slate-400">Tasa de aprobación online</p>
        </div>
      </div>

      {/* Peak Hours & Occupancy Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Afluencia por Franja Horaria (Picos de Asistencia)</span>
            </h3>
            <p className="text-xs text-slate-400">Identificá las horas pico (18:00 - 20:30 hs) para optimizar staff</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} socios`, 'Concurrencia']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="socios" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Trend */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Evolución de la Retención de Socios (%)</span>
            </h3>
            <p className="text-xs text-slate-400">Comportamiento mensual tras automatizar recordatorios por WhatsApp</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Retención']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="retencion" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Multi-Branch Performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>Rendimiento Comparativo Multi-Sede</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {branches.map(b => (
            <div key={b.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{b.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                  Operativa
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{b.address}</p>

              <div className="pt-2 border-t border-slate-700/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ocupación Actual:</span>
                  <span className="font-bold text-white">{b.currentOccupancy} / {b.maxCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacidad en Uso:</span>
                  <span className="font-bold text-emerald-400">{Math.round((b.currentOccupancy / b.maxCapacity) * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}

</div>
  );
};
