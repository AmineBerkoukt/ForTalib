import express from 'express';
import {
    createRequest,
    deleteRequest,
    updateRequestStatus,
    getAllRequests
} from '../controllers/requestController.js';
import { restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

//for student
router.post('/create', restrictTo('student'), createRequest); // { status }
router.delete('/:id', restrictTo('student'), deleteRequest);

//for admin
router.get('/', restrictTo('admin'), getAllRequests);
router.patch('/:id', restrictTo('admin'), updateRequestStatus); // { status }

export default router;
