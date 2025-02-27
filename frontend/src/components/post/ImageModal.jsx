import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageModal = ({
                        isOpen,
                        onClose,
                        images,
                        initialIndex = 0
                    }) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const controlsTimeoutRef = useRef(null);
    const imageRef = useRef(null);
    const modalRef = useRef(null);

    // Reset current index when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsZoomed(false);
            setDragPosition({ x: 0, y: 0 });
            resetControlsTimeout();
        }
    }, [isOpen, initialIndex]);

    // Minimum swipe distance for navigation (in pixels)
    const minSwipeDistance = 50;

    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            if (!isZoomed) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleNext = useCallback(() => {
        if (isZoomed) return;
        setIsLoading(true);
        setCurrentIndex(prevIndex =>
            prevIndex === images.length - 1 ? prevIndex : prevIndex + 1
        );
        resetControlsTimeout();
    }, [images, isZoomed]);

    const handlePrevious = useCallback(() => {
        if (isZoomed) return;
        setIsLoading(true);
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? prevIndex : prevIndex - 1
        );
        resetControlsTimeout();
    }, [isZoomed]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            // Modified to always close the modal on Escape
            onClose();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0 && !isZoomed) {
            handlePrevious();
        } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1 && !isZoomed) {
            handleNext();
        } else if (e.key === ' ') {
            toggleZoom();
            e.preventDefault();
        } else if (e.key === 'i') {
            setShowInfo(!showInfo);
            e.preventDefault();
        }
        resetControlsTimeout();
    }, [onClose, handlePrevious, handleNext, currentIndex, images, isZoomed, showInfo]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            resetControlsTimeout();
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isOpen, handleKeyDown]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        resetControlsTimeout();
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (!isZoomed) {
            if (isLeftSwipe && currentIndex < images.length - 1) {
                handleNext();
            } else if (isRightSwipe && currentIndex > 0) {
                handlePrevious();
            }
        }
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
        setDragPosition({ x: 0, y: 0 });
        setShowControls(!isZoomed);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleMouseDown = (e) => {
        if (!isZoomed) return;

        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !isZoomed) return;

        setDragPosition(prev => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleModalClick = (e) => {
        // Modified to always close the modal when clicking on background
        if (e.target === e.currentTarget) {
            onClose();
        }
        resetControlsTimeout();
    };

    if (!isOpen) return null;
    if (!images || images.length === 0) return null;

    const hasNext = currentIndex < images.length - 1;
    const hasPrevious = currentIndex > 0;

    // Create portal content
    const modalContent = (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-gray-900/95 dark:bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out"
            onClick={handleModalClick}
            onMouseMove={() => resetControlsTimeout()}
        >
            <div
                className="absolute inset-0 flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-12 h-12 border-4 border-blue-400 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Top controls bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 
                    bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ease-in-out
                    ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Image counter */}
                    <div className="text-white text-sm md:text-lg font-medium px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2">



                        {/* Close button */}
                        <button
                            className="p-2 text-white hover:text-red-300 transition-colors rounded-full hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className={`w-full absolute top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-4 
                      transition-opacity duration-300 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {/* Previous button */}
                    {hasPrevious ? (
                        <button
                            className="p-2 md:p-3 text-white hover:text-blue-300 transition-colors
                      bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm
                      transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    ) : (
                        <div className="w-10 md:w-12"></div> // Spacer to maintain layout
                    )}

                    {/* Next button */}
                    {hasNext ? (
                        <button
                            className="p-2 md:p-3 text-white hover:text-blue-300 transition-colors
                      bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm
                      transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    ) : (
                        <div className="w-10 md:w-12"></div> // Spacer to maintain layout
                    )}
                </div>

                {/* Main image container */}
                <div
                    className={`relative transition-transform duration-300 ease-in-out 
                    ${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'}
                    ${isDragging ? 'cursor-grabbing' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDragging) toggleZoom();
                    }}
                >
                    <div className="relative">
                        {/* Semi-transparent background for better image visibility against dark backgrounds */}
                        <div className="absolute inset-0 rounded-lg bg-black/20 backdrop-blur-sm filter"></div>

                        <img
                            ref={imageRef}
                            src={images[currentIndex]}
                            alt="Enlarged view"
                            className={`max-h-[90vh] max-w-[90vw] object-contain select-none rounded-lg shadow-2xl
                        transition-all duration-300 ease-in-out relative z-10
                        ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            style={{
                                transform: isZoomed ? `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(2)` : 'scale(1)',
                            }}
                            onLoad={handleImageLoad}
                            draggable="false"
                        />
                    </div>

                    {/* Image information overlay */}
                    {showInfo && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3
                         text-white rounded-b-lg transition-all duration-300 z-20">
                            <h4 className="text-lg font-semibold">Image Details</h4>
                            <p className="text-sm opacity-80">Filename: image-{currentIndex + 1}.jpg</p>
                            <p className="text-sm opacity-80">Position: {currentIndex + 1} of {images.length}</p>
                        </div>
                    )}


                </div>

                {/* Touch navigation hints for mobile */}
                <div className={`absolute top-16 left-0 right-0 text-center text-white/60 text-xs md:hidden
                      px-4 py-2 mx-auto w-auto max-w-max bg-black/40 backdrop-blur-sm rounded-full
                      transition-opacity duration-300 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    {isZoomed ? 'Pinch to zoom, drag to pan' : 'Swipe to navigate'}
                </div>

                {/* Keyboard shortcuts indicator */}
                <div className={`hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs
                      space-x-4 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full
                      transition-opacity duration-300 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    <span>Space: Zoom</span>
                    <span>←/→: Navigate</span>
                    <span>Esc: Close</span>
                </div>
            </div>
        </div>
    );

    // Use createPortal to render the modal directly to the document body
    return createPortal(modalContent, document.body);
};

export default ImageModal;