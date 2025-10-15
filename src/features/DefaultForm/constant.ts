export const CREATE_REGISTRATION_ERROR_MAP: Record<string, string> = {
  "400": "Something went wrong",
  "403": "Email already registered. Please login to continue",
  "406": "Recaptcha validity has expired, please try refreshing the page",
  "409": "Phone number is linked to a different email",
  "422": "Please fill the required fields",
  "default": "Something went wrong",
};

export const VERIFY_OTP_ERROR_MAP: Record<string, string> = {
  "400": "Something went wrong",
  "401": "Incorrect Verification Code entered",
  "403": "Fill the details and click on Get Verification Code first",
  "404": "Fill the details and click on Get Verification Code first",
  "409": "Phone number is linked to a different account",
  "default": "Something went wrong",
};
