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

The backend currently validates and logs enquiries. Add a database and/or email provider before deploying it publicly.
