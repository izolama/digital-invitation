# Fix Deploy Error: package-lock.json Out of Sync

## Problem
Deploy gagal karena `package-lock.json` tidak sinkron dengan `package.json`. Package `react-qr-code` sudah ditambahkan ke `package.json` tapi belum ada di `package-lock.json`.

## Solution

### Step 1: Commit package-lock.json (di local machine)

```bash
cd /home/nannahs/Documents/projects/digital-invitation
git add package-lock.json
git commit -m "Update package-lock.json: Add react-qr-code dependency"
git push origin main
```

### Step 2: Deploy di server

```bash
cd /var/www/digital-invitation
git pull origin main
./deploy.sh
```

## Alternative: Update package-lock.json di server

Jika tidak bisa commit dari local, update langsung di server:

```bash
cd /var/www/digital-invitation
npm install
git add package-lock.json
git commit -m "Update package-lock.json: Add react-qr-code dependency"
git push origin main
./deploy.sh
```

## Verification

Setelah deploy, verify dengan:
```bash
docker-compose logs -f frontend
```

Container frontend harus berjalan tanpa error.

