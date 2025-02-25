import { User, Image, MessageSquare } from "lucide-react"

const LoadingScene = ({ isDarkMode }) => {
    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className="w-full max-w-md p-8 rounded-lg shadow-lg relative overflow-hidden">
                <div className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-white"} opacity-90`}></div>

                {/* Profile skeleton */}
                <div className="relative z-10 flex items-center mb-8">
                    <div className={`w-20 h-20 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
                    <div className="ml-4 flex-1">
                        <div className={`h-6 w-3/4 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"} rounded animate-pulse mb-2`}></div>
                        <div className={`h-4 w-1/2 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"} rounded animate-pulse`}></div>
                    </div>
                </div>

                {/* Posts skeleton */}
                <div className="relative z-10 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}>
                            <div className={`h-4 w-3/4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded mb-2`}></div>
                            <div className={`h-3 w-full ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded mb-2`}></div>
                            <div className={`h-3 w-2/3 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} rounded`}></div>
                        </div>
                    ))}
                </div>

                {/* Animated icons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="flex space-x-8">
                        <User className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"} animate-bounce`} />
                        <Image className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"} animate-pulse`} />
                        <MessageSquare className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"} animate-bounce`} />
                    </div>
                </div>

                {/* Loading text */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className={`text-lg font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Loading profile...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingScene

