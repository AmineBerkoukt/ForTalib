import React from "react";
import { User, Mail, Calendar,Phone , IdCard} from "lucide-react";
import ProfileField from "./ProfileField.jsx";
import { getInputClassName } from "./formUtils.jsx";

export default function ProfileDetails({
                                           fullName,
                                           displayUser,
                                           formData,
                                           isEditing,
                                           isDarkMode,
                                           isSubmitting,
                                           handleChange,
                                       }) {
    return (
        <div className="space-y-3 mt-6">
            <ProfileField
                icon={<User className="w-6 h-6" />}
                label="Name"
                value={fullName.trim() || "Name not set"}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                isSubmitting={isSubmitting}
            >
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={getInputClassName(isDarkMode)}
                        placeholder="First Name"
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={getInputClassName(isDarkMode)}
                        placeholder="Last Name"
                        disabled={isSubmitting}
                    />
                </div>
            </ProfileField>

            <ProfileField
                icon={<Mail className="w-6 h-6" />}
                label="Email"
                value={displayUser?.email || "Email not set"}
                isDarkMode={isDarkMode}
            />

            <ProfileField
                icon={<Phone className="w-6 h-6" />}
                label="Phone"
                value={displayUser?.phoneNumber || "Phone not set"}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                isSubmitting={isSubmitting}
            >
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={getInputClassName(isDarkMode)}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                />
            </ProfileField>

            <ProfileField
                icon={<IdCard className="w-6 h-6" />}
                label="CIN"
                value={displayUser?.cin || "CIN not set"}
                isEditing={isEditing}
                isDarkMode={isDarkMode}
                isSubmitting={isSubmitting}
            >
                <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    className={getInputClassName(isDarkMode)}
                    placeholder="Enter your CIN"
                    disabled={isSubmitting}
                />
            </ProfileField>

            <ProfileField
                icon={<Calendar className="w-6 h-6" />}
                label="Joined"
                value={displayUser?.createdAt?.split("T")[0] || "Join date not set"}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
