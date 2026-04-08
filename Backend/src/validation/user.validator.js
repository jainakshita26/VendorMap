const { body } = require("express-validator");


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Register validation
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be String"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .matches(passwordRegex)
    .withMessage("Password must be 8+ chars, include uppercase, lowercase, number & special character"),

  body("role")
    .optional()
    .isIn(["customer", "vendor"])
    .withMessage("Role must be customer or vendor")
];

// Login validation
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

module.exports = {
  registerValidation,
  loginValidation
};