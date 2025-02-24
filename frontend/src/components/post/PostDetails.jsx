const PostDetails = ({ price, address, elevator, maximumCapacity, rating, renderStars }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="dark:text-gray-200">
                <strong>Price:</strong> {price}
            </div>
            <div className="dark:text-gray-200">
                <strong>Address:</strong> {address}
            </div>
            <div className="dark:text-gray-200">
                <strong>Elevator:</strong> {elevator ? "Yes" : "No"}
            </div>
            <div className="dark:text-gray-200">
                <strong>Max Capacity:</strong> {maximumCapacity}
            </div>
            <div className="dark:text-gray-200 flex items-center">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                    {renderStars(rating)}
                    <small className="ml-1 text-gray-600 dark:text-gray-400">
                        ({rating.toFixed(1)})
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;