import React from "react";
import "./QuickActions.css";

const QuickActions = ({ theme }) => {

  const actions = [
    {
      id: 1,
      icon: "ri-car-line",
      title: "Add Vehicle",
      description: "Add a new car or bike",
      className: "blue",
      target: "my-vehicles",
    },
    {
      id: 2,
      icon: "ri-tools-line",
      title: "Book Service",
      description: "Schedule a vehicle service",
      className: "green",
      target: "book-service",
    },
    {
      id: 3,
      icon: "ri-file-list-3-line",
      title: "My Bookings",
      description: "View your service bookings",
      className: "purple",
      target: "current-booking",
    },
    {
      id: 4,
      icon: "ri-history-line",
      title: "Service History",
      description: "Check previous services",
      className: "orange",
      target: "service-history",
    },
  ];



  const handleAction = (target) => {

    const section = document.getElementById(target);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  };


  return (

    <section className={`quick-actions ${theme}`}>

      <div className="quick-actions-container">
      <div className="quick-actions-header">

        <div>

          <p className="quick-label">
            QUICK ACCESS
          </p>

          <h2>
            Quick Actions
          </h2>

          <p className="quick-description">
            Quickly access the services you use most.
          </p>

        </div>

      </div>



      <div className="quick-actions-grid">

        {actions.map((action) => (

          <button
            key={action.id}
            type="button"
            className={`quick-action-card ${action.className}`}
            onClick={() => handleAction(action.target)}
          >


            <div className="quick-action-icon">

              <i className={action.icon}></i>

            </div>



            <div className="quick-action-content">

              <h3>
                {action.title}
              </h3>

              <p>
                {action.description}
              </p>

            </div>



            <span className="quick-action-arrow">

              <i className="ri-arrow-right-line"></i>

            </span>

          </button>

        ))}

      </div>
    </div>

    </section>

  );

};

export default QuickActions;