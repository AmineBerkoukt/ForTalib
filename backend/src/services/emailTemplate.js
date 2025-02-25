export const generatePostEmailTemplate = (post) => {
    const { _id, title, description, price, address, elevator, maximumCapacity, images } = post;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">New Post Created</h2>
            <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Price:</strong> ${price} DH</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Maximum Capacity:</strong> ${maximumCapacity} people</p>
            <p><strong>Elevator:</strong> ${elevator ? "Yes" : "No"}</p>
            
            ${images.length > 0 ? `
                <div style="text-align: center; margin-top: 15px;">
                    ${images.map(img => `<img src="http://localhost:5000${img}" alt="Post Image" style="max-width:100%; border-radius: 5px; margin-bottom: 10px;">`).join('')}
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:5000/api/posts/${_id}" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                    View Post
                </a>
            </div>
        </div>
    `;
};
