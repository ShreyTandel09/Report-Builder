import { Field } from "../../types";
import { axiosInstance } from "../axios";

export const getAvailableFields = async () => {
    const response = await axiosInstance.get('/get-available-fields');
    return response.data;
};

interface ReportDataRequest {
    columns: object;
    date?: string;
}

export const getReportData = async (params: ReportDataRequest) => {
    try {
        console.log("Params:", params);
        const response = await axiosInstance.post('/get-report-data', params);
        return response.data;
    } catch (error) {
        console.error('Error fetching report data:', error);
        throw error;
    }
};

