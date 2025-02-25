import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageSrc, onPrevious, onNext, hasNext, hasPrevious, totalImages, currentIndex }) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowLeft' && hasPrevious) {
            onPrevious();
        } else if (e.key === 'ArrowRight' && hasNext) {
            onNext();
        }
    }, [onClose, onPrevious, onNext, hasNext, hasPrevious]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors z-50"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X size={32} />
                </button>

                {/* Image counter */}
                <div className="absolute top-4 left-4 text-white text-lg font-medium">
                    {currentIndex + 1} / {totalImages}
                </div>

                {/* Previous button */}
                {hasPrevious && (
                    <button
                        className="absolute left-4 p-2 text-white hover:text-gray-300 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevious();
                        }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={48} />
                    </button>
                )}

                {/* Next button */}
                {hasNext && (
                    <button
                        className="absolute right-4 p-2 text-white hover:text-gray-300 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        aria-label="Next image"
                    >
                        <ChevronRight size={48} />
                    </button>
                )}

                {/* Main image container */}
                <div
                    className="relative max-w-[90vw] max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imageSrc}
                        alt="Enlarged view"
                        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
                        style={{
                            opacity: 1,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />
                </div>

                {/* Overlay for closing when clicking outside */}
                <div
                    className="absolute inset-0 z-[-1]"
                    onClick={onClose}
                />
            </div>
        </div>
    );
}

export default ImageModal