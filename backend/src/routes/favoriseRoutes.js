import express from 'express';
import { addFavorise, removeFavorise, getAllFavorises } from '../controllers/favoriseController.js';

const router = express.Router();

router.post('/:postId', addFavorise);
router.delete('/:postId', removeFavorise);
router.get('/', getAllFavorises);

export default router;
