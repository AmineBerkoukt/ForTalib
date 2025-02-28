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
