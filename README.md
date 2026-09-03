# FuerzaFit — Gestión de Gimnasios 💪 (Beta)

Plataforma integral para gimnasios y estudios de entrenamiento (LATAM): roles de **Dueño/Admin** y **Socio**, rutinas interactivas, reservas de clases, control de acceso por **DNI + QR de alta**, caja y reportes.

## 🌐 Accesos de la beta (mismo deploy, datos separados por rol)

| Acceso | URL | Quién entra |
|---|---|---|
| Dueño / Staff | `/?app=admin` | admin, reception, trainer |
| Socios | `/?app=socio` | member |

Ejemplo local: `http://localhost:3000/?app=admin` y `http://localhost:3000/?app=socio`

Flujo de acceso: el socio se da de alta con **DNI obligatorio** (se genera su QR de alta) y el ingreso diario se valida por **DNI en recepción**. El QR es solo credencial del primer día.

## ▶️ Correr local

Requisitos: Node.js 18+

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## ☁️ Deploy (Railway / Render)

- Build: `npm run build` · Start: `npm start` (respeta `PORT` de la plataforma)
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEMO_MODE=false`
- Detalle beta: ver [BETA_GUIDE.md](./BETA_GUIDE.md)

## 🗄️ Base de datos (Supabase)

1. Correr `supabase_schema.sql` en SQL Editor
2. Correr `supabase_beta_hardening.sql` (cierra fugas multi-tenant + DNI único)
3. Sin Supabase configurado, la app corre en modo demo local.

## 🛠️ Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor dev (Express + Vite) puerto 3000 |
| `npm run build` | Build producción cliente + servidor |
| `npm start` | Servidor producción desde `dist/` |
| `npm run lint` | Chequeo TypeScript (`tsc --noEmit`) |
