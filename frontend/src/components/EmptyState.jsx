import React from 'react';
import { Users } from 'lucide-react';

const EmptyState = ({ searchQuery }) => {
    return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8 px-4">
            <Users className="size-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No contacts found</p>
            <p className="text-sm mt-1">
                {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Add some contacts to start chatting"}
            </p>
        </div>
    );
};

export default EmptyState;
