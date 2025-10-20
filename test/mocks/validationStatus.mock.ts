import { ValidationStatusResponse } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";

export const mockValidationStatusResponse: ValidationStatusResponse = {
    isValid: true,
    errors: []
};

export const mockInvalidValidationStatusResponse: ValidationStatusResponse = {
    isValid: false,
    errors: [
        {
            error: "PSC extension request is not valid",
            location: "validation",
            locationType: "field",
            type: "validation"
        }
    ]
};
