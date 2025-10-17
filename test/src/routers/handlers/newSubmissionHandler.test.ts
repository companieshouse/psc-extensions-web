import { HttpStatusCode } from "axios";
import * as httpMocks from "node-mocks-http";
import { PATHS } from "../../../../src/lib/constants";
import { NewSubmissionHandler } from "../../../../src/routers/handlers/newSubmissionHandler";
import { postTransaction } from "../../../../src/services/transactionService";
import { createPscExtension } from "../../../../src/services/pscExtensionService";
import { CREATED_PSC_TRANSACTION } from "../../../mocks/transaction.mock";
import { PscVerificationData } from "@companieshouse/api-sdk-node/dist/services/psc-verification-link/types";
import { COMPANY_NUMBER, INDIVIDUAL_EXTENSION_CREATED, PSC_NOTIFICATION_ID, TRANSACTION_ID } from "../../../mocks/pscExtension.mock";
import { mockApiErrorResponse } from "../../../mocks/companyProfile.mock";
import { PscExtensionData } from "@companieshouse/api-sdk-node/dist/services/psc-extensions-link/types";

jest.mock("../../../../src/services/transactionService");
const mockPostTransaction = postTransaction as jest.Mock;
mockPostTransaction.mockResolvedValue({
    id: CREATED_PSC_TRANSACTION.id
});

jest.mock("../../../../src/services/pscExtensionService");
const mockCreatePscExtension = createPscExtension as jest.Mock;

const request = httpMocks.createRequest({
    method: "GET",
    url: PATHS.NEW_SUBMISSION,
    query: {
        companyNumber: COMPANY_NUMBER,
        pscNotificationId: PSC_NOTIFICATION_ID
    }
});

const response = httpMocks.createResponse({ locals: {} });

describe("new submission handler tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {

        mockCreatePscExtension.mockResolvedValue({
            httpStatusCode: HttpStatusCode.Created,
            resource: INDIVIDUAL_EXTENSION_CREATED
        });

        it("Should create a new transaction", async () => {

            const handler = new NewSubmissionHandler();

            // when
            await handler.execute(request, response);

            // then
            expect(mockPostTransaction).toHaveBeenCalledTimes(1);
            expect(mockPostTransaction).toHaveBeenCalledWith(request);
        });

        it("Should create a new psc extension submission", async () => {
            const extension: PscExtensionData = {
                companyNumber: COMPANY_NUMBER,
                pscNotificationId: PSC_NOTIFICATION_ID
            };

            const handler = new NewSubmissionHandler();

            // when
            await handler.execute(request, response);

            // then
            expect(mockCreatePscExtension).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledWith(request, CREATED_PSC_TRANSACTION.id, expect.objectContaining({ companyNumber: COMPANY_NUMBER, pscNotificationId: PSC_NOTIFICATION_ID }));
        });
    });

    describe("execute error", () => {

        mockCreatePscExtension.mockResolvedValue({
            httpStatusCode: HttpStatusCode.InternalServerError,
            resource: mockApiErrorResponse
        });

        it("Should create a new transaction", async () => {

            const handler = new NewSubmissionHandler();

            // when
            await handler.execute(request, response);

            // then
            expect(mockPostTransaction).toHaveBeenCalledTimes(1);
            expect(mockPostTransaction).toHaveBeenCalledWith(request);
        });

        it("Should create a new psc extension submission", async () => {

            const verification: PscVerificationData = {
                companyNumber: COMPANY_NUMBER,
                pscNotificationId: PSC_NOTIFICATION_ID
            };

            const handler = new NewSubmissionHandler();

            // when
            await handler.execute(request, response);

            // then
            expect(mockCreatePscExtension).toHaveBeenCalledTimes(1);
            expect(mockCreatePscExtension).toHaveBeenCalledWith(request, CREATED_PSC_TRANSACTION.id, expect.objectContaining({ companyNumber: COMPANY_NUMBER, pscNotificationId: PSC_NOTIFICATION_ID }));
        });
    });
});
