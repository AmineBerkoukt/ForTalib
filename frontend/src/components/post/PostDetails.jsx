import React from "react";
import { MapPin, DollarSign, Users, ArrowUpDown, Star } from "lucide-react";

const PostDetails = ({ price, address, elevator, maximumCapacity, rating }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span><strong>Price:</strong> {price} DH</span>
            </div>

            <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span><strong>Address:</strong> {address}</span>
            </div>

            <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <span><strong>Elevator:</strong> {elevator ? "Yes" : "No"}</span>
            </div>

            <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span><strong>Max Capacity:</strong> {maximumCapacity} people</span>
            </div>

            <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span><strong>Rating:</strong> {rating.toFixed(1)}</span>
            </div>
        </div>
    );
};

export default PostDetails;
