import express from 'express';
import {addOrUpdateEvaluation, deleteEvaluation, getEvaluationsForPost} from '../controllers/evaluateController.js';

const router = express.Router();

router.post('/:postId', addOrUpdateEvaluation); //  { rate }
router.delete('/:postId', deleteEvaluation);
//just for Postman
router.get('/:postId', getEvaluationsForPost);


export default router;
