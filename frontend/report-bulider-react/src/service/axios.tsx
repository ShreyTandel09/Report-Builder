import axios from 'axios';

// export const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
export const axiosInstance = axios.create({ baseURL: 'http://localhost:8001/api' });


axiosInstance.interceptors.request.use(
    (config) => {
        // const store = require('../redux/store').default;
        // const token = store.getState().auth.accessToken;
        // if (token) {
        //     config.headers.set('Authorization', `Bearer ${token}`);
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong!';
        console.error('API Error:', errorMessage);
        return Promise.reject(error.response.data);
    }
);

