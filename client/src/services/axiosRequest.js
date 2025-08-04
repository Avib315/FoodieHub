import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:3001/api';
axios.defaults.withCredentials = true;
export async function axiosRequest({ method = "POST", body = {}, url = "" }) {
    try {
        const data = await axios.request({
            method,
            data: body,
            url,
            baseURL: API_BASE_URL,
            withCredentials: true
        })
        return data.data
    }
    catch (err) {
        console.error(err)
        return null;
    }
}