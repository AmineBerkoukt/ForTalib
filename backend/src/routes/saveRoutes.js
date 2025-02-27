import express from 'express';
import {

    savePost,
    unsavePost,
    getAllSaved,
    getAllSavedIds,
} from '../controllers/favoriseController.js';

const router = express.Router();

router.post('/:postId', savePost);
router.delete('/:postId', unsavePost);
router.get('/', getAllSaved);
router.get('/Ids', getAllSavedIds);

export default router;
