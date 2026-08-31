require("dotenv").config();

const app = require("./backendManagement/app");
const connectDB = require("./backendManagement/config/dbConnect");

const port = process.env.PORT || 5000;
connectDB();

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});