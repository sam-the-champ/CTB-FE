**Collaborative Task Board (Frontend)**

A high-performance, responsive React application designed to interface with the Task Board secure backend. This client features a robust authentication flow, optimistic UI updates, and a "Meta-level" security architecture designed to handle session management seamlessly.

🚀** Architectural Highlights**
Silent Authentication: Uses Axios Interceptors to perform "Silent Refresh" of JWTs. The user session is maintained without ever needing to store sensitive tokens in LocalStorage.

Optimistic UI: Powered by TanStack Query, the UI updates instantly upon user interaction. If the backend request fails, the application automatically rolls back to the previous state, ensuring data consistency.

State Management: Uses Zustand for atomic global state, avoiding the re-render performance pitfalls of standard Context API.

Security-First: * No XSS exposure (tokens stored in-memory).

Protected Routes using React Router to guard sensitive views.

Standardized Error Handling with consistent JSON response parsing.

Theme: Optimized Dark Mode for high-productivity workflows using Tailwind CSS.

**🛠 Tech Stack**
Build Tool: Vite

Language: TypeScript

State: Zustand

Server State: TanStack Query (React Query)

Styling: Tailwind CSS

Form Logic: React Hook Form + Zod (Validation)

API Client: Axios (Interceptors enabled)

**📋 Prerequisites**
Node.js (v18+)

A running instance of the Task Board Backend

⚙️ **Installation & Setup**
Clone the repository:

Bash
git clone https://github.com/your-username/task-board-frontend.git
cd task-board-frontend
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory:

Code snippet
VITE_API_URL=http://localhost:5000/api
Run Development Server:

Bash
npm run dev
🏗 Key Engineering Patterns
The Axios Interceptor
The application utilizes a custom Axios client that acts as a middleware for all network requests.

Request: Automatically injects the bearer token from memory.

Response: On a 401 Unauthorized error, it automatically pauses outgoing requests, invokes the /refresh token endpoint, updates the global window.accessToken, and retries the original request.

Optimistic Mutation Logic
All task interactions (Create/Update) leverage TanStack Query’s onMutate hook:

TypeScript
onMutate: async (newTask) => {
  await queryClient.cancelQueries({ queryKey: ['tasks'] });
  const previousTasks = queryClient.getQueryData(['tasks']);
  // ... Update UI immediately
  return { previousTasks };
},
onError: (err, newTask, context) => {
  // ... Rollback on failure
},
**📁 Project Structure**
Plaintext
src/
├── api/          # Axios interceptors and API service definitions
├── components/   # Atomic UI components
├── hooks/        # Custom reusable logic
├── pages/        # Route-level views (Login, Dashboard)
├── store/        # Zustand global state (Auth, UI)
├── types/        # TypeScript interfaces and Zod schemas
└── utils/        # Helper functions and validators
**🛡️ Security Disclaimer**
This application stores tokens in-memory. This prevents XSS attacks from accessing the session token. Ensure that your production environment uses strict CSP (Content Security Policy) headers on the server side to further mitigate risks.
