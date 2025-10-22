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

export const JOB_TITLE_OPTIONS = [
  { label: "Engineering Leadership", value: "Engineering Leadership" },
  {
      label: "Software Development Engineer (Backend)",
      value: "Software Development Engineer (Backend)",
  },
  {
      label: "Software Development Engineer (Frontend)",
      value: "Software Development Engineer (Frontend)",
  },
  { label: "Data Scientist", value: "devops" },
  { label: "Android Engineer", value: "Android Engineer" },
  { label: "iOS Engineer", value: "iOS Engineer" },
  { label: "Devops Engineer", value: "Devops Engineer" },
  { label: "Support Engineer", value: "Support Engineer" },
  { label: "Research Engineer", value: "Research Engineer" },
  { label: "Engineering Intern", value: "Engineering Intern" },
  { label: "QA Engineer", value: "QA Engineer" },
  { label: "Co-founder", value: "Co-founder" },
  { label: "SDET", value: "SDET" },
  { label: "Product Manager", value: "Product Manager" },
  { label: "Product Designer", value: "Product Designer" },
  { label: "Other", value: "Other" },
]
