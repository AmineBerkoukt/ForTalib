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
import passport from 'passport';
import http from 'http';
//Multer config :
import {uploadPostImages, uploadPfp} from './src/config/upload.js';
import {authenticateToken} from './src/middlewares/authMiddleware.js';


//Socket
import cors from 'cors';
import {app, server} from "./src/config/socket.js";
import path from "path";
import {fileURLToPath} from "url";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

server.listen(5000, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




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

//Auth routes :

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


let fileName = "";


// Route to test file upload
app.post('/api/uploadPost', uploadPostImages.single("media"), (req, res) => {
    console.log("req.file", req.file)
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded. Please provide a valid file.' });
    }

    //file.path is to store in the db !

    fileName = req.file.filename;
    const fileInfo = {
        fileName: req.file.filename,
        path: req.file.path,
    };

    res.status(200).json({
        message: "File uploaded successfully!",
        file: fileInfo,
    });
});


/*
app.post('/uploadPfp', uploadPfp.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.status(200).json({
        message: `File uploaded !`,
        path: req.file.path,
    });
});
*/


app.get('/api/getImage', (req, res) => {
    try {
        if (!fileName) {
            return res.status(404).json({ message: 'No image found. Please upload an image first.' });
        }

        const networkProtocol = req.protocol;

        const hostName = req.get('host');

        console.log("User id : ", req.user.id)
        // Convert the file path to a URL-friendly format
        const fileUrl = `${networkProtocol}://${hostName}/uploads/${req.user.id}/posts/${fileName}`;

        res.status(200).json({ imageUrl: fileUrl });
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



