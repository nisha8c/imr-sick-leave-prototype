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
<img width="835" height="291" alt="tech-imr" src="https://github.com/user-attachments/assets/2ab305c6-6919-434e-a511-6364264551dd" />


## 🚀 Running the Project
1. Clone the repository
git clone https://github.com/<your-username>/imr-sick-leave-prototype.git
cd imr-sick-leave-prototype

2. Install dependencies in both 'client' and 'server' folder: 
npm install

3. Setup environment variables (in server folder's .env file)

Create a .env file with your Postgres connection string:

DATABASE_URL="postgresql://user:password@localhost:5432/sickleave"
PORT=4000

4. Run Prisma migrations (in server folder): 
npx prisma migrate dev

5. Start the development server: 
npm run dev

6. Start Client: 
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
<img width="1028" height="918" alt="IMR-1" src="https://github.com/user-attachments/assets/f4715fc4-995d-4eb2-86f5-ec3fcbefbfba" />
<img width="1283" height="919" alt="imr2" src="https://github.com/user-attachments/assets/9dc213b6-ce9d-4654-99b0-d45fbb9be73a" />
<img width="1283" height="919" alt="exists-imr" src="https://github.com/user-attachments/assets/1d35c32b-bea1-4d56-b8ae-98dd5e318060" />
<img width="1283" height="919" alt="imr-edit" src="https://github.com/user-attachments/assets/4f8107b0-de61-48bc-830c-330cc188e1dc" />
<img width="1283" height="919" alt="german-imr" src="https://github.com/user-attachments/assets/4df1e806-2e13-4b52-82cc-dbdc958eb761" />
<img width="1283" height="919" alt="svenska-imr" src="https://github.com/user-attachments/assets/276f04e5-a453-4a49-b33d-8ce21c4bdfb1" />

## 🧪 Testing the API (Important Note about tRPC)

tRPC endpoints (like `sickLeave.create`, `sickLeave.list`, etc.) are **not traditional REST APIs**.  
They are **remote procedure calls (RPCs)** that can only be invoked through the **frontend client**.

### For example, the route:
http://localhost:4000/trpc/sickLeave.create
will show:

{
  "error": {
    "message": "Unsupported GET-request to mutation procedure at path \"sickLeave.create\"",
    "code": -32005,
    "data": {
      "code": "METHOD_NOT_SUPPORTED",
      "httpStatus": 405,
      "stack": "TRPCError: Unsupported GET-request to mutation procedure at path \"sickLeave.create\"\n    at /Users/nishachavan/imr-sick-leave/server/node_modules/@trpc/server/dist/resolveResponse-OV7qVwiT.cjs:1937:67\n    at Array.map (\u003Canonymous\u003E)\n    at Object.resolveResponse (/Users/nishachavan/imr-sick-leave/server/node_modules/@trpc/server/dist/resolveResponse-OV7qVwiT.cjs:1929:31)\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at async /Users/nishachavan/imr-sick-leave/server/node_modules/@trpc/server/dist/node-http-D37fGQh1.cjs:201:22",
      "path": "sickLeave.create"
    }
  }
}


### BUT : 
if you try to open it in the browser — this is expected.

## ✅ To test them properly:
1. Run both frontend and backend.
2. Open your app in the browser → [http://localhost:5173](http://localhost:5173)
3. Create a sick leave report using the form.
4. Open **DevTools → Network tab**.
5. You’ll see a `POST` request to:


<img width="753" height="832" alt="Api-test-imr" src="https://github.com/user-attachments/assets/ccdf938d-5d31-4047-8e92-18597af4ae9d" />


# 🧠 Reflection
## 1. How did you structure your solution and why?
I structured the project with a clear separation between frontend, backend, and shared logic to ensure scalability and maintainability.


The frontend (React + TypeScript + Tailwind) focuses on a clean, accessible UI for submitting and viewing sick leave reports.


The backend uses tRPC and Prisma to provide a type-safe API connected to a PostgreSQL database. This allows consistent typing across client and server without manual API schema maintenance.


Validation is centralized using Zod, ensuring data consistency both in frontend forms and backend input handling.


The app uses Day.js with timezone support to handle local time accurately and prevent duplicates for the same date in different time zones.


Components are modular and reusable (SickLeaveFormFields, ReusableSelect, ConfirmDialog, etc.) to support scalability.
This structure mirrors how I would build a real-world production feature — type-safe, modular, and easily extendable.



## 2. What would you do differently if you had more time?
If I had more time, I would:


Add authentication and user roles (employee, HR, admin) to simulate real usage scenarios.


Implement analytics and dashboards to visualize sick leave trends over time.


Add tests (unit and integration) with Jest for better reliability.


Improve responsive UI with charts and visual summaries of leave statistics.


Integrate server-side validation for overlapping leaves across multiple users.


Add deployment setup with Docker for smoother local and production environments.



## 3. How could you eventually identify patterns in sick leave data?
With more time and data, I could build analytics features to identify patterns such as:


Frequent sick leave days per employee, team, or department.


Seasonal trends, such as spikes in flu-related leaves during winter.


Common reasons for absence using keyword aggregation.


Frequency and duration of leaves over time.
These insights could be visualized with charts and heatmaps to help HR teams detect early signs of health issues or workload-related stress.
This would also allow predictive analysis (e.g., “increased absences in March due to burnout patterns”).



## 4. Did you consider any aspects related to privacy or data protection?
Yes — even though this is a prototype, I considered basic data protection principles:


The stored data is minimal (only date, reason, comment, timezone) and contains no personal identifiers.


In a real-world scenario, I would ensure compliance with GDPR and other privacy laws.


Sensitive data (like health-related information) would be encrypted at rest and in transit (using HTTPS and database encryption).


Only authorized users (e.g., employees and HR) would have access to their own or team data.


I would also implement data retention policies to automatically delete old or irrelevant records.











