import React, { useState } from "react";
import "./RegistrationSection.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../services/Api/api";
function RegisterSection({ theme }) {

  console.log("Registration theme:", theme);

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    specialization: "",
    experience: ""
  });

  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

  };



  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    let response;


    if (formData.role === "mechanic") {

      const mechanicData = {

        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: formData.experience

      };

      response = await axios.post(
        `${API_BASE_URL}/api/mechanic/add`,
        mechanicData
      );

    }


    else {

      const userData = {

        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role

      };

      response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        userData
      );

    }


    console.log(
      "Registration Response:",
      response.data
    );



    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");



    navigate("/login");

  }

  catch (error) {

    console.log(
      "STATUS:",
      error.response?.status
    );

    console.log(
      "BACKEND DATA:",
      error.response?.data
    );

    console.log(
      "ERROR:",
      error.message
    );

  }

};



  return (

    <section
      className={`registration-section ${theme}`}
    >

      <div className="registration-container">



        <div className="registration-content">

          <span className="registration-tag">
            FIX MY RIDE
          </span>


          <h1>
            Create Your
            <span> Account</span>
          </h1>


          <p>
            Join Fix My Ride and make vehicle servicing
            simple, fast and convenient.
          </p>



          <div className="registration-benefits">



            <div className="benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <h3>
                  Easy Service Booking
                </h3>

                <p>
                  Book your vehicle service quickly and easily.
                </p>

              </div>

            </div>



            <div className="benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <h3>
                  Track Your Vehicle
                </h3>

                <p>
                  Track your service status in real time.
                </p>

              </div>

            </div>



            <div className="benefit">

              <span className="benefit-icon">
                ✓
              </span>

              <div>

                <h3>
                  Service History
                </h3>

                <p>
                  Keep your complete vehicle service history.
                </p>

              </div>

            </div>

          </div>

        </div>



        <div className="registration-card">



          <div className="registration-card-header">

            <h2>
              Create Account
            </h2>

            <p>
              Fill in your details to get started
            </p>

          </div>



          <form onSubmit={handleSubmit}>



            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />

            </div>



            <div className="form-group">

              <label htmlFor="email">
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

            </div>



            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />

            </div>



            <div className="form-group">

              <label htmlFor="password">
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

                  {
                    showPassword
                      ? <FaEyeSlash />
                      : <FaEye />
                  }

                </span>

              </div>

            </div>



            <div className="form-group">

              <label htmlFor="role">
                Register As
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >

                <option value="admin">
                  Admin
                </option>

                <option value="customer">
                  Customer
                </option>

                <option value="mechanic">
                  Mechanic
                </option>

              </select>

            </div>



            {formData.role === "mechanic" && (

              <>



                <div className="form-group">

                  <label htmlFor="specialization">
                    Specialization
                  </label>

                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select specialization
                    </option>

                    <option value="Car">
                      Car
                    </option>

                    <option value="Bike">
                      Bike
                    </option>

                    <option value="Both">
                      Both
                    </option>

                  </select>

                </div>



                <div className="form-group">

                  <label htmlFor="experience">
                    Experience
                  </label>

                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    placeholder="e.g. 3 Years"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />

                </div>

              </>

            )}



            <div className="terms-container">

              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the Terms & Conditions
              </label>

            </div>



            <button
              type="submit"
              className="registration-button"
            >
              Create Account
            </button>

          </form>



          <div className="login-redirect">

            <p>

              Already have an account?

              <a href="/login">
                Login
              </a>

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}


export default RegisterSection;