import React, { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import initUpperCase from "../../utils/validators_filters.js";

const GoogleLoginButton = () => {
  const { oAuthLogin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "profile email",
      });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = async (response) => {
    console.log("OAuth was successful:", response);

    try {
      const profile = response.profileObj;
      const user = {
        firstName: initUpperCase(profile.givenName || ""),
        lastName: profile.familyName || "",
        email: profile.email,
        googleId: response.googleId,
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
      <div className="w-full">
        <GoogleLogin
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            render={renderProps => (
                <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
            )}
            buttonText="Continue with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
        />
      </div>
  );
};

export default GoogleLoginButton;

