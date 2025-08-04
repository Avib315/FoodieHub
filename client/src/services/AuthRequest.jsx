import { axiosRequest } from "./axiosRequest";

export async function isAuthenticated() {
    try {
       
        const response = await axiosRequest({ method: 'GET', url: "user/isAuthenticated", })
        return response;
    } catch (error) {
        console.error('Error checking token:', error);
        return false;
    }
};