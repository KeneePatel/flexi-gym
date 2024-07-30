import axios from 'axios';
import {LOGIN_URL, REGISTRATION_URL, FORGOT_URL} from "@/Constants/EndPoints";


export async function login(loginInput) {
    return (await axios.post(LOGIN_URL, loginInput)).data;
}

export function setAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export async function register(profileRegistrationInput) {
    return await axios.post(REGISTRATION_URL, headers,profileRegistrationInput);
}