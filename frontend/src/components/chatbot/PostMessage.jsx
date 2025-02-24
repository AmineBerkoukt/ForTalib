import React from 'react';
import { useModalStore } from '../../store/useModalStore';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react'; // Added missing imports

const PostMessage = ({ post }) => {
    const { activateModal } = useModalStore();
    const { isDarkMode } = useTheme();

    // Add missing handleViewDetails function
    const handleViewDetails = () => {
        activateModal(post);
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-xl shadow-sm ${
                isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50'
            } transition-all cursor-pointer border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
            onClick={handleViewDetails} // Use the defined function
        >
            <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                        src={`http://localhost:5000${post.images?.[0]}` || '/placeholder-house.jpg'}
                        className="w-full h-full object-cover"
                        alt="Property thumbnail"
                    />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {post.price} Dhs/month
                        </span>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gray-500" />
                            {post.maximumCapacity} people
                        </div>
                        <div className="flex items-center gap-1.5">
                            {post.elevator ? (
                                <>
                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                    <span>With elevator</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDown className="w-4 h-4 text-gray-500" />
                                    <span>Without elevator</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            className={`flex items-center gap-1.5 text-sm ${
                                isDarkMode
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-blue-600 hover:text-blue-700'
                            }`}
                        >
                            <span>View details</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostMessage;