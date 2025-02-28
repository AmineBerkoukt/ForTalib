import React from 'react';
import PostSkeleton from './PostSkeleton';

const SkeletonFeed = ({ count = 3 }) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            {Array(count).fill(0).map((_, index) => (
                <PostSkeleton key={index} />
            ))}
        </div>
    );
};

export default SkeletonFeed;