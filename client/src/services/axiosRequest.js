import axios from 'axios';
import useAuth from '../store/useAuth';

const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:3001/api';
console.log(import.meta.env.VITE_API);

axios.defaults.withCredentials = true;

export default async function axiosRequest({ method = "POST", body = {}, url = "" }) {
    try {
        const data = await axios.request({
            method,
            data: body,
            url,
            baseURL: API_BASE_URL,
            withCredentials: true
        })
        if(data.status == 200 || data.status == 201){
            return data
        }
        else if (data.notAuth) {
            useAuth.getState().logout()
        }
        else{
            return { success: false}
        }
        
    }
    catch (err) {
        console.error(err)
        
        return {success: false}
    }
}