import Post from '../models/Post.js';

export async function searchPosts(criteria) {
    const query = {};

    if (criteria.minPrice || criteria.maxPrice) {
        query.price = {};
        if (criteria.minPrice) query.price.$gte = criteria.minPrice;
        if (criteria.maxPrice) query.price.$lte = criteria.maxPrice;
        console.log("query.price" ,  query.price);
    }

    if (criteria.address) {
        query.address = { $regex: criteria.address, $options: 'i' };
        console.log("query.address" ,  query.address);
    }

    if (criteria.capacity) {
        console.log("criteria.capacity" ,  criteria.capacity);
        query.maximumCapacity = { $gte: criteria.capacity };
        console.log("query.maximumCapacity" ,  query.maximumCapacity);
    }

    if (criteria.hasElevator !== undefined) {
        console.log("criteria.hasElevator" ,  criteria.hasElevator);
        query.elevator = criteria.hasElevator;
        console.log("query.elevator" ,  query.elevator);
    }
    console.log("query" ,  query);
    return Post.find(query)
        .populate('userId')
        .limit(7)
        .sort('-createdAt');
}

export async function getAveragePrice(location) {
    const posts = await Post.find({
        address: { $regex: location, $options: 'i' }
    });

    if (posts.length === 0) return null;

    return posts.reduce((sum, post) => sum + post.price, 0) / posts.length;
}
