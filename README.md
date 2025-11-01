# 🩺 IMR Sick Leave Prototype

## 📋 Overview

This is a simple prototype that allows employees to report sick leave via a clean, user-friendly interface.
The solution includes:

1. A form for reporting sick leave (date, reason, optional comment)
> _I have meade date and reason mandatory fields and comment is optional to
> encourage users to provide at least minimal context for their sick leave (e.g., flu, stress, etc.),
> since that can be valuable when identifying patterns later.
> Reason: data quality, data completeness and pattern detection accuracy in future._


2. A list view showing previously reported sick leaves

3. Basic CRUD operations (create, read, update, delete)
> **Currently** user can edit and delete the report
> However, in future, if admin approves the sick leave, the aproved reports will not be editable or deletable by the user. only Admin can do so.
> **For now**: Leave can be applied for today or previous dates, not for the future dates.
> However in future, Non working days, Holidays will also get eliminated_

5. Duplicate date detection (with option to edit existing)
6. Localized UI with i18n (English, Swedish, German)
7. The goal was to demonstrate structure, reasoning, and extensibility — not to build a full production system.


## ⚙️ Tech Stack
<img width="835" height="291" alt="tech-imr" src="https://github.com/user-attachments/assets/2ab305c6-6919-434e-a511-6364264551dd" />


## 🚀 Running the Project
### 1. Clone the repository

git clone https://github.com/<your-username>/imr-sick-leave-prototype.git
cd imr-sick-leave-prototype

### 2. Install dependencies in both 'client' and 'server' folder: 

cd server

npm install


cd ..

cd client

npm install

### 3. Setup environment variables (in server folder's .env file)

Create a .env file with your **OWN** 'Postgres connection string' and 'encryption key':

**DATABASE_URL**="postgresql://user:password@localhost:5432/sickleave"

**PORT**=4000

**ENCRYPTION_KEY**="You-need-to-generate-it-using-below-instructions"



🔐 You can generate a secure random key using Node.js or OpenSSL:

### Using Node.js

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

### Using OpenSSL

openssl rand -hex 32



### 🔐 Enable the pgcrypto extension in Neon

If you’re using Neon Postgres, pgcrypto is often pre-installed but disabled by default.

✅ Run the following once in your SQL editor (or in a migration):

CREATE EXTENSION IF NOT EXISTS pgcrypto;


✅ You can verify installation with:

SELECT * FROM pg_extension WHERE extname = 'pgcrypto';


### Grant proper permissions to your database user

If your Neon user (e.g., neondb_owner) doesn’t own the pgcrypto functions, you might need to grant usage and execute permissions. Run these two commands:

✅ -- Allow your user to use the public schema

GRANT USAGE ON SCHEMA public TO neondb_owner;

✅ -- Allow execution of pgcrypto functions

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO neondb_owner;


If these return “no privileges were granted,” that’s okay — it means your user already has access.

### 4. Run Prisma migrations (in server folder): 
npx prisma migrate dev

### 5. Start the server: 
npm run dev

### 6. Start Client: 
npm run dev

✅ The app should now be running at:

## Frontend: http://localhost:5173   
 (or similar Vite port)

## Backend API (tRPC): http://localhost:4000/trpc   


# 💡 Features

✅ Add a new sick leave report

🕒 View history of previous reports

✏️ Edit or delete existing entries

⚠️ Detect and handle duplicate dates

🌍 Multi-language support (EN / SV / DE)

🔄 Live data updates via tRPC

🧠 Type-safe end-to-end validation


# 🧩 App Screen:

<img width="1356" height="766" alt="IMR-START" src="https://github.com/user-attachments/assets/2e9ab8f9-27bc-4e68-957a-f95c5633f530" />

<img width="1356" height="766" alt="IMR1" src="https://github.com/user-attachments/assets/895e51fe-9aa9-47ba-aac9-2dff7d3bc2a6" />

<img width="1308" height="794" alt="KRVS" src="https://github.com/user-attachments/assets/b3673951-8c08-4d8b-a213-d1c217ae9a3f" />

<img width="1356" height="766" alt="IMR3" src="https://github.com/user-attachments/assets/97f2e09a-0e3c-4bfb-90c3-ab3d43142c10" />

<img width="1356" height="766" alt="IMR4" src="https://github.com/user-attachments/assets/9ee45e02-abed-4753-a085-65bdec9b2034" />

<img width="1356" height="766" alt="IMR5" src="https://github.com/user-attachments/assets/af80f1fd-653d-4585-9633-7dd6e180e80f" />

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

### 🔐 Privacy and Data Protection (In detail)

In this prototype, security mechanisms such as HTTPS, authentication, and encryption are not implemented, since the focus is on functionality and structure.
However, if this system were developed further into a production-ready application, I would ensure full data protection by introducing the following measures:

#### 1. Data in transit

All communication between the frontend, backend, and database would be encrypted using **HTTPS/TLS**.
This ensures that sensitive information (e.g., reasons for sick leave) cannot be intercepted during transmission.
For example, the backend API would be served over HTTPS, and any API requests would use secure credentials or tokens.

#### 2. Data at rest

Sensitive data stored in the database would be encrypted using **PostgreSQL’s pgcrypto extension** or **application-level AES encryption** or if using **AWS key manager**.

> _Although this prototype focuses on functionality, I implemented **real field-level encryption** for the `reason` and `comment` columns using PostgreSQL’s **pgcrypto** extension.  
> This ensures sensitive health-related data is stored **encrypted at rest**, while being automatically decrypted on retrieval through the backend logic.  
> The encryption key is provided via an environment variable (`ENCRYPTION_KEY`) and can be securely generated per environment.  
> This simulates how a production system would safeguard sensitive HR data._


This means that even if the database were compromised, the actual contents (like comments or reasons for sick leave) would remain unreadable.
Backups and logs would also be stored securely.
 
#### 3. Access control and authentication

In a full system:

**Authentication**: Each user would authenticate (e.g., via OAuth or secure sessions or AWS Cognito).

**Authorization**: Only the logged-in employee could access or edit their own records.

**RBAC**: HR or administrators would have restricted access through role-based permissions.

This prevents unauthorized access to health-related data.

#### 4. Compliance and retention

Data protection would follow GDPR and similar regulations e.g. HIPAA:

Store only the minimum necessary data.

Provide options to anonymize or delete old records after a certain period.

Log access to sensitive records for transparency and auditing.

#### 5. Infrastructure

Deployed systems would use:

Environment variables for secrets (no hardcoded credentials).

Secure Postgres connections using SSL.

Regular security patches and dependency scanning.




---

🔐 **_Security Highlight_**

_This prototype implements **real field-level encryption** using PostgreSQL’s `pgcrypto` extension.  
Sensitive data (the `reason` and `comment` fields) is stored **encrypted at rest** and automatically decrypted on retrieval.  
This mirrors how a production-grade HR system would handle health-related data securely._

---

✨ _Thank you for reviewing this prototype!_  
Built with ❤️ using **React**, **tRPC**, **Prisma**, and **PostgreSQL**.






