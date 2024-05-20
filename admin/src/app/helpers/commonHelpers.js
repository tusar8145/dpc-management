export const filterItemsEqual = (arr, field, value) => { try { if (field != null) { return arr.filter((item) => { return item[field]==value }) }} catch (error) { console.error(error);}}
