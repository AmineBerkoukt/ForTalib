import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, onImageClick, currentImageIndex }) => {
    const [currentIndex, setCurrentIndex] = useState(currentImageIndex || 0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full h-96 mb-2">
            <img
                src={images[currentIndex]}
                alt={`Post image ${currentIndex + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => onImageClick(currentIndex)}
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === currentIndex ? 'bg-white' : 'bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
