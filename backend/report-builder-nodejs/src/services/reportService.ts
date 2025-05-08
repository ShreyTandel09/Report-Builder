
import ReportColumnField from '../models/ReportColumnFields';

const getAvailableFieldsFromDB = async (): Promise<ReportColumnField[]> => {
    const availableFields = await ReportColumnField.findAll();
    return availableFields;
};

export {
    getAvailableFieldsFromDB
};