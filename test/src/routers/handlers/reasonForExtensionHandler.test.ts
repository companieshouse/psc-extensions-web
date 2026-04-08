import { ReasonForExtensionHandler } from "../../../../src/routers/handlers/reasonForExtensionHandler";
import { COMPANY_NUMBER, PSC_ID, PSC_INDIVIDUAL } from "../../../mocks/psc.mock";
import { validCompanyProfile } from "../../../mocks/companyProfile.mock";
import { TRANSACTION_ID } from "../../../mocks/pscExtension.mock";

class TestableReasonForExtensionHandler extends ReasonForExtensionHandler {
    public exposeGetViewData (req: any, res: any) {
        return this.getViewData(req, res);
    }
}

const mockGetPscIndividual = jest.fn();
const mockGetCompanyProfile = jest.fn();

jest.mock("../../../../src/services/pscIndividualService", () => ({
    getPscIndividual: (...args: any[]) => mockGetPscIndividual(...args)
}));

jest.mock("../../../../src/services/companyProfileService", () => ({
    getCompanyProfile: (...args: any[]) => mockGetCompanyProfile(...args)
}));

describe("ReasonForExtensionHandler", () => {
    const mockPscIndividualResource = {
        httpStatusCode: 200,
        resource: PSC_INDIVIDUAL
    };

    const baseReq = {
        query: {
            companyNumber: COMPANY_NUMBER,
            selectedPscId: PSC_ID,
            id: TRANSACTION_ID,
            lang: "en"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetPscIndividual.mockResolvedValue(mockPscIndividualResource);
        mockGetCompanyProfile.mockResolvedValue(validCompanyProfile);
    });

    it("should return an empty pscName when pscIndividual.resource.name is undefined", async () => {
        const handler = new TestableReasonForExtensionHandler();
        const req = {
            ...baseReq
        };

        const mockPscIndividualWithoutName = {
            httpStatusCode: 200,
            resource: {
                ...PSC_INDIVIDUAL,
                name: undefined
            }
        };

        mockGetPscIndividual.mockResolvedValue(mockPscIndividualWithoutName);

        const result = await handler.exposeGetViewData(req, {});

        expect(result.pscName).toBe("");
    });
});