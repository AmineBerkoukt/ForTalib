import express from 'express';
import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getTopRatedPosts,
    getAllPostsFiltred,
    getPostsByUser, getPostById
} from '../controllers/postController.js';
//import { protectRoute } from '../middlewares/authMiddleware.js';
import {uploadPostImages} from '../config/upload.js';
import {restrictTo} from "../middlewares/authMiddleware.js";


const router = express.Router();


router.post('/create',  uploadPostImages.array('images', 6), createPost); // 6 images Max

router.get('/', getAllPosts);

router.get('/filter', getAllPostsFiltred);

router.get('/postsFor', getPostsByUser);


router.get('/topRated', getTopRatedPosts);

router.get('/post/:id', getPostById);

//router.put('/:id', protect, updatePost);
router.patch('/post/:id', updatePost);

//router.delete('/:id', protect, deletePost);
router.delete('/post', deletePost);




export default router;
