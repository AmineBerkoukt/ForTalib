export default function initUpperCase (str) {
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