import express from 'express';
import {
    getUsers,
    createUser,
    updateProfile,
    searchUsers,
    getCurrentUser,
    getUserById,
    deleteUser, promoteToAdmin, updatePassword
} from '../controllers/userController.js';
import {restrictTo} from "../middlewares/authMiddleware.js";
import {uploadPfp} from "../config/upload.js";
import validateProfile from "../validations/profile/validateProfile.js";

const router = express.Router();

// Define routes for users
router.get('/', restrictTo("admin"), getUsers);
//Route to add admins not sure to add it in front or not
router.post('/', restrictTo("admin") , createUser);
router.get('/search', searchUsers);

router.patch('/promote/:userId', restrictTo("admin"), promoteToAdmin);
router.delete('/delete/:id', restrictTo("admin"), deleteUser);

router.patch('/update-profile', validateProfile, uploadPfp.single('profilePhoto'),  updateProfile);
router.get('/me', getCurrentUser);
router.patch('/change-password', updatePassword);

//for postman
router.get('/:id', getUserById);


export default router;
