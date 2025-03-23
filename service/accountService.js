const AccountDao = require("../dao/accountDao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const secret = process.env.JWT_SECRET;