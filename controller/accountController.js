const express = require("express");
const router = express.Router();
const accountService = require("../service/accountService");
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

// User registration
router.post("/register", async (req, res) => {
    try {
        const user = await accountService.registerUser(req.body);
        return res
            .status(201)
            .setHeader("Access-Control-Allow-Origin", "*")
            .json({ message: "New user registered", user });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
  }
});

module.exports = router;