import Evaluate from '../models/Evaluate.js';
import Post from "../models/Post.js";

export const updateAvgRate = async (postId) => {
    // Fetch evaluations for the specified post
    const evaluations = await Evaluate.find({ postId });
    console.log('Find evaluations:', evaluations);

    // Calculate the average rate
    const avgRate = evaluations.length
        ? evaluations.reduce((sum, evaluation) => sum + evaluation.rate, 0) / evaluations.length
        : 0;

    console.log('Calculated avgRate:', avgRate);

    // Update the `avgRate` field of the post
    await Post.findByIdAndUpdate(postId, { avgRate });

    console.log('Updated avgRate in database:', avgRate);

    // Return the new average rate
    return avgRate;
};


// fcts for routes
export const addOrUpdateEvaluation = async (req, res) => {
    try {
        const { postId } = req.params;
        const { rate } = req.body;
        const userId = req.user.id;

        // Validate the rate value
        if (rate < 1 || rate > 5) {
            return res.status(400).json({ message: 'Rate should be between 1 and 5' });
        }

        let newAvgRate;

        // Check if the evaluation already exists
        const existingEvaluation = await Evaluate.findOne({ userId, postId });

        if (existingEvaluation) {
            console.log('Before update:', existingEvaluation.rate);
            existingEvaluation.rate = rate;
            await existingEvaluation.save();
            console.log('After update:', existingEvaluation.rate);

            // Recalculate avgRate
            newAvgRate = await updateAvgRate(postId);

            return res.status(200).json({
                message: 'Evaluation updated',
                evaluation: existingEvaluation,
                avgRate: newAvgRate,
            });
        }

        // Add a new evaluation
        const newEvaluation = new Evaluate({ userId, postId, rate });
        await newEvaluation.save();

        // Recalculate avgRate
        newAvgRate = await updateAvgRate(postId);
        console.log('New avgRate:', newAvgRate);

        return res.status(201).json({
            message: 'Evaluation added',
            evaluation: newEvaluation,
            avgRate: newAvgRate,
        });
    } catch (error) {
        console.error('Error in addOrUpdateEvaluation:', error);
        res.status(500).json({ message: 'Error processing evaluation', error: error.message });
    }
};



export const deleteEvaluation = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const deletedEvaluation = await Evaluate.findOneAndDelete({ userId, postId });

        if (!deletedEvaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        //recalculer le avgRate
        await updateAvgRate(postId);

        res.status(200).json({ message: 'Evaluation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting evaluation', error: error.message });
    }
};


export const getEvaluationsForPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const evaluations = await Evaluate.find({ postId }).populate('userId');
        res.status(200).json({ evaluations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching evaluations', error: error.message });
    }
};
