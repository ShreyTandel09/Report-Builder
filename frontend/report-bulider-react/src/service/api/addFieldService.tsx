import { axiosInstance } from "../axios";

export const getTableData = async () => {
    const response = await axiosInstance.get('/report/get-table');
    return response.data;
};