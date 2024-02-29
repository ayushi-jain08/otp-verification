import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import OtpRoutes from "./Routes/OtpRoutes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", OtpRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`server is running on Port ${process.env.PORT}`);
});
