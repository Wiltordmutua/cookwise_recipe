"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex, useQuery } from "convex/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";

const PASSWORD_REQUIREMENTS_TEXT =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";

function validatePassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function SignInForm() {
  const { signIn, signOut } = useAuthActions();
  const convex = useConvex();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          const rawEmail = String(formData.get("email") ?? "");
          const normalizedEmail = rawEmail.trim().toLowerCase();
          const rawPassword = String(formData.get("password") ?? "");
          formData.set("email", normalizedEmail);
          formData.set("flow", flow);
          void (async () => {
            if (flow === "signUp" && !validatePassword(rawPassword)) {
              throw new Error("Password constraints not met");
            }
            // If currently in guest mode, clear that session before password auth.
            if (loggedInUser && !loggedInUser.email) {
              await signOut();
            }
            if (flow === "signUp") {
              const exists = await convex.query(api.auth.isEmailRegistered, {
                email: normalizedEmail,
              });
              if (exists) {
                throw new Error("Email already registered");
              }
            }
            await signIn("password", formData);
          })()
            .then(() => {
              setSubmitting(false);
              navigate("/", { replace: true });
            })
            .catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Password constraints not met")) {
                toastTitle = PASSWORD_REQUIREMENTS_TEXT;
              } else if (error.message.includes("Email already registered")) {
                toastTitle = "This email is already registered. Please sign in instead.";
              } else if (error.message.includes("Invalid password")) {
                toastTitle =
                  flow === "signUp"
                    ? PASSWORD_REQUIREMENTS_TEXT
                    : "Invalid password. Please try again.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">or</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      <button
        className="auth-button"
        onClick={() =>
          void signIn("anonymous")
            .then(() => {
              navigate("/", { replace: true });
            })
            .catch(() => {
              toast.error("Could not sign in anonymously. Please try again.");
            })
        }
      >
        Continue as guest
      </button>
    </div>
  );
}
