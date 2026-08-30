import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import "./CustomerDashboard.css";

import Header from "../../components/Header/Header.jsx";
import DashBoardHeader from "../../components/CustomerDashboard/DashBoardHeader/DashBoardHeader.jsx";
import DashboardStats from "../../components/CustomerDashboard/DashboardStats/DashboardStats.jsx";
import MyVehicles from "../../components/CustomerDashboard/MyVehicles/MyVehicles.jsx";
import BookService from "../../components/CustomerDashboard/BookService/BookService.jsx";
import UpcomingServices from "../../components/CustomerDashboard/UpcomingServices/UpcomingServices.jsx";
import QuickActions from "../../components/CustomerDashboard/QuickActions/QuickActions.jsx";
import CurrentBooking from "../../components/CustomerDashboard/CurrentBooking/CurrentBooking.jsx";
import ServiceHistory from "../../components/CustomerDashboard/ServiceHistory/ServiceHistory.jsx";
import Footer from "../../components/Footer/Footer.jsx";


const CustomerDashboard = ({ theme, toggleTheme }) => {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const section = searchParams.get("section");
        const serviceId = searchParams.get("serviceId");
        if (section === "book-service") {
            setTimeout(() => {
                const bookServiceSection =
                    document.getElementById(
                        "book-service"
                    );
                if (bookServiceSection) {
                    bookServiceSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }, 300);
        }
    }, [searchParams]);
    return (
        <>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <DashBoardHeader theme={theme} />
            <DashboardStats theme={theme} />
            <MyVehicles theme={theme} />
            <section id="book-service">
                <BookService
                    theme={theme}
                    selectedServiceId={
                        searchParams.get("serviceId")
                    }
                />
            </section>
            <CurrentBooking theme={theme} />
            <UpcomingServices theme={theme} />
            <QuickActions theme={theme} />
            <ServiceHistory theme={theme}/>
            <Footer theme={theme} />
        </>

    );

};
export default CustomerDashboard;