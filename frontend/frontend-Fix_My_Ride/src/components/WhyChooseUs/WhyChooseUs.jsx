import React from "react";
import './WhyChooseUs.css';

const WhyChooseUs = () => {

    const reasons = [

        {
            id:1,
            icon:"ri-tools-line",
            title:"Trusted Mechanics",
            description:
            "Get professional and verified mechanics who provide reliable vehicle repair services."
        },


        {
            id:2,
            icon:"ri-home-4-line",
            title:"Doorstep Service",
            description:
            "Book vehicle service from anywhere and get quality repair support at your location."
        },


        {
            id:3,
            icon:"ri-map-pin-line",
            title:"Track Your Service",
            description:
            "Monitor your vehicle repair progress with real-time service status updates."
        },


        {
            id:4,
            icon:"ri-lock-line",
            title:"Secure Platform",
            description:
            "Your account and bookings are protected with secure authentication and role-based access."
        },


        {
            id:5,
            icon:"ri-money-rupee-circle-line",
            title:"Transparent Pricing",
            description:
            "Know your service details and charges clearly without hidden costs."
        },


        {
            id:6,
            icon:"ri-file-list-3-line",
            title:"Service History",
            description:
            "Maintain complete records of your vehicle services and previous repairs."
        }

    ];



    return (

        <section className="why-section" id="why-choose-us">


            <div className="why-header">


                <h2>

                    Why Choose 
                    <span> Fix My Ride</span>

                </h2>


                <p>

                    We provide reliable, fast and professional vehicle
                    services with technology-driven solutions.

                </p>


            </div>




            <div className="why-container">


                {
                    reasons.map((item)=>(


                        <div 
                            className="why-card"
                            key={item.id}
                        >


                            <div className="why-icon">

                                <i className={item.icon}></i>

                            </div>



                            <h3>

                                {item.title}

                            </h3>



                            <p>

                                {item.description}

                            </p>



                        </div>


                    ))
                }


            </div>



        </section>

    );

}
export default WhyChooseUs;