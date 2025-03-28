const accountDao = require("../dao/accountDao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * YugiohDeckBuilder Object Model
 * identifier : String, primary key, format DECK{uuidstring} or USER{uuidstring}
 * username : String
 * password : String
 * email : String
 * deck_owner : String, points to username
 * deck_name : String
 * main_deck : list, max length 60
 * side_deck : list, max length 15
 * extra_deck : list, max length 15
 * notes: String
 * 
 * GSI's (partition/sort key)
 * deck_owner-deck_name-index : deck_owner/deck_name
 * username-email-index : username/email
 * email-username-index : email/username
 */

async function registerUser(user) {
    const { email, username, password } = user;

    // Validate required fields
    if (!email || !username || !password) {
        throw { status: 400, message: "Email, username, and password are required." };
    }

    // Validate email format (only alphanumeric characters allowed)
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: "Invalid email format." };
    }

    // Check that the username is not an email
    if (username.includes("@")) {
        throw { status: 400, message: "Username cannot contain an '@' symbol." };
    }

    // Check if email is already used
    const emailTaken = await accountDao.getUserByEmail(email);
    if (emailTaken) {
        throw { status: 409, message: "Email is already registered." };
    }

    // Check if username is already taken
    const usernameTaken = await accountDao.getUserByUsername(username);
    if (usernameTaken) {
        throw { status: 409, message: "Username is already taken." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        identifier: `USER#${uuidv4()}`,
        email,
        username,
        password: hashedPassword
    };

    try {
        const registeredUser = await accountDao.registerUser(newUser);
        return registeredUser;

    } catch (error) {
        logger.error("Error registering user:", error);
        throw { status: 500, message: "Internal server error. Could not register user." };
    }
}

module.exports = {
    registerUser,
}