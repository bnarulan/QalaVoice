# Жалобы и обратная связь

## Запуск

### 1. База данных
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env
pnpm install
npx prisma db push
pnpm start:dev
```
Backend порт **4000**.

### 3. Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

Откройте http://localhost:5173

## Первый админ
Только админы могут регистрировать пользователей. После `prisma db push` запустите seed:
```bash
cd backend
pnpm prisma:seed
```
Создаст админа: **ИИН 000000000001**, пароль **admin123**. Смените пароль после входа.
