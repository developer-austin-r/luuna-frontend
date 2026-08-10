"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginThunk } from "@/redux/slices/auth-slice";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    if (activeTab === "login") {
      const result = await dispatch(
        loginThunk({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        })
      );

      if (loginThunk.fulfilled.match(result)) {
        router.push("/admin/dashboard");
      }
    } else {
      alert("Account created successfully! Please sign in.");
      reset();
      setActiveTab("login");
    }
  };

  // Google Sign-In Redirect Action
  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com";
  };

 
  const handleAppleLogin = () => {
    window.location.href = "https://appleid.apple.com";
  };

  return (
    <div className={`glass-card ${activeTab === "register" ? "register-card" : ""}`}>
      <h1 className="login-title">Hello! Welcome Back</h1>

     
      <div className="tab-container">
        <button
          type="button"
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
          onClick={() => { setActiveTab("login"); reset(); }}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
          onClick={() => { setActiveTab("register"); reset(); }}
        >
          Register
        </button>
      </div>

      <p className="subtitle">
        {activeTab === "login"
          ? "Enter your email and password to access your account"
          : "Fill in your details to create a new account"}
      </p>

      {error && activeTab === "login" && (
        <div className="error-banner">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-body">
        
        {activeTab === "register" && (
          <>
            <div className="name-row">
              <div className="form-group">
                <label>First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-input"
                    {...register("firstName", { required: true })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-input"
                    {...register("lastName", { required: true })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={14} />
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="form-input"
                  {...register("phone", { required: true })}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={14} />
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input"
              {...register("email", { required: true })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={14} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              className="form-input"
              {...register("password", { required: true })}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

       
        {activeTab === "login" && (
          <div className="options-row">
            <label className="remember-label">
              <input type="checkbox" {...register("rememberMe")} />
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot Password ?</a>
          </div>
        )}

       
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : activeTab === "login"
            ? "Sign In"
            : "Create Account"}
        </button>

        {/* DIVIDER & SOCIAL LOGIN */}
        <div className="divider">
          <span>Or Continue With</span>
        </div>

        <div className="social-login">
         
          <button 
            type="button" 
            className="social-btn" 
            onClick={handleGoogleLogin}
            aria-label="Sign in with Google"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </button>

         
          <button 
            type="button" 
            className="social-btn" 
            onClick={handleAppleLogin}
            aria-label="Sign in with Apple"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.68-.82 1.14-1.97.98-3.12-1 .04-2.2.67-2.88 1.47-.61.71-1.14 1.88-.97 3.01 1.12.08 2.23-.55 2.87-1.36z" />
            </svg>
          </button>
        </div>

       
        <div className="card-footer">
          {activeTab === "login" ? (
            <>
              Don't Have An Account ?{" "}
              <button
                type="button"
                className="toggle-link"
                onClick={() => { setActiveTab("register"); reset(); }}
              >
                Create Account !
              </button>
            </>
          ) : (
            <>
              Already Have An Account ?{" "}
              <button
                type="button"
                className="toggle-link"
                onClick={() => { setActiveTab("login"); reset(); }}
              >
                Sign In !
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}