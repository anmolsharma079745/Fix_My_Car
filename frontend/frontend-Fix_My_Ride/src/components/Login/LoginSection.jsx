import React, { useState } from "react";
import "./LoginSection.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE_URL from "../../services/Api/api";
function LoginSection() {


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  const [forgotData, setForgotData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });


  const navigate = useNavigate();



  const [showPassword, setShowPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPassword, setForgotPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };



  const handleForgotChange = (e) => {

    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value,
    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData
      );

      const token = response.data.token;

      const user = response.data.user;

      console.log("Login Successful");
      console.log("User:", user);
      console.log("Role:", user.role);



      localStorage.setItem("token", token);



      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );



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
        `${API_BASE_URL}/api/auth/forgot-password/send-otp`,
        {
          email: forgotData.email
        }
      );


      console.log(
        "OTP RESPONSE:",
        response.data
      );


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



  const handleForgotPassword = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");



    if (
      forgotData.newPassword !==
      forgotData.confirmPassword
    ) {

      setError(
        "Your password is not valid. Passwords do not match."
      );

      return;

    }



    if (forgotData.newPassword.length < 6) {

      setError(
        "Password must be at least 6 characters long."
      );

      return;

    }



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
        `${API_BASE_URL}/api/auth/forgot-password/reset-password`,
        forgotData
      );


      console.log(
        "PASSWORD RESET:",
        response.data
      );


      setSuccess(
        "Password changed successfully. Please login with your new password."
      );



      setForgotData({
        email: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });


      setOtpSent(false);



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



        {forgotPassword ? (

          <>

            <h1>Reset Password</h1>



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



                {error && (

                  <p className="login-error">
                    {error}
                  </p>

                )}



                {success && (

                  <p className="login-success">
                    {success}
                  </p>

                )}



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


              <form onSubmit={handleForgotPassword}>



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



                {error && (

                  <p className="login-error">
                    {error}
                  </p>

                )}



                {success && (

                  <p className="login-success">
                    {success}
                  </p>

                )}



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


          <>

            <h1>Login</h1>


            <form onSubmit={handleSubmit}>



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



              {error && (

                <p className="login-error">
                  {error}
                </p>

              )}



              <button
                type="submit"
                className="login-btn"
              >
                Login
              </button>



              <div className="forgot-password">

                <span
                  onClick={openForgotPassword}
                >
                  Forgot Password?
                </span>

              </div>



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