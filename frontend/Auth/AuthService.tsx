"use client";
import {jwtDecode} from "jwt-decode";
export function setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
}

export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export function getProfileData(){
    const token = localStorage.getItem('accessToken');
    if(token){
        return jwtDecode(token);
    }
}