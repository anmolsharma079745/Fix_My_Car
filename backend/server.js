require("dotenv").config();

const app = require("./backendManagement/app");
const connectDB = require("./backendManagement/config/dbConnect");

const port = process.env.PORT;
connectDB();

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});