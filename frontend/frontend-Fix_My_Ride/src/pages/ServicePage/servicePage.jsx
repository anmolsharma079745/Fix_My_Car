import React from "react";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import ServicesHero from "../../components/Services/servicesHero/servicesHero.jsx";
import AllServices from "../../components/Services/allServices/allServices.jsx";
import ServiceCTA from "../../components/Services/servicesCTA/servicesCTA.jsx";

import "./servicePage.css";


const ServicesPage = ({ theme, toggleTheme }) => {

    return (

        <div className="services-page">

            <Header
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main>

                <ServicesHero theme={theme}/>

                <AllServices theme={theme}/>

                <ServiceCTA theme={theme}/>

            </main>

            <Footer theme={theme} />

        </div>

    );

};


export default ServicesPage;