let base_url= import.meta.env.VITE_BASE_URL
const apiConfig = {
	illnessList:base_url+'crud/injuries/list',
    illnessUpdate:base_url+'crud/injuries/update',
    illnessCount:base_url+'crud/injuries/count',
    illnessCreate:base_url+'crud/injuries/create',
    hospitalList:base_url+'crud/hospitals/list',
    illnessClear:base_url+'crud/injuries/remove-all',
}
export default apiConfig;
