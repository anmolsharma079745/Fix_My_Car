import React from "react";
import './Register.css'
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import RegisterSection from "../../components/Register/RegistrationSection.jsx"

const Register = ({theme, toggleTheme}) => {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <RegisterSection theme={theme} />
      <Footer/>
    </>
  );
};

export default Register;