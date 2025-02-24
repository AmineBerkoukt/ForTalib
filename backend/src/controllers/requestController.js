import Request from '../models/Request.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import { generateEmailContent } from '../utils/emailContent.js';

export const createRequest = async (req, res) => {
    try {
        const userId = req.user.id; //from token
        const existingRequest = await Request.findOne({ userId, status: 'pending' }); //because the user can't send another request while he has one pending

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request.' });
        }

        const newRequest = new Request({ userId });
        await newRequest.save();

        res.status(201).json({ message: 'Request created successfully.', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error while creating the request.', error: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }
        // 3i zayda ms tqdar tnfa3 f postman !
        if (request.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to delete this request.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'You can only delete pending requests.' });
        }

        await request.deleteOne();
        res.status(200).json({ message: 'Request deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting the request.', error: error.message });
    }
};
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('userId', 'firstName lastName email phoneNumber')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error while retrieving requests.', error: error.message });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected.' });
        }

        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'This request has already been processed.' });
        }

        request.status = status;
        request.treatedAt = new Date();
        await request.save();

        let user = null;
        if (status === 'accepted') {
             user = await User.findById(request.userId);
            user.role = 'house_owner';
            await user.save();
        } else {
            user = await User.findById(request.userId);
        }

        const { subject, htmlContent } = generateEmailContent(user.firstName, user.lastName, status, request);
        await sendEmail(user.email, subject, htmlContent);

        res.status(200).json({ message: `Request ${status} successfully.`, request });
    } catch (error) {
        res.status(500).json({ message: 'Error while updating the request status.', error: error.message });
    }
};
