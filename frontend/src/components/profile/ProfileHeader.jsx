import { Camera } from 'lucide-react';

export default function ProfileHeader({ user, isDarkMode, onImageUpload, isUpdating }) {
    return (
        <div className={`relative w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>

            {/* Profile Picture and Name */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center">
                <div className="relative">
                    <img
                        src={user?.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <label
                        className={`absolute bottom-2 right-2 p-2 rounded-full cursor-pointer
              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
              shadow-lg transition-all duration-200 ${isUpdating ? 'animate-pulse' : ''}`}
                    >
                        <Camera className="w-5 h-5"/>
                        <input type="file" className="hidden" accept="image/*" onChange={onImageUpload}/>
                    </label>
                </div>
            </div>
        </div>
    );
}