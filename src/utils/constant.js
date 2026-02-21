export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%&*#^$!])[A-Za-z\d@%&*#^$!]{8,24}$/;
export const mobileNoPattern = /^[0-9]{7,15}$/;
export const namePattern = /^[a-zA-z][a-zA-Z0-9 ]*$/;
export const OtpPattern = /^[0-9]{4}$/;
export const countryCodePattern = /^\+[0-9]+$/;

export const CONSTANT = {
  PASSWORD_HASH_SALT: "plant-book",
  OTP_EXPIRATION_TIME: 5 * 60 * 1000, // 10 minutes
  JWT_EXPIRATION_TIME: "7d", // 7 days
};

export const ROLE = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

export const REQUEST_OBJECT = Object.freeze({
  QUERY: "query",
  BODY: "body",
  PARAM: "params",
  HEADERS: "headers",
});
