export const getUrlWithCompanyNumberAndSelectedPscId = (url: string, companyNumber: string, selectedPscId: string): string => {
    url = url
        .replace(":companyNumber", companyNumber)
        .replace(":selectedPscId", selectedPscId);
    return url;
};
