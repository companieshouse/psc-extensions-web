import { ValidationStatusResponse } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";

export const mockValidationStatusResponse: ValidationStatusResponse = {
    valid: true,
    validationStatusError: []
};

export const mockInvalidValidationStatusResponse: ValidationStatusResponse = {
    valid: false,
    validationStatusError: [
        {
            message: "PSC extension request is not valid",
            field: "validation"
        }
    ]
};
