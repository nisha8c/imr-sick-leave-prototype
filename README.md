# 🩺 IMR Sick Leave Prototype

## 📋 Overview

This is a simple prototype that allows employees to report sick leave via a clean, user-friendly interface.
The solution includes:

1. A form for reporting sick leave (date, optional reason, comment)
2. A list view showing previously reported sick leaves
3. Basic CRUD operations (create, read, update, delete)
4. Duplicate date detection (with option to edit existing)
5. Localized UI with i18n (English, Swedish, German)
6. The goal was to demonstrate structure, reasoning, and extensibility — not to build a full production system.


## ⚙️ Tech Stack
Layer	Technology
Frontend	React (TypeScript), Vite, React Hook Form, Zod, Tailwind CSS, i18next
Backend	Node.js, tRPC, Prisma
Database	PostgreSQL
Validation	Zod (shared between frontend & backend)
Date handling	Day.js (with timezone support)


## 🚀 Running the Project
1. Clone the repository
git clone https://github.com/<your-username>/imr-sick-leave-prototype.git
cd imr-sick-leave-prototype

2. Install dependencies in both 'client' and 'server' folder
npm install

3. Setup environment variables (in server folder's .env file)

Create a .env file with your Postgres connection string:

DATABASE_URL="postgresql://user:password@localhost:5432/sickleave"
PORT=4000

4. Run Prisma migrations (in server folder)
npx prisma migrate dev

5. Start the development server
npm run dev

6. Start Client
npm run dev


## 💡 Features

✅ Add a new sick leave report

🕒 View history of previous reports

✏️ Edit or delete existing entries

⚠️ Detect and handle duplicate dates

🌍 Multi-language support (EN / SV / DE)

🔄 Live data updates via tRPC

🧠 Type-safe end-to-end validation

## 🧩 App Screen:
<img width="1283" height="919" alt="imr-1" src="https://github.com/user-attachments/assets/b324f8ba-921b-4581-9925-b9a28c5506fe" />
<img width="1283" height="919" alt="imr2" src="https://github.com/user-attachments/assets/9dc213b6-ce9d-4654-99b0-d45fbb9be73a" />
<img width="1283" height="919" alt="exists-imr" src="https://github.com/user-attachments/assets/1d35c32b-bea1-4d56-b8ae-98dd5e318060" />
<img width="1283" height="919" alt="imr-edit" src="https://github.com/user-attachments/assets/4f8107b0-de61-48bc-830c-330cc188e1dc" />










