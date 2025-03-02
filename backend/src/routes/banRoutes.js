import express from "express";
import { getBannedUsers, banUser, unbanUser } from "../controllers/banController.js";

const router = express.Router();

router.get("/", getBannedUsers);
router.post("/:userId", banUser);
router.delete("/:userId", unbanUser);


export default router;