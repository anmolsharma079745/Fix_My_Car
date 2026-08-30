import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../services/Api/api";
import "./Footer.css";


const Footer = () => {

    const navigate = useNavigate();



    const [services, setServices] = useState([]);

    const [loadingServices, setLoadingServices] =
        useState(true);



    useEffect(() => {

        const fetchServices = async () => {

            try {

                setLoadingServices(true);


                const response = await axios.get(
                    `${API_BASE_URL}/api/service/all`
                );


                setServices(
                    response.data.services || []
                );


            } catch (error) {

                console.error(
                    "Footer Services Error:",
                    error
                );


                setServices([]);

            } finally {

                setLoadingServices(false);

            }

        };


        fetchServices();

    }, []);



    const handleServiceClick = (serviceId) => {

        if (!serviceId) {
            return;
        }


        navigate(
            `/services?serviceId=${serviceId}`
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };



    const handleServicesClick = (event) => {

        event.preventDefault();

        navigate("/services");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    return (

        <footer
            className="footer"
            id="contact"
        >

            <div className="footer-container">



                <div className="footer-section">

                    <h2>

                        Fix <span>My Ride</span>

                    </h2>


                    <p>

                        Professional vehicle servicing made simple.
                        Book trusted mechanics, track repairs,
                        and keep your vehicle running like new.

                    </p>

                </div>




                <div className="footer-section">

                    <h3>
                        Quick Links
                    </h3>


                    <ul>

                        <li>

                            <a href="/">
                                Home
                            </a>

                        </li>


                        <li>

                            <a
                                href="/services"
                                onClick={
                                    handleServicesClick
                                }
                            >

                                Services

                            </a>

                        </li>


                        <li>

                            <a href="/#about">
                                About
                            </a>

                        </li>


                        <li>

                            <a href="/#contact">
                                Contact
                            </a>

                        </li>

                    </ul>

                </div>




                <div className="footer-section">

                    <h3>
                        Our Services
                    </h3>


                    <ul className="footer-services-list">



                        {loadingServices && (

                            <li className="footer-service-loading">

                                <i className="ri-loader-4-line"></i>

                                Loading services...

                            </li>

                        )}




                        {!loadingServices &&
                            services.length > 0 &&
                            services.map((service) => (

                                <li
                                    key={service._id}
                                    className="footer-service-item"
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleServiceClick(
                                                service._id
                                            )
                                        }
                                    >

                                        <i className="ri-tools-line"></i>

                                        <span>
                                            {
                                                service.serviceName
                                            }
                                        </span>

                                    </button>

                                </li>

                            ))
                        }




                        {!loadingServices &&
                            services.length === 0 && (

                                <li className="footer-service-empty">

                                    No services available.

                                </li>

                            )
                        }

                    </ul>

                </div>




                <div className="footer-section">

                    <h3>
                        Contact Us
                    </h3>


                    <p>

                        <i className="ri-map-pin-line"></i>

                        Haryana, India

                    </p>


                    <p>

                        <i className="ri-mail-line"></i>

                        support@fixmyride.com

                    </p>


                    <p>

                        <i className="ri-phone-line"></i>

                        +91 77777 77777

                    </p>

                </div>


            </div>




            <div className="footer-bottom">

                <p>

                    © 2026 Fix My Ride.
                    All Rights Reserved.

                </p>

            </div>


        </footer>

    );

};


export default Footer;