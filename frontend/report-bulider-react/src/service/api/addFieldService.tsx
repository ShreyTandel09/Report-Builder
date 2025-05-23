import { axiosInstance } from "../axios";


export const getTableData = async () => {
    const response = await axiosInstance.get('/report/get-table');
    return response.data;
};

export const addNewField = async (newField: any) => {
    const response = await axiosInstance.post('/report/add-field', newField);
    return response.data;
};