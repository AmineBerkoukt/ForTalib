import express from 'express';
import { getStats ,generateStats , getStatsHistory , deleteStats} from '../controllers/statsController.js';
import {restrictTo} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Define routes for users
router.get('/', restrictTo('admin') , getStats);
router.get('/generate', restrictTo('admin') ,generateStats);
router.get('/history', restrictTo('admin') ,getStatsHistory);
router.delete(['/flush', '/clean'], restrictTo('admin') ,deleteStats);


export default router;