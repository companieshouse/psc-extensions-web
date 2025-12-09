import { KindEnum, PersonWithSignificantControl } from "@companieshouse/api-sdk-node/dist/services/psc/types";

export const COMPANY_NUMBER = "12345678";
export const PSC_ID = "67edfE436y35hetsie6zuAZtr";
export const PSC_NOTIFICATION_ID = "123456";

export const PSC_INDIVIDUAL: PersonWithSignificantControl = {
    naturesOfControl: ["ownership-of-shares-75-to-100-percent", "voting-rights-75-to-100-percent-as-trust"],
    kind: KindEnum.INDIVIDUAL_PERSON_WITH_SIGNIFICANT_CONTROL,
    name: "Sir Forename Middlename Surname",
    nameElements: {
        title: "Sir",
        forename: "Forename",
        middleName: "Middlename",
        surname: "Surname"
    },
    nationality: "British",
    address: {
        postalCode: "CF14 3UZ",
        locality: "Cardiff",
        region: "South Glamorgan",
        addressLine1: "Crown Way"
    },
    countryOfResidence: "Wales",
    links: {
        self: `/company/${COMPANY_NUMBER}/persons-with-significant-control/individual/${PSC_ID}`
    },
    dateOfBirth: { year: "2000", month: "04" },
    etag: "etag",
    notifiedOn: "2023-01-31",
    identityVerificationDetails: {
        appointmentVerificationStatementDate: new Date("2023-12-01"),
        appointmentVerificationStatementDueOn: new Date("2024-01-01")
    }
};

export const PSC_INDIVIDUAL_WITHOUT_DATE: PersonWithSignificantControl = {
    naturesOfControl: ["ownership-of-shares-75-to-100-percent", "voting-rights-75-to-100-percent-as-trust"],
    kind: KindEnum.INDIVIDUAL_PERSON_WITH_SIGNIFICANT_CONTROL,
    name: "Sir Forename Middlename Surname",
    nameElements: {
        title: "Sir",
        forename: "Forename",
        middleName: "Middlename",
        surname: "Surname"
    },
    nationality: "British",
    address: {
        postalCode: "CF14 3UZ",
        locality: "Cardiff",
        region: "South Glamorgan",
        addressLine1: "Crown Way"
    },
    countryOfResidence: "Wales",
    links: {
        self: `/company/${COMPANY_NUMBER}/persons-with-significant-control/individual/${PSC_ID}`
    },
    dateOfBirth: { year: "2000", month: "04" },
    etag: "etag",
    notifiedOn: "2023-01-31"
};
