import React,{axios, useState} from "react";
import './Login.css'
import Header from "../../components/Header/Header";
import LoginSection from '../../components/Login/LoginSection.jsx'
import Footer from "../../components/Footer/Footer";

const Login = ({ theme, toggleTheme }) => {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <LoginSection/>
      <Footer/>
    </>
  );
};

export default Login;