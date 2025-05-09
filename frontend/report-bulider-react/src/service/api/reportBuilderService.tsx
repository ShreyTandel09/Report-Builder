import { axiosInstance } from "../axios";

export const getAvailableFields = async () => {
    const response = await axiosInstance.get('/get-available-fields');
    return response.data;
};

