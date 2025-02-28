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
    if(price < 0) return "Invalid price !";
    if(price > 5000) return "Invalid price, it's Not Los Angelos :/";
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

export const postValidator = (post) => {
    const errors = [];

    const titleError = validateTitle(post.title);
    if (titleError) errors.push(titleError);

    const descriptionError = validateDescription(post.description);
    if (descriptionError) errors.push(descriptionError);

    const priceError = validatePrice(post.price);
    if (priceError) errors.push(priceError);

    const addressError = validateAddress(post.address);
    if (addressError) errors.push(addressError);

    const imagesError = validateImages(post.images);
    if (imagesError) errors.push(imagesError);

    if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return false;
    }

    return true;
};


export const profileValidator = (profile) => {
    const errors = [];

    const emailValid = validateEmail(profile.email);
    if (!emailValid) errors.push("Invalid email format.");

    const phoneValid = validatePhoneNumber(profile.phoneNumber);
    if (!phoneValid) errors.push("Invalid phone number.");

    const cinValid = validateCin(profile.cin);
    if (!cinValid) errors.push("Invalid CIN.");

    const passwordValid = validatePassword(profile.password);
    if (!passwordValid) errors.push("Password must be at least 8 characters long.");

    if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return false;
    }

    return true; // Validation passed
};

