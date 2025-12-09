import { Links, PscExtension, PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";

export const FIRST_DATE = new Date(2024, 0, 2, 3, 4, 5, 6);
export const SECOND_DATE = new Date(2024, 0, 2, 3, 0, 0, 0);
export const DOB_DATE = new Date("1970-01-01");
export const COMPANY_NUMBER = "12345678";
export const TRANSACTION_ID = "11111-22222-33333";
export const PSC_NOTIFICATION_ID = "123456";
export const PSC_EXTENSION_ID = "662a0de6a2c6f9aead0f32ab";
export const UVID = "123abc456edf";
export const SELF_URI = `/transactions/${TRANSACTION_ID}/persons-with-significant-control-extensions/${PSC_EXTENSION_ID}`;

export const INITIAL_PSC_DATA: PscExtensionData = {
    requesterEmail: "example@example.com",
    companyNumber: COMPANY_NUMBER,
    pscNotificationId: PSC_NOTIFICATION_ID
};

export const LINKS: Links = {
    self: SELF_URI,
    validationStatus: ""
};

export const INDIVIDUAL_DATA: PscExtensionData = {
    requesterEmail: "example@example.com",
    companyNumber: COMPANY_NUMBER,
    pscNotificationId: PSC_NOTIFICATION_ID,
    extensionDetails: {
        extensionReason: "my reason",
        extensionStatus: "PENDING",
        extensionRequestDate: "15/11/25"
    }
};

export const INITIAL_PERSONAL_CODE_DATA: PscExtensionData = {
    requesterEmail: "example@example.com",
    companyNumber: COMPANY_NUMBER,
    pscNotificationId: PSC_NOTIFICATION_ID,
    extensionDetails: {
        extensionReason: ""
    }
};

function initPscExtension (data: PscExtensionData) {
    return {
        createdAt: FIRST_DATE,
        updatedAt: FIRST_DATE,
        data: {
            ...data
        },
        links: {
            self: SELF_URI,
            validationStatus: `${SELF_URI}/validation_status`
        }

    } as PscExtension;
}

export interface ApiError {
    error?: string;
    errorValues?: Record<string, string>;
    location?: string;
    locationType?: string;
    type?: string;
}

// Error response
export const mockOutOfServiceResponse: ApiErrorResponse = {
    httpStatusCode: 500,
    errors: [
        {
            error: "failed to execute http request"
        }
    ]
};

// Returns the PSC extension with data fields in camel case
export const INDIVIDUAL_EXTENSION_CREATED: PscExtension = initPscExtension(INITIAL_PSC_DATA);
