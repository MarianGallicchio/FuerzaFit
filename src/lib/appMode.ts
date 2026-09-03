// FuerzaFit Beta — Separación Admin / Socios por link.
// Mismo código, dos accesos que no mezclan datos ni roles:
//
//  - Panel dueño/staff:  https://tu-dominio.com/?app=admin   (o /?app=admin)
//  - App socios:         https://tu-dominio.com/?app=socio   (o /?app=socio)
//  - Modo completo (dev): sin parámetro o ?app=full
//
// También se puede fijar por build con VITE_APP_MODE=admin|socio|full.
// El modo solo controla QUÉ roles pueden iniciar sesión en esa URL.
// El aislamiento real de datos lo hace Supabase RLS por gym_id.

export type AppMode = 'full' | 'admin' | 'member';

const VALID_MODES: AppMode[] = ['full', 'admin', 'member'];

function normalizeMode(raw: string | null | undefined): AppMode | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'admin' || v === 'owner' || v === 'staff' || v === 'dueno' || v === 'dueño') return 'admin';
  if (v === 'socio' || v === 'socios' || v === 'member' || v === 'members' || v === 'atleta') return 'member';
  if (v === 'full' || v === 'all' || v === 'completo') return 'full';
  return null;
}

export function getAppMode(): AppMode {
  // 1. Query param tiene prioridad (permite 2 links con el mismo deploy)
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery =
      normalizeMode(params.get('app')) ||
      normalizeMode(params.get('mode')) ||
      // compat: ?admin=1  /  ?socio=1
      (params.has('admin') ? ('admin' as AppMode) : null) ||
      (params.has('socio') || params.has('member') ? ('member' as AppMode) : null);
    if (fromQuery && VALID_MODES.includes(fromQuery)) return fromQuery;
  } catch {
    // SSR / entorno sin window — caer a env
  }

  // 2. Variable de entorno (para builds separadas admin-dist / socio-dist)
  const fromEnv = normalizeMode(
    (import.meta as any)?.env?.VITE_APP_MODE as string | undefined
  );
  if (fromEnv && VALID_MODES.includes(fromEnv)) return fromEnv;

  return 'full';
}

export const isDemoModeEnabled = (): boolean => {
  // Solo en desarrollo local o con flag explícito se permiten atajos demo
  // (login 1-click, OTP 123456, switchUser). En beta con Supabase real: false.
  const flag = (import.meta as any)?.env?.VITE_DEMO_MODE as string | undefined;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return (import.meta as any)?.env?.DEV === true;
};

export interface AppModeConfig {
  mode: AppMode;
  badge: string;
  title: string;
  subtitle: string;
  allowedRoles: string[];
  loginHint: string;
}

export function getAppModeConfig(mode: AppMode): AppModeConfig {
  if (mode === 'admin') {
    return {
      mode,
      badge: 'Acceso Dueño / Staff · Beta',
      title: 'Panel del Gimnasio',
      subtitle: 'Gestión de socios, caja, accesos por DNI, rutinas y reportes.',
      allowedRoles: ['admin', 'reception', 'trainer', 'superadmin'],
      loginHint: 'Ingresá con tu cuenta de dueño o staff. Las cuentas de socio no pueden entrar por este link.'
    };
  }
  if (mode === 'member') {
    return {
      mode,
      badge: 'App Socios · Beta',
      title: 'Mi Entrenamiento',
      subtitle: 'Tu rutina, clases, progreso y credencial con DNI.',
      allowedRoles: ['member'],
      loginHint: 'Ingresá con tu cuenta de socio. El ingreso diario al gym es con tu DNI en recepción.'
    };
  }
  return {
    mode,
    badge: 'Beta',
    title: 'FuerzaFit',
    subtitle: 'Gestión integral para gimnasios.',
    allowedRoles: ['superadmin', 'admin', 'reception', 'trainer', 'member'],
    loginHint: ''
  };
}

export function isRoleAllowedInMode(role: string | undefined, mode: AppMode): boolean {
  if (mode === 'full') return true;
  const cfg = getAppModeConfig(mode);
  return !!role && cfg.allowedRoles.includes(role);
}

export function buildModeUrl(mode: Exclude<AppMode, 'full'>): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('app', mode === 'admin' ? 'admin' : 'socio');
    url.hash = '';
    return url.toString();
  } catch {
    return mode === 'admin' ? '?app=admin' : '?app=socio';
  }
}
