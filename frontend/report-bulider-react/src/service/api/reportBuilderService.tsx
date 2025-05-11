import { Field } from "../../types";
import { axiosInstance } from "../axios";

export const getAvailableFields = async () => {
    const response = await axiosInstance.get('/get-available-fields');
    return response.data;
};

export const getReportData = async (fields: object) => {
    const response = await axiosInstance.post('/get-report-data', { fields });
    return response.data;
};

