import { Star } from 'lucide-react';

export const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star
                key={`full-${i}`}
                className="h-5 w-5 text-yellow-500 fill-yellow-500"
            />
        );
    }

    // Add partial star if there's a decimal
    if (decimal > 0) {
        stars.push(
            <div key="partial" className="relative inline-block h-5 w-5">
                <Star className="absolute inset-0 h-5 w-5 text-yellow-500" />
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${decimal * 100}%` }}
                >
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
            </div>
        );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <Star
                key={`empty-${i}`}
                className="h-5 w-5 text-yellow-500"
            />
        );
    }

    return stars;
};