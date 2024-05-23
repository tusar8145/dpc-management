let base_url= import.meta.env.VITE_BASE_URL
const apiConfig = {
    hospitalList:base_url+'crud/hospitals/list',

    illnessCreate:base_url+'crud/injuries/create',
    illnessUpdate:base_url+'crud/injuries/update',
    illnessCount:base_url+'crud/injuries/count',
	illnessList:base_url+'crud/injuries/list',
    illnessClear:base_url+'crud/injuries/remove-all',
    illnessRemove:base_url+'crud/injuries/remove',
        
    medicalPrCreate:base_url+'crud/medical_practices/create',
    medicalPrUpdate:base_url+'crud/medical_practices/update',
    medicalPrCount:base_url+'crud/medical_practices/count',
	medicalPrList:base_url+'crud/medical_practices/list',
    medicalPrClear:base_url+'crud/medical_practices/remove-all',
    medicalPrRemove:base_url+'crud/medical_practices/remove',

    medicineCreate:base_url+'crud/medicines/create',
    medicineUpdate:base_url+'crud/medicines/update',
    medicineCount:base_url+'crud/medicines/count',
	medicineList:base_url+'crud/medicines/list',
    medicineClear:base_url+'crud/medicines/remove-all',
    medicineRemove:base_url+'crud/medicines/remove',

    medicinalEfCreate:base_url+'crud/medicinal_efficacy/create',
    medicinalEfUpdate:base_url+'crud/medicinal_efficacy/update',
    medicinalEfCount:base_url+'crud/medicinal_efficacy/count',
	medicinalEfList:base_url+'crud/medicinal_efficacy/list',
    medicinalEfClear:base_url+'crud/medicinal_efficacy/remove-all',
    medicinalEfRemove:base_url+'crud/medicinal_efficacy/remove',

    tableCreate:base_url+'crud/',
    tableUpdate:base_url+'crud/',
    tableCount:base_url+'crud/',
	tableList:base_url+'crud/',
    tableClear:base_url+'crud/',
    tableRemove:base_url+'crud/',

    countAdminGroup:base_url+'crud/admins/count/role',
    countHospital:base_url+'crud/hospitals/count',
}
export default apiConfig;
