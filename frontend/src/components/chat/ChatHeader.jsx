import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useChatStore } from "../../store/useChatStore.js";
import {useTheme} from "../../contexts/ThemeContext.jsx";
const BASE_URL = import.meta.env.VITE_PFP_URL;

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isDarkMode } = useTheme();

  const baseClasses = isDarkMode ? 'border-gray-700' : 'border-gray-300';


  if (!selectedUser) {
    return null; // Don't render the header if there's no selected user
  }
  return (
      <div className={`p-3 border-b  ${baseClasses}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img

                    src={BASE_URL + selectedUser.profilePhoto || "/avatar.png"}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                />
              </div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
  );
};

export default ChatHeader;
