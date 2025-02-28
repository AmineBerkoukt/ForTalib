import { toast } from "react-hot-toast";

export function initUpperCase (str) {
    if (str === null) {
        return null;
    }

    if (str === '' || str === undefined) {
        return undefined;
    }

    const firstLetter = str[0].toUpperCase();
    const restOfString = str.slice(1).toLowerCase();

    return firstLetter + restOfString;
}

export const validateRequiredFields = (fields) => {
    for (const field of fields) {
        if (!field.ref.current.value.trim()) {
            toast.error(field.message);
            return false;
        }
    }
    return true;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Invalid email format");
        return false;
    }
    return true;
};

export const validatePassword = (password) => {
    if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return false;
    }
    return true;
};

export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        toast.error("Invalid phone number");
        return false;
    }
    return true;
};

export const validateCin = (value) => {
    const cinRegex = /^[A-Za-z]{1,2}\d{1,7}$/;
    if (!value.trim()) return true; // Optional field
    return cinRegex.test(value);
};

export const validateTitle = (title) => {
    return title.length >= 5 && title.length <= 100 ? "" : "Title must be between 5 and 100 characters.";
};

export const validateDescription = (description) => {
    return description.length >= 15 ? "" : "Description must be at least 15 characters.";
};

export const validatePrice = (price) => {
    return price > 0 ? "" : "Price must be greater than 0.";
};

export const validateAddress = (address) => {
    return address.length >= 7 ? "" : "Address must be at least 7 characters.";
};

export const validateImages = (images) => {
    if (images.length > 6) return "You can upload up to 6 images only.";
    for (const image of images) {
        if (image.size > 10 * 1024 * 1024) return "Each image must be under 10MB.";
        if (!["image/jpeg", "image/png", "image/gif"].includes(image.type)) {
            return "Only PNG, JPG, and GIF formats are allowed.";
        }
    }
    return "";
};
