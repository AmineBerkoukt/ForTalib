import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { initUpperCase } from "../utils/validators_filters.js";

const GoogleLoginButton = () => {
    const { oAuthLogin } = useAuthStore();
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            const user = {
                firstName: initUpperCase(decoded.given_name || ""),
                lastName: decoded.family_name || "",
                email: decoded.email,
                googleId: decoded.sub,
            };

            console.log("Sending user data:", user);
            await oAuthLogin(user);
            navigate("/");
        } catch (error) {
            console.error("Error during OAuth login:", error);
        }
    };

    const onFailure = (error) => {
        console.error("OAuth login failed:", error);
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="w-full">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    useOneTap
                    width="100%"
                    text="continue_with"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
