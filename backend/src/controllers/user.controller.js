import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

// Login Controller
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide both username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            const token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or Password" });
        }
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

// Register Controller
const register = async (req, res) => {
    const { name, username, password } = req.body;

    console.log("📥 Register Request Body:", req.body); // ✅ LOG

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("⚠️ User already exists:", existingUser); // ✅ LOG
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Hashed Password:", hashedPassword); // ✅ LOG

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("✅ New User Saved:", savedUser); // ✅ LOG

        res.status(httpStatus.CREATED).json({ message: "User Registered" });
    } catch (e) {
        console.error("❌ Error in register:", e); // ✅ LOG
        res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

// Get User Meeting History
const getUserHistory = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const meetings = await Meeting.find({ user_id: user.username });
        res.status(httpStatus.OK).json(meetings);
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

// Add Meeting to User's History
const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    if (!token || !meeting_code) {
        return res.status(400).json({ message: "Token and meeting code are required" });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        // Create new meeting entry
        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Meeting code added to history" });
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

export { login, register, getUserHistory, addToHistory };
