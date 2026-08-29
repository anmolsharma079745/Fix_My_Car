import React, { useState } from "react";
import "./LoginSection.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginSection() {

  // ================================
  // LOGIN FORM DATA
  // ================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // ================================
  // FORGOT PASSWORD DATA
  // ================================

  const [forgotData, setForgotData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });


  const navigate = useNavigate();


  // ================================
  // STATES
  // ================================

  const [showPassword, setShowPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login / Forgot Password
  const [forgotPassword, setForgotPassword] = useState(false);

  // OTP send hone ke baad true hoga
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ================================
  // LOGIN INPUT CHANGE
  // ================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // ================================
  // FORGOT PASSWORD INPUT CHANGE
  // ================================

  const handleForgotChange = (e) => {

    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value,
    });

  };


  // ================================
  // LOGIN
  // ================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const token = response.data.token;

      const user = response.data.user;

      console.log("Login Successful");
      console.log("User:", user);
      console.log("Role:", user.role);


      // ================================
      // SAVE TOKEN
      // ================================

      localStorage.setItem("token", token);


      // ================================
      // SAVE USER
      // ================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      // ================================
      // ROLE BASED DASHBOARD
      // ================================

      if (user.role === "admin") {

        navigate("/admin-dashboard");

      } else if (user.role === "mechanic") {

        navigate("/mechanic-dashboard");

      } else if (user.role === "customer") {

        navigate("/customer-dashboard");

      } else {

        console.log(
          "Invalid role:",
          user.role
        );

      }

    } catch (error) {

      console.log(
        "LOGIN STATUS:",
        error.response?.status
      );

      console.log(
        "LOGIN ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );

    }

  };


  // ================================
  // SEND OTP
  // ================================

  const handleSendOTP = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!forgotData.email) {

      setError("Please enter your email.");

      return;

    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password/send-otp",
        {
          email: forgotData.email
        }
      );


      console.log(
        "OTP RESPONSE:",
        response.data
      );


      // OTP successfully sent
      setOtpSent(true);

      setSuccess(
        "OTP sent successfully. Please check your email."
      );

    } catch (error) {

      console.log(
        "SEND OTP ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Failed to send OTP."
      );

    } finally {

      setLoading(false);

    }

  };


  // ================================
  // CHANGE PASSWORD
  // ================================

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // ================================
    // PASSWORD MATCH
    // ================================

    if (
      forgotData.newPassword !==
      forgotData.confirmPassword
    ) {

      setError(
        "Your password is not valid. Passwords do not match."
      );

      return;

    }


    // ================================
    // PASSWORD LENGTH
    // ================================

    if (forgotData.newPassword.length < 6) {

      setError(
        "Password must be at least 6 characters long."
      );

      return;

    }


    // ================================
    // OTP VALIDATION
    // ================================

    if (
      forgotData.otp.length !== 6 ||
      !/^\d{6}$/.test(forgotData.otp)
    ) {

      setError(
        "Please enter a valid 6-digit OTP."
      );

      return;

    }


    try {

      setLoading(true);


      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password/reset-password",
        forgotData
      );


      console.log(
        "PASSWORD RESET:",
        response.data
      );


      setSuccess(
        "Password changed successfully. Please login with your new password."
      );


      // ================================
      // CLEAR FORGOT PASSWORD DATA
      // ================================

      setForgotData({
        email: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });


      setOtpSent(false);


      // ================================
      // AFTER 2 SECONDS
      // GO BACK TO LOGIN
      // ================================

      setTimeout(() => {

        setForgotPassword(false);

        setSuccess("");

      }, 2000);


    } catch (error) {

      console.log(
        "RESET PASSWORD ERROR:",
        error.response?.data
      );


      setError(
        error.response?.data?.message ||
        "Unable to change password."
      );

    } finally {

      setLoading(false);

    }

  };


  // ================================
  // OPEN FORGOT PASSWORD
  // ================================

  const openForgotPassword = () => {

    setForgotPassword(true);

    setOtpSent(false);

    setError("");

    setSuccess("");

    setFormData({
    email: formData.email,
    password: "",
    });

  };


  // ================================
  // BACK TO LOGIN
  // ================================

  const backToLogin = () => {

    setForgotPassword(false);

    setOtpSent(false);

    setError("");

    setSuccess("");

    setForgotData({
      email: "",
      newPassword: "",
      confirmPassword: "",
      otp: "",
    });

  };


  return (

    <section className="login">

      <div className="login-box">


        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        {forgotPassword ? (

          <>

            <h1>Reset Password</h1>


            {/* ============================================
                STEP 1 - SEND OTP
            ============================================ */}

            {!otpSent ? (

              <form onSubmit={handleSendOTP}>

                <label>
                  Enter your email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  autoComplete="email"
                  required
                />


                {/* ERROR */}

                {error && (

                  <p className="login-error">
                    {error}
                  </p>

                )}


                {/* SUCCESS */}

                {success && (

                  <p className="login-success">
                    {success}
                  </p>

                )}


                {/* SEND OTP */}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Sending OTP..."
                    : "Send OTP"
                  }

                </button>


                {/* BACK TO LOGIN */}

                <p className="register-text">

                  Remember your password?{" "}

                  <span
                    className="forgot-link"
                    onClick={backToLogin}
                  >
                    Login
                  </span>

                </p>

              </form>

            ) : (

              /* ==========================================
                 STEP 2 - RESET PASSWORD
              ========================================== */

              <form onSubmit={handleForgotPassword}>


                {/* EMAIL */}

                <label>
                  Enter your email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  autoComplete="email"
                  required
                />


                {/* NEW PASSWORD */}

                <label>
                  New Password
                </label>

                <div className="password-box">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    placeholder="Enter new password"
                    value={forgotData.newPassword}
                    onChange={handleForgotChange}
                    autoComplete="new-password"
                    required
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                  >

                    {showNewPassword
                      ? <FaEyeSlash />
                      : <FaEye />
                    }

                  </span>

                </div>


                {/* CONFIRM PASSWORD */}

                <label>
                  Confirm Password
                </label>

                <div className="password-box">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={forgotData.confirmPassword}
                    onChange={handleForgotChange}
                    autoComplete="new-password"
                    required
                  />

                  <span
                    className="eye-icon"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {showConfirmPassword
                      ? <FaEyeSlash />
                      : <FaEye />
                    }

                  </span>

                </div>


                {/* OTP */}

                <label>
                  Enter OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={forgotData.otp}
                  onChange={handleForgotChange}
                  maxLength="6"
                  inputMode="numeric"
                  required
                />


                {/* ERROR */}

                {error && (

                  <p className="login-error">
                    {error}
                  </p>

                )}


                {/* SUCCESS */}

                {success && (

                  <p className="login-success">
                    {success}
                  </p>

                )}


                {/* CHANGE PASSWORD */}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Changing Password..."
                    : "Change Password"
                  }

                </button>


                {/* BACK TO LOGIN */}

                <p className="register-text">

                  Remember your password?{" "}

                  <span
                    className="forgot-link"
                    onClick={backToLogin}
                  >
                    Login
                  </span>

                </p>


              </form>

            )}

          </>

        ) : (

          /* =================================================
             NORMAL LOGIN
          ================================================= */

          <>

            <h1>Login</h1>


            <form onSubmit={handleSubmit}>


              {/* EMAIL */}

              <label>
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />


              {/* PASSWORD */}

              <label>
                Password
              </label>

              <div className="password-box">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </span>

              </div>


              {/* ERROR */}

              {error && (

                <p className="login-error">
                  {error}
                </p>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-btn"
              >
                Login
              </button>


              {/* FORGOT PASSWORD */}

              <div className="forgot-password">

                <span
                  onClick={openForgotPassword}
                >
                  Forgot Password?
                </span>

              </div>


              {/* REGISTER */}

              <p className="register-text">

                Don't have an account?{" "}

                <Link to="/register">
                  Register
                </Link>

              </p>


            </form>

          </>

        )}

      </div>

    </section>

  );

}

export default LoginSection;