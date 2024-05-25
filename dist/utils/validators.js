import { body, validationResult } from "express-validator";
export const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
console.log("I'm here in login validator");
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Eamil is required"),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password should contain atleast 6 character"),
];
// console.log("Printing loginValidator -> ",loginValidator)
export const signupValidator = [
    body("name").notEmpty().withMessage("Message is required"),
    ...loginValidator,
];
export const chatComplitionValidator = [
    body("message").notEmpty().withMessage("Message is required"),
];
//# sourceMappingURL=validators.js.map