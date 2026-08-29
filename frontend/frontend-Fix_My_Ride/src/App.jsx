import React, { useState } from "react";
import AppRoutes from "./routes/AppRoutes/AppRoutes.jsx";

const App = () => {

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );


    const toggleTheme = () => {

        const newTheme =
            theme === "light" ? "dark" : "light";

        setTheme(newTheme);

        localStorage.setItem("theme", newTheme);

    };


    return (
        <div className={theme}>

            <AppRoutes
                theme={theme}
                toggleTheme={toggleTheme}
            />

        </div>
    );
};


export default App;