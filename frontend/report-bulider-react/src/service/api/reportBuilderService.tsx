import { axiosInstance } from "../axios";

export const getAvailableFields = async () => {
    const response = await axiosInstance.get('/report/get-available-fields');
    return response.data;
};

interface ReportDataRequest {
    columns: object;
    date?: string;
}

export const getReportData = async (params: ReportDataRequest) => {
    try {
        // console.log("Params:", params);
        const response = await axiosInstance.post('/report/get-report-data', params);
        return response.data;
    } catch (error) {
        console.error('Error fetching report data:', error);
        throw error;
    }
};

export const exportReportDataExcel = async (params: ReportDataRequest, responseType?: 'blob') => {
    try {
        const response = await axiosInstance.post('/report/export-report-data-excel', params, {
            responseType: responseType === 'blob' ? 'blob' : 'json'
        });
        return response;
    } catch (error) {
        console.error('Error exporting report data:', error);
        throw error;
    }
};

