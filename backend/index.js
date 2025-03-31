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


//Socket


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);



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

