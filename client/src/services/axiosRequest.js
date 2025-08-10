import axios from 'axios';
import useAuth from '../store/useAuth';

axios.defaults.withCredentials = true;

export default async function axiosRequest({ method = "POST", body = {}, url = "" }) {
    const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:3001/api';
    console.log('Using API URL:', API_BASE_URL);

    try {
        const response = await axios.request({
            method,
            data: body,
            url,
            baseURL: API_BASE_URL,
            withCredentials: true,
            timeout: 10000, // 10 second timeout
        });

        // Check for successful status codes
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            console.error('Unexpected status code:', response.status);
            return { success: false, error: 'Unexpected status code' };
        }

    } catch (err) {
        console.error('Request failed:', err);

        // Handle different error types
        if (err.response) {
            // Server responded with error status
            const { status, data } = err.response;

            // Check for authentication errors
            if (status === 401 || data?.notAuth) {
                console.log('Authentication failed, logging out...');
                useAuth.getState().logout();
                return { success: false, error: 'Authentication failed' };
            }

            return {
                success: false,
                error: data?.message || 'Server error',
                status: status
            };

        } else if (err.request) {
            // Network error
            console.error('Network error:', err.message);
            return {
                success: false,
                error: 'Network error. Please check your connection.'
            };

        } else {
            // Other error
            return {
                success: false,
                error: err.message || 'Unknown error occurred'
            };
        }
    }
}