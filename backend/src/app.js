import express from "express";
import { createServer } from "http";  // Use 'http' instead of 'node:http' to prevent potential issues
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);

// Connect to Socket.io
const io = connectToSocket(server);

// Set up Express settings
app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Define user routes
app.use("/api/v1/users", userRoutes);

// MongoDB connection and server start
const start = async () => {
    try {
        // MongoDB URI directly added in the code with your password
        const dbURI = "mongodb+srv://ersurjeet:surjeetkumar@zoom.kxiqqdp.mongodb.net/Zoom?retryWrites=true&w=majority";

        // Connect to MongoDB
        const connectionDb = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
        
        // Start the server
        server.listen(app.get("port"), () => {
            console.log(`Listening on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);  // Exit the process if DB connection fails
    }
};

start();
