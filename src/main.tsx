import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
// @ts-ignore - AppMUI is a .jsx file
import AppMUI from "./AppMUI";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  // Show a helpful error message if Convex URL is missing
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        font-family: system-ui, -apple-system, sans-serif;
        background: #F7F3E8;
        color: #1A1A1A;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #633024;">Configuration Error</h1>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; text-align: center; max-width: 600px;">
          The Convex URL is missing. Please make sure you have run <code style="background: #fff; padding: 0.2rem 0.5rem; border-radius: 4px;">convex dev</code> to generate the environment variables.
        </p>
        <div style="background: #fff; padding: 1.5rem; border-radius: 8px; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <p style="margin-bottom: 1rem; font-weight: 600;">To fix this:</p>
          <ol style="text-align: left; line-height: 1.8;">
            <li>Make sure Convex CLI is installed: <code style="background: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 4px;">npm install -g convex</code></li>
            <li>Run <code style="background: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 4px;">npx convex dev</code> in your terminal</li>
            <li>This will generate a <code style="background: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 4px;">.env.local</code> file with the required URL</li>
            <li>Refresh this page after the file is created</li>
          </ol>
        </div>
      </div>
    `;
  }
} else {
  const convex = new ConvexReactClient(convexUrl);

  createRoot(document.getElementById("root")!).render(
    <ConvexAuthProvider client={convex}>
      <AppMUI />
    </ConvexAuthProvider>,
  );
}
