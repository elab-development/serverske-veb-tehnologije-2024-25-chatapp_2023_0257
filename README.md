# Pokretanje projekta ChatApp

Ovaj dokument opisuje korake za lokalno pokretanje frontend i backend delova aplikacije.

## Pretpostavke
- Node.js (v16+ preporučeno) i npm instalirani
- Git (po potrebi)

## Struktura projekta (bitne mape)
- `backend/` – Express + TypeScript backend
- `frontend/` – React + Vite frontend

## Postavljanje okruženja
1. Kloniraj repozitorij i pozicioniraj se u radni folder:

```bash
git clone <repo-url>
cd chatapp
```

2. Kreiraj `.env` fajl u `backend/` direktorijumu (kopiraj iz postojećeg `.env.example` ako postoji) i postavi potrebne promenljive okoline. Tipične promenljive:

- `PORT` (npr. `5000`)
- `DATABASE_URL` (prisma/postgres)
- `JWT_SECRET`
- `API_URL` (npr. `http://localhost:5000`)

## Backend – razvoj
1. Instaliraj zavisnosti i pokreni development server:

```bash
cd backend
npm install
npm run dev
```

- Development skripta koristi `tsx watch src/server.ts`.
- Backend standardno sluša na portu definisanom u `.env` (podrazumevano `5000`).

2. Swagger UI (API dokumentacija) je dostupan nakon pokretanja backend-a na:

```
http://localhost:<PORT>/api-docs
```

3. Ako koristiš Prisma (migracije / seed):

```bash
cd backend
npx prisma migrate deploy    # ili npx prisma migrate dev za razvoj
npm run seed                 # ako postoji seed skripta
```

4. Kompajliranje TypeScript produkcionog build-a:

```bash
cd backend
npm run build
npm start
```

## Frontend – razvoj
1. Instaliraj zavisnosti i pokreni frontend development server:

```bash
cd frontend
npm install
npm run dev
```

- Vite dev server će obično biti dostupan na `http://localhost:5173`.
- Ako frontend treba da koristi backend API na lokalnom okruženju, proveri da li je `API_URL` ili slična konfiguracija pravilno postavljena u frontend konfiguraciji.

## Pokretanje u produkciji (osnovno)
1. Backend:

```bash
cd backend
npm install --production
npm run build
npm start
```

2. Frontend:

```bash
cd frontend
npm install
npm run build
# zatim servišite build sadržaj sa statičkim serverom (nginx, serve, itd.)
```

## Korisni debug saveti
- Ako port već koristi drugi proces (EADDRINUSE), na Windows-u možeš pronaći i ubiti proces:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

- Proveri `.env` promenljive i da li su zavisnosti instalirane u odgovarajućim folderima (`backend/` i `frontend/`).

## Lista ključnih komandi
- Backend development: `cd backend && npm install && npm run dev`
- Backend build: `cd backend && npm run build && npm start`
- Frontend development: `cd frontend && npm install && npm run dev`
- Swagger UI: `http://localhost:<PORT>/api-docs`

## Dodatne napomene
- Ako projekat koristi baze podataka, osiguraj da je baza dostupna i da `DATABASE_URL` pokazuje na ispravan servis.
- Ako imaš greške pri TypeScript build-u koje uključuju datoteke iz `prisma/` foldera, proveri `tsconfig.json` podešavanja `rootDir` i `include` opcije.

---

Ako želiš, mogu dodati uputstvo za deployment (Docker, PM2 ili nginx), detaljnije env primere, ili lokalne test skripte u ovaj dokument.