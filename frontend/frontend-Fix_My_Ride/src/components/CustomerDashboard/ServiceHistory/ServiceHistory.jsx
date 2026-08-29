import React, { useEffect, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import "./ServiceHistory.css";

const ServiceHistory = ({ theme }) => {

  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH SERVICE HISTORY
  // =====================================================

  useEffect(() => {
    fetchServiceHistory();
  }, []);


  const fetchServiceHistory = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Customer login token not found.");
        return;
      }


      const response = await axios.get(
        "http://localhost:5000/api/booking/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log(
        "Customer Bookings:",
        response.data
      );


      const bookings = response.data.bookings || [];


      // =====================================================
      // ONLY COMPLETED BOOKINGS
      // =====================================================

      const completedBookings = bookings.filter(
        (booking) =>
          booking.status?.toLowerCase() === "completed"
      );


      setServiceHistory(completedBookings);


    } catch (error) {

      console.error(
        "Service History Error:",
        error.response?.data || error.message
      );


      setError(
        error.response?.data?.message ||
        "Unable to fetch service history."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (booking) => {

    const price = booking.serviceId?.price;

    if (price === undefined || price === null) {
      return "N/A";
    }

    return `${price}`;

  };


  // =====================================================
  // GET VEHICLE IMAGE
  // =====================================================

  const getVehicleImage = (booking) => {

    return (
      booking.vehicleId?.image ||
      booking.vehicleId?.vehicleImage ||
      booking.vehicleId?.imageUrl ||
      booking.vehicleId?.photo ||
      null
    );

  };


  // =====================================================
  // GET VEHICLE TYPE ICON
  // =====================================================

  const getVehicleIcon = (booking) => {

    return booking.vehicleId?.vehicleType === "Bike"
      ? "ri-motorbike-line"
      : "ri-car-line";

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className={`service-history ${theme}`}>

        <div className="history-header">

          <div>

            <p className="history-label">
              PREVIOUS SERVICES
            </p>

            <h2>
              Service History
            </h2>

            <p className="history-description">
              View your previous vehicle service records.
            </p>

          </div>

        </div>


        <div className="history-card">

          <div className="history-message">

            <i className="ri-loader-4-line"></i>

            <span>
              Loading service history...
            </span>

          </div>

        </div>

      </section>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <section className={`service-history ${theme}`}>

        <div className="history-header">

          <div>

            <p className="history-label">
              PREVIOUS SERVICES
            </p>

            <h2>
              Service History
            </h2>

            <p className="history-description">
              View your previous vehicle service records.
            </p>

          </div>

        </div>


        <div className="history-card">

          <div className="history-message error-message">

            <i className="ri-error-warning-line"></i>

            <span>
              {error}
            </span>

          </div>

        </div>

      </section>

    );

  }


  // =====================================================
  // NO SERVICE HISTORY
  // =====================================================

  if (serviceHistory.length === 0) {

    return (

      <section
        id="service-history"
        className={`service-history ${theme}`}
      >

        <div className="history-header">

          <div>

            <p className="history-label">
              PREVIOUS SERVICES
            </p>

            <h2>
              Service History
            </h2>

            <p className="history-description">
              View your previous vehicle service records.
            </p>

          </div>

        </div>


        <div className="history-card">

          <div className="history-message">

            <i className="ri-history-line"></i>

            <span>
              No service history found.
            </span>

          </div>

        </div>

      </section>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <section
      id="service-history"
      className={`service-history ${theme}`}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="history-header">

        <div>

          <p className="history-label">
            PREVIOUS SERVICES
          </p>

          <h2>
            Service History
          </h2>

          <p className="history-description">
            View your previous vehicle service records.
          </p>

        </div>


        <button
          className="view-all-btn"
          type="button"
        >

          <i className="ri-list-check-2"></i>

          View All

        </button>

      </div>


      {/* =================================================
          HISTORY CARD
      ================================================= */}

      <div className="history-card">


        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <div className="history-table-header">

          <span>
            VEHICLE
          </span>

          <span>
            SERVICE
          </span>

          <span>
            DATE
          </span>

          <span>
            MECHANIC
          </span>

          <span>
            AMOUNT
          </span>

          <span>
            STATUS
          </span>

        </div>


        {/* =================================================
            HISTORY LIST
        ================================================= */}

        <div className="history-list">

          {serviceHistory.map((booking) => {

            const vehicleImage = getVehicleImage(booking);
            const vehicleIcon = getVehicleIcon(booking);


            return (

              <div
                className="history-row"
                key={booking._id}
              >


                {/* =================================================
                    VEHICLE
                ================================================= */}

                <div className="history-vehicle">

                  <div className="history-vehicle-icon">


                    {/* =================================================
                        VEHICLE IMAGE
                    ================================================= */}

                    {vehicleImage && (

                      <img
                        src={vehicleImage}
                        alt={
                          booking.vehicleId?.vehicleName ||
                          "Vehicle"
                        }

                        onError={(event) => {

                          event.currentTarget.style.display =
                            "none";

                          const fallbackIcon =
                            event.currentTarget.parentElement
                              ?.querySelector(
                                ".vehicle-fallback-icon"
                              );

                          if (fallbackIcon) {
                            fallbackIcon.style.display = "flex";
                          }

                        }}

                      />

                    )}


                    {/* =================================================
                        VEHICLE FALLBACK ICON
                    ================================================= */}

                    <i
                      className={`${vehicleIcon} vehicle-fallback-icon`}

                      style={{
                        display: vehicleImage
                          ? "none"
                          : "flex"
                      }}

                    ></i>


                  </div>


                  <div>

                    <h3>
                      {
                        booking.vehicleId?.vehicleName ||
                        "Vehicle"
                      }
                    </h3>

                    <p>
                      {
                        booking.vehicleId?.numberPlate ||
                        "N/A"
                      }
                    </p>

                  </div>

                </div>


                {/* =================================================
                    SERVICE
                ================================================= */}

                <div className="history-service">

                  <span className="mobile-label">
                    SERVICE
                  </span>

                  <strong>

                    {
                      booking.serviceId?.serviceName ||
                      booking.serviceId?.name ||
                      "Service"
                    }

                  </strong>


                  <small>

                    <i className="ri-hashtag"></i>

                    {
                      booking._id
                        ? booking._id.slice(-8).toUpperCase()
                        : "N/A"
                    }

                  </small>

                </div>


                {/* =================================================
                    DATE
                ================================================= */}

                <div className="history-date">

                  <span className="mobile-label">
                    DATE
                  </span>

                  <strong>

                    <i className="ri-calendar-line"></i>

                    {formatDate(booking.bookingDate)}

                  </strong>

                </div>


                {/* =================================================
                    MECHANIC
                ================================================= */}

                <div className="history-mechanic">

                  <span className="mobile-label">
                    MECHANIC
                  </span>

                  <strong>

                    <i className="ri-user-settings-line"></i>

                    {
                      booking.mechanicId?.name ||
                      "Not Assigned"
                    }

                  </strong>

                </div>


                {/* =================================================
                    AMOUNT
                ================================================= */}

                <div className="history-amount">

                  <span className="mobile-label">
                    AMOUNT
                  </span>

                  <strong>

                    <i className="ri-money-rupee-circle-line"></i>

                    {formatAmount(booking)}

                  </strong>

                </div>


                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="history-status">

                  <span className="mobile-label">
                    STATUS
                  </span>

                  <span className="completed-badge">

                    <span className="completed-dot"></span>

                    Completed

                  </span>

                </div>


              </div>

            );

          })}

        </div>

      </div>

    </section>

  );

};


export default ServiceHistory;

