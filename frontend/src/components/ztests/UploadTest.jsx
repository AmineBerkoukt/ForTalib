import React, { useRef, useState } from "react";
import api from "../../utils/api.js";

function UploadTest() {
    const fileRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const receiverId = "677061a3c2d452ef6519f945";

    const upload = async () => {
        try {
            const uploadedFile = fileRef.current.files[0];
            if (!uploadedFile) {
                console.error("No file selected");
                return;
            }

            const formData = new FormData();
            formData.append("receiverId", receiverId);
            formData.append("media", uploadedFile);
            formData.append("text", "");

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const res = await api.post(`/messages/send/${receiverId}`, formData, config);
            console.log("Message sent successfully:", res.data);

            // Clear the form
            fileRef.current.value = "";
            setSelectedFile(null);

            // Fetch the updated image immediately
            await getImage();
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        }
    };

    const getImage = async () => {
        try {
            const res = await api.get(`/messages/${receiverId}`);
            console.info("Response 2: ", res.data);

            // Assuming the media field contains the image path
            const imageUrl = res.data[0]?.media;
            if (!imageUrl) {
                console.error("No media found in response.");
                return;
            }

            console.log("Fetched image URL: ", imageUrl);

            // Construct the full URL
            const fullImageUrl = imageUrl.startsWith("http") ? imageUrl
                : `http://localhost:5000/${imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl}`;

            console.log("Full image URL:", fullImageUrl);

            setUploadedImageUrl(fullImageUrl);
        } catch (error) {
            console.error("Error fetching image: ", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                ref={fileRef}
                onChange={handleFileChange}
            />
            <br />
            <button
                className="border rounded bg-red-700 text-black p-2 mt-2"
                onClick={upload}
                disabled={!selectedFile}
            >
                Send Message
            </button>

            <h2 className="mt-4">Uploaded image:</h2>
            {uploadedImageUrl && (
                <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image URL: {uploadedImageUrl}</p>
                    <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        className="max-w-[300px] rounded-lg shadow-md"
                        onError={() => {
                            console.error("Couldn't fetch image!");
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default UploadTest;
