import React, { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore.js";
import { Image, Send, X } from 'lucide-react';
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const { isDarkMode } = useTheme();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create a blob URL instead of a data URL
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up the blob URL
    }
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    const id = selectedUser._id ? selectedUser._id : selectedUser.id;

    const formData = new FormData();
    formData.append("receiverId", id);
    formData.append("text", text.trim());

    if (fileInputRef.current?.files[0]) {
      formData.append("media", fileInputRef.current.files[0]);
    }

    try {
      console.log("media : ", formData.get("media"));
      await sendMessage(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send the message.");
    }
  };

  // Clean up blob URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
      <div
          className={`p-2 sm:p-4 w-full border-t border-gray-500 ${
              isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
      >
        {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <img
                    src={imagePreview}
                    alt="Preview"
                    className={`w-full h-full object-cover rounded-lg border ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}
                />
                <button
                    onClick={removeImage}
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center ${
                        isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-300 hover:bg-gray-200"
                    }`}
                    type="button"
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
                type="text"
                className={`w-full rounded-lg py-2 px-3 outline-none ${
                    isDarkMode
                        ? "bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-600"
                        : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-200"
                }`}
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <button
                type="button"
                className={`btn btn-circle ${
                    isDarkMode ? "bg-emerald-600" : "bg-emerald-500"
                } hover:bg-emerald-400`}
                onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} className={isDarkMode ? "text-gray-300" : "text-gray-900"} />
            </button>
          </div>
          <button
              type="submit"
              className={`btn btn-circle ${
                  isDarkMode
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-blue-500 hover:bg-blue-400"
              }`}
              disabled={!text.trim() && !imagePreview}
          >
            <Send size={20} className={isDarkMode ? "text-gray-100" : "text-gray-900"} />
          </button>
        </form>
      </div>
  );
};

export default MessageInput;

