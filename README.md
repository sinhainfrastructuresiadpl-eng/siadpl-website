# SIADPL Website

React frontend with a Spring Boot API for contact enquiries.

## Run locally

Open two terminals from this folder:

```powershell
cd backend
mvn spring-boot:run
```

```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The React development server proxies `/api` requests to Spring Boot on port `8080`.

## Deploy to Cloudflare Pages + your API server

Frontend (Cloudflare Pages):
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-domain.example.com`

Backend (your server):
- Start with `java -jar target/siadpl-api-0.0.1-SNAPSHOT.jar` or `mvn spring-boot:run`.
- Set `PORT` if the platform provides one.
- Set `APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.example.com,https://www.your-frontend-domain.example.com`.
- Configure persistence/email before exposing the form publicly; enquiries are currently logged for review.

## Notes
## Email provider setup (recommended)

The backend can send each enquiry to your company inbox. If no email settings are configured, it still logs enquiries and reports that email is not configured.

Choose an SMTP provider such as SendGrid, Mailgun, Amazon SES, Resend, or your hosting provider.

Set these backend environment variables:

```text
ENQUIRY_RECIPIENT=sinhainfrastructure.siadpl@gmail.com
MAIL_HOST=smtp.provider.com
MAIL_PORT=587
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
MAIL_STARTTLS_REQUIRED=true
```

What happens:
1. Visitor submits the form.
2. Backend validates the data.
3. Backend logs the enquiry.
4. If SMTP is configured, backend sends an email to `ENQUIRY_RECIPIENT` with reply-to set to the visitor's email.

For better deliverability, verify your sender/domain with the provider and configure SPF, DKIM, and DMARC DNS records.

## PostgreSQL setup

The backend now stores enquiries in PostgreSQL.

### Self-hosted PostgreSQL example
Create database and user:

```sql
CREATE DATABASE siadpl;
CREATE USER siadpl_user WITH PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE siadpl TO siadpl_user;
```

Backend environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/siadpl
DB_USERNAME=siadpl_user
DB_PASSWORD=your_strong_password_here
JPA_DDL_AUTO=update
```

For production, avoid `JPA_DDL_AUTO=update` if possible. Prefer `validate` with Flyway/Liquibase migrations once your schema is stable.

### Managed PostgreSQL example
Use a provider such as Neon, Supabase, Railway, Render, or AWS RDS, then set:

```text
DB_URL=jdbc:postgresql://your-db-host:5432/siadpl
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JPA_DDL_AUTO=update
```

Notes:
- On first startup, Hibernate creates the `enquiries` table automatically.
- Enquiries are still logged and emailed when configured.
- For a real production database, keep backups and use a strong password.
- The API returns field-level validation errors as `{ "errors": { "field": "message" } }`.

## Local PostgreSQL now configured on this machine

A PostgreSQL 17 cluster has been initialized and started for development:

- Cluster data directory: `C:\Users\91865\pgdata17`
- Port: `5433` (port `5432` was unavailable/excluded on this machine)
- Database: `siadpl`
- Application user: `siadpl_user`
- Password: `your_strong_password_here`
- Superuser: `postgres` (local trust authentication)

Start the existing cluster manually:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D C:\Users\91865\pgdata17 -l C:\Users\91865\pglogs\pg17.log start
```

Stop it:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D C:\Users\91865\pgdata17 stop
```

Run the backend against this local database:

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://127.0.0.1:5433/siadpl"
$env:DB_USERNAME="siadpl_user"
$env:DB_PASSWORD="your_strong_password_here"
$env:JPA_DDL_AUTO="update"
mvn spring-boot:run
```

For production, keep using standard port `5432` and a managed PostgreSQL provider, with `JPA_DDL_AUTO=validate` once the schema is stable.
```
## Google Sheets sync (optional)

The backend can append every enquiry to a Google Sheet.

### 1. Create a Google Cloud service account
1. Create or select a Google Cloud project.
2. Enable the **Google Sheets API**.
3. Create a **Service Account**.
4. Create a **JSON key** for that service account and save it somewhere safe, for example `C:\secrets\siadpl-sheets-key.json`.
5. Create a Google Sheet with a tab named `Enquiries`.
6. Add a header row such as: `Timestamp`, `Name`, `Email`, `Phone`, `Subject`, `Message`.
7. Share the spreadsheet with the service account email (the `client_email` value from the JSON key) with Editor access.

### 2. Configure backend environment variables
```text
GOOGLE_SHEETS_ENABLED=true
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_SHEET_NAME=Enquiries
GOOGLE_SHEETS_CREDENTIALS_PATH=C:\secrets\siadpl-sheets-key.json
```

`GOOGLE_SHEETS_SPREADSHEET_ID` is the long ID in the Google Sheets URL between `/d/` and `/edit`.

If these variables are not configured, the API still saves enquiries to PostgreSQL and only reports that Google Sheets sync is not configured.
