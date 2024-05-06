export const PORT = process.env.PORT || 9871;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const BASEPATH = "/api/v1";
export const DATABASES = {
    USER: "user"
};
export const MAXAGE = 3 * 24 * 60 * 60;
export const MESSAGES = {
    DATABASE: {
        CONNECTED: "Connection to database has been established successfully",
        ERROR: "Unable to connect to database."
    },
    AUTH: {
        TOKEN_ERROR: "Access Denied: Token not provided.",
        INVALID_TOKEN: "Access Denied: Invalid token."
    },
    USER: {
        CREATED: "User created successfully.",
        LOGGEDIN: "User logged in successfully.",
        DUPLICATE_EMAIL: "Email already exist.",
        DUPLICATE_USERNAME: "Username already exist.",
        FETCHED: "User fetched successfully.",
        INVALID_USER: "Invalid credentials."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
}