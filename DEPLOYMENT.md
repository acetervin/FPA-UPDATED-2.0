# Deploying Your Application

This guide provides instructions for deploying your separated frontend and backend to Vercel and Render, respectively.

## Prerequisites

1.  **Create a GitHub Repository**: Push your project code to a new repository on GitHub. Both Vercel and Render will connect to this repository.
2.  **Create Free Accounts**:
    *   Sign up for a free account on [Vercel](https://vercel.com/signup) using your GitHub account.
    *   Sign up for a free account on [Render](https://dashboard.render.com/register) using your GitHub account.

---

## 1. Deploying the Backend to Render

Your backend server will be deployed as a **Web Service** on Render.

### **Step 1: Create a New Web Service**

1.  From your Render dashboard, click **New +** and select **Web Service**.
2.  Connect your GitHub account and select your project's repository.
3.  Give your service a unique name (e.g., `compassion-clone-api`).

### **Step 2: Configure the Service**

Use the following settings for your web service:

*   **Region**: Choose a region close to you.
*   **Branch**: Select your main branch (e.g., `main` or `master`).
*   **Root Directory**: `CompassionClone` (or the subdirectory where your `package.json` is located).
*   **Runtime**: `Node`.
*   **Build Command**: `npm install && npm run build:server`
*   **Start Command**: `npm start`
*   **Plan**: Select the **Free** plan.

### **Step 3: Add Environment Variables**

This is a critical step. Go to the **Environment** tab and add the following variables.

*   **`NODE_ENV`**: Set this to `production`.
*   **`DATABASE_URL`**: Your connection string for your PostgreSQL or Neon database.
*   **`SESSION_SECRET`**: A long, random string for securing user sessions. You can generate one with `openssl rand -hex 32` in your terminal.
*   **`CORS_ORIGIN`**: Leave this blank for now. We will fill this in after deploying the frontend.

Add any other required secrets from your `.env` file (e.g., `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`).

### **Step 4: Deploy**

Click **Create Web Service**. Render will pull your code, build the server, and deploy it. Once it's live, copy the URL of your service (it will look like `https://your-service-name.onrender.com`).

---

## 2. Deploying the Frontend to Vercel

Your React frontend will be deployed as a static site on Vercel.

### **Step 1: Create a New Project**

1.  From your Vercel dashboard, click **Add New...** and select **Project**.
2.  Select your GitHub repository. Vercel will automatically detect that it's a Vite project.

### **Step 2: Configure the Project**

1.  **Root Directory**: Navigate and select the `client` directory inside your `CompassionClone` folder.
2.  Vercel should automatically configure the build and output settings correctly for Vite. If not, ensure they are set as follows:
    *   **Build Command**: `npm run build` (or `vite build`)
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install`

### **Step 3: Add Environment Variables**

Go to the project **Settings** > **Environment Variables** and add the following:

*   **`VITE_API_URL`**: Paste the URL of your **Render backend service** that you copied earlier (e.g., `https://your-service-name.onrender.com`).

### **Step 4: Deploy**

Click **Deploy**. Vercel will build your React application and deploy it. Once it's live, you will get a production URL (e.g., `https://your-project.vercel.app`).

---

## 3. Final Configuration

The last step is to connect the frontend and backend.

1.  Copy your Vercel frontend URL.
2.  Go back to your **Render** dashboard and navigate to your backend service's **Environment** settings.
3.  Find the `CORS_ORIGIN` environment variable and paste your Vercel URL into the value field.
4.  Save the changes. Render will automatically trigger a new deployment for your backend with the updated environment variable.

Your application is now fully deployed and live!
