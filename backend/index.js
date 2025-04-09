import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';
import oauth2Routes from './src/routes/oauth2Routes.js';
import authRoutes from './src/routes/authRoutes.js';
import requestRoutes from "./src/routes/requestRoutes.js";
import favoriseRoutes from './src/routes/saveRoutes.js';
import evaluateRoutes from "./src/routes/evaluateRoutes.js";
import banRoutes from "./src/routes/banRoutes.js";
import passport from 'passport';
import cors from 'cors';
import {app, server} from "./src/config/socket.js";
import path from "path";
import {fileURLToPath} from "url";
import messageRoutes from "./src/routes/messageRoutes.js";
import {authenticateToken} from './src/middlewares/authMiddleware.js';


dotenv.config();
connectDB();

app.use(
  cors({
    origin: "*", // Allows all origins
    credentials: true, // If using cookies or authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })

// Debugging: Log incoming requests and CORS
app.use((req, res, next) => {
  console.log(`Incoming request from: ${req.headers.origin}`);
  next();
});

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            'http://localhost',        // frontend on host (for local dev)
            'http://localhost:80',     // frontend on host via Docker
            'http://localhost:5173',   // in case you're using React dev server locally
            'http://frontend',         // frontend service name inside Docker
        ],
        credentials: true,
    })
);





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(authenticateToken);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', oauth2Routes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/saved', favoriseRoutes);
app.use('/api/rate', evaluateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/banned-users', banRoutes);


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
