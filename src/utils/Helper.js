const persianDate = require('persian-date');
const crypto = require('crypto');
const fs = require('fs');

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1; // Months are zero-indexed
    let day = today.getDate();

    // Ensure month and day are two digits
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}

const getCurrentDatePersian = () => {
    const persianDate8 = new persianDate().format('YYYY/MM/DD');
    return persianDate8;
}

const getCurrentDateWithDayPersian = () => {
    const persianDateDate = new persianDate().format('YYYY/MM/DD');
    const persianDateDay = new persianDate().format('dddd');
    return `${persianDateDate} - ${persianDateDay}`;
}

const generateRandomHashId = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let randomString = '';
    for (let i = 0; i < 64; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

const generateRandomHashIdCrypto = () => {
    // Generate a random string using crypto's randomBytes
    const randomString = crypto.randomBytes(32).toString('hex');

    // Hash the random string using SHA-256
    const hash = crypto.createHash('sha256').update(randomString).digest('hex');

    return hash;
}

const createImageFromBase64 = async (base64String, outputFilePath, maxSizeInBytes) => {
    return new Promise((resolve, reject) => {
        // Remove data URL prefix
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

        // Decode the base64 data
        const binaryData = Buffer.from(base64Data, 'base64');

        const maxSize = maxSizeInBytes * 1024 * 1024; // ? MB

        // Check file size
        if (binaryData.length > maxSize) {
            reject(`لطفا عکس کمتر از ${maxSizeInBytes} مگابایت ارسال نمایید`);
            return;
        }

        fs.writeFile(outputFilePath, binaryData, { encoding: 'binary' }, (err) => {
            if (err) {
                reject('خطا در انجام عملیات');
            } else {
                resolve(outputFilePath);
            }
        });
    })
}

const generateRandomNumber = () => {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number

    // Generate a random number within the specified range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareObjects(obj1, obj2) {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if number of keys are same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and their values are identical
    for (let key of keys1) {
        // If the value is an object, recursively compare
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!compareObjects(obj1[key], obj2[key])) {
                return false;
            }
        } else if (obj1[key] !== obj2[key]) {
            // Otherwise, compare values
            return false;
        }
    }

    return true;
}

const objectExistsInArray = (obj, arr) => {
    for (let item of arr) {
        if (compareObjects(item, obj)) {
            return true;
        }
    }
    return false;
}

const getCookie = (cookieName) => {
    // Split the document.cookie string into individual cookie components
    var cookies = document.cookie.split(';');

    // Iterate through each cookie
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];

        // Trim leading and trailing whitespace
        cookie = cookie.trim();

        // Check if the cookie starts with the specified name
        if (cookie.startsWith(cookieName + '=')) {
            // Extract the cookie value and return it
            return cookie.substring(cookieName.length + 1);
        }
    }

    // Return null if the cookie is not found
    return null;
}

const generateShortLink = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortLink = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shortLink += characters.charAt(randomIndex);
    }
    return shortLink;
}

module.exports = {
    getCurrentDate,
    getCurrentDatePersian,
    getCurrentDateWithDayPersian,
    generateRandomHashId,
    createImageFromBase64,
    generateRandomNumber,
    compareObjects,
    objectExistsInArray,
    getCookie,
    generateShortLink
}