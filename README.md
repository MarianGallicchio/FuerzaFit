# FuerzaFit — Gestión de Gimnasios 💪 (Beta)

Plataforma integral para gimnasios y estudios de entrenamiento (LATAM): roles de **Dueño/Admin** y **Socio**, rutinas interactivas, reservas de clases, control de acceso por **DNI + QR de alta**, caja y reportes.

## 🌐 Accesos (mismo deploy, páginas separadas)

| Acceso | URL principal | Fallback legacy | Quién entra |
|---|---|---|---|
| Maestro (SuperAdmin) | `/maestro` | `/superadmin` o `/?app=maestro` | superadmin |
| Dueño / Staff | `/admin` | `/?app=admin` | admin, reception, trainer |
| Socios | `/socio` | `/?app=socio` | member |
| Landing / Venta | `/` | — | público |

Ejemplo local: `http://localhost:3000/maestro` (maestro), `http://localhost:3000/admin` y `http://localhost:3000/socio`.

Flujo de acceso: el socio se da de alta con **DNI obligatorio** (se genera su QR de alta) y el ingreso diario se valida por **DNI en recepción**. El QR es solo credencial del primer día. La Zona Maestra (`/maestro`) es solo para `profiles.role='superadmin'` con guard `is_superadmin()`.

## ▶️ Correr local

Requisitos: Node.js 18+

```bash
npm install
npm run dev
```

Abrí:
- http://localhost:3000/       (landing con dos accesos)
- http://localhost:3000/admin (solo admin)
- http://localhost:3000/socio (solo socios · probar `BIENVENIDA20` en pago)

Probá descuento 1ª cuota: Alta socio → Descuento `%` o `$` + motivo → ver PDF con `Subtotal / Descuento / Neto`.

## ☁️ Deploy (Railway / Render)

- Build: `npm run build` · Start: `npm start` (respeta `PORT` de la plataforma)
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEMO_MODE=false`
- Detalle beta: ver [BETA_GUIDE.md](./BETA_GUIDE.md)

## 🗄️ Base de datos (Supabase)

1. Correr `supabase_schema.sql` en SQL Editor
2. Correr `supabase_beta_hardening.sql` (cierra fugas multi-tenant + DNI único)
3. Correr `supabase_migration_discount.sql` (agrega `discount_ars` / `discount_reason` para promos 1ª cuota)
4. Correr `supabase_superadmin.sql` (Zona Maestra: `tenant_subscriptions`, `tenant_invoices`, `support_tickets`, `audit_logs`, `feature_flags`, etc.)
5. Sin Supabase configurado, la app corre en modo demo local (Maestro con datos mock).

## 🛠️ Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor dev (Express + Vite) puerto 3000 |
| `npm run build` | Build producción cliente + servidor |
| `npm start` | Servidor producción desde `dist/` |
| `npm run lint` | Chequeo TypeScript (`tsc --noEmit`) |
