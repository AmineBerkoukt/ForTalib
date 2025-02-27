import { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import {
    X,
    Play,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Building2,
    MapPin,
    Phone,
    Star,
    Users,
    Calendar,
} from "lucide-react"
import { useModalStore } from "../../store/useModalStore.js"
import { useTheme } from "../../contexts/ThemeContext.jsx"
import { useNavigate } from "react-router-dom"
import { useChatStore } from "../../store/useChatStore.js"
import { motion, AnimatePresence } from "framer-motion"

const PostDetailsModal = () => {
    const { isModalActive, modalData, disactivateModal } = useModalStore()
    const { isDarkMode } = useTheme()
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const { setSelectedUser } = useChatStore()
    const navigate = useNavigate()
    const modalRef = useRef(null)
    const mediaContainerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                disactivateModal()
            }
        }

        if (isModalActive) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isModalActive, disactivateModal])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (!isModalActive) return

            if (event.key === "ArrowLeft") {
                previousImage()
            } else if (event.key === "ArrowRight") {
                nextImage()
            } else if (event.key === "Escape") {
                disactivateModal()
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [isModalActive, disactivateModal])

    const handleTalkToOwner = async (userToTalkTo) => {
        if (!userToTalkTo) return
        setSelectedUser(userToTalkTo)
        navigate("/chat")
    }

    const mediaItems = [...(modalData?.images || []), ...(modalData?.videos || [])].map(
        (item) => `${import.meta.env.VITE_PFP_URL}${item.trim()}`,
    )

    const nextImage = () => {
        setSelectedMediaIndex((prev) => (prev + 1) % mediaItems.length)
    }

    const previousImage = () => {
        setSelectedMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
    }

    if (!isModalActive || !modalData) return null

    const propertyDetails = [
        { icon: <MapPin className="w-4 h-4" />, label: "Address", value: modalData.address },
        { icon: <Phone className="w-4 h-4" />, label: "Phone", value: modalData.user?.phoneNumber },
        {
            icon: <Star className="w-4 h-4" />,
            label: "Rating",
            value: modalData.avgRate ? `${modalData.avgRate}/5` : "N/A",
        },
        { icon: <Users className="w-4 h-4" />, label: "Capacity", value: `${modalData.maximumCapacity} people` },
        {
            icon: <Calendar className="w-4 h-4" />,
            label: "Published",
            value: new Date(modalData.createdAt).toLocaleDateString(),
        },
    ]

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${isDarkMode ? "bg-black/80" : "bg-black/60"} backdrop-blur-sm`}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`relative w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
                    ref={modalRef}
                >
                    <button
                        onClick={disactivateModal}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Media Section */}
                        <div className="relative lg:w-3/5" ref={mediaContainerRef}>
                            <div className="relative aspect-[4/3] w-full">
                                {mediaItems.length > 0 ? (
                                    <div className="relative w-full h-full overflow-hidden">
                                        <motion.div
                                            key={selectedMediaIndex}
                                            initial={{ opacity: 0, x: 0 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            {mediaItems[selectedMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video src={mediaItems[selectedMediaIndex]} controls className="w-full h-full object-contain" />
                                            ) : (
                                                <img
                                                    src={mediaItems[selectedMediaIndex] || "/placeholder.svg"}
                                                    alt={modalData.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="text-center p-8 max-w-md"
                                        >
                                            <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center shadow-inner">
                                                <Building2
                                                    className={`w-12 h-12 ${isDarkMode ? "text-blue-400" : "text-blue-500"} opacity-80`}
                                                />
                                            </div>
                                            <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                                No Pictures Available
                                            </h3>
                                            <p
                                                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-lg max-w-xs mx-auto leading-relaxed`}
                                            >
                                                This property listing doesn't have any photos yet. Contact the owner for more details.
                                            </p>
                                            <motion.div
                                                className={`mt-6 inline-flex items-center justify-center px-4 py-2 rounded-lg border ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"} text-sm`}
                                                whileHover={{
                                                    scale: 1.03,
                                                    backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                <span>Ask owner for photos</span>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Controls - Only show if there are multiple media items */}
                            {mediaItems.length > 1 && (
                                <>
                                    <button
                                        onClick={previousImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip - Only show if there are multiple media items */}
                        {mediaItems.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="p-4 overflow-x-auto">
                                    <div className="flex space-x-2 justify-center">
                                        {mediaItems.map((item, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedMediaIndex(index)}
                                                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                                                    selectedMediaIndex === index
                                                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black opacity-100"
                                                        : "opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                {item.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                        <Play className="w-6 h-6 text-white" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item || "/placeholder.svg"}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`lg:w-2/5 p-4 sm:p-6 overflow-y-auto ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                                        <Building2 className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-2xl leading-tight mb-2">{modalData.title}</h2>
                                        <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {modalData.price} Dhs
                      </span>
                                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{`/month`}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{modalData.description}</div>

                                <div className={`space-y-6 pt-6 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                      <span className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {modalData.user?.firstName} {modalData.user?.lastName}
                      </span>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleTalkToOwner(modalData.user)}
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Contact</span>
                                        </motion.button>
                                    </div>

                                    <div
                                        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                                    >
                                        {propertyDetails.map((detail, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>{detail.icon}</div>
                                                <div>
                                                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{detail.label}</p>
                                                    <p className="font-medium">{detail.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body,
    )
}

export default PostDetailsModal

