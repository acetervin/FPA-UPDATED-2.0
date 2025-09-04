# Deploying Your Application

This guide provides instructions for deploying your separated frontend and backend to Vercel and Render, respectively.

## Prerequisites

1.  **Create a GitHub Repository**: Push your project code to a new repository on GitHub.
2.  **Create Free Accounts**:
    *   Sign up for a free account on [Vercel](https://vercel.com/signup).
    *   Sign up for a free account on [Render](https://dashboard.render.com/register).

---

## 1. Deploying the Backend to Render

Deploy your backend as a **Web Service** on Render.

*   **Root Directory**: Leave empty (or set to your project's root folder, e.g., `CompassionClone`).
*   **Runtime**: `Node`.
*   **Build Command**: `npm install && npm run build:server`
*   **Start Command**: `npm start`
*   **Environment Variables**: Add all required variables from your `.env` file (`DATABASE_URL`, `SESSION_SECRET`, etc.). Set `CORS_ORIGIN` to your Vercel frontend URL after it is deployed.

---

## 2. Deploying the Frontend to Vercel (Final Settings)

Deploy your frontend as a **Vite** project on Vercel.

### **Vercel Project Settings**

*   **Root Directory**: **Leave this field empty.** Vercel must use the root of your repository to find the `package.json` and `vite.config.ts`.
*   **Framework Preset**: `Vite`.
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist/client`
*   **Install Command**: `npm install`

### **Environment Variables**

*   **`VITE_API_URL`**: Set this to the URL of your **Render backend service** (e.g., `https://your-service-name.onrender.com`).

---

## 3. Final Step

After deploying both services, ensure the `CORS_ORIGIN` on your Render backend is set to your Vercel frontend's URL.

Your application is now ready!
