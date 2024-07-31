export const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;
export const LOGIN_URL = `${BASE_URL}/api/auth/login`;
export const REGISTRATION_URL = `${BASE_URL}/api/auth/register`;
export const FORGOT_URL = `${BASE_URL}/api/auth/forgotPassword`;
export const RESETPW_URL = `${BASE_URL}/api/auth/resetpassword`;