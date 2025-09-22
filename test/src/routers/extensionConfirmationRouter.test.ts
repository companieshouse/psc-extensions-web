import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import { PSC_INDIVIDUAL } from "../../mocks/psc.mock";

const router = supertest(app);

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
describe("GET extension confirmation router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_CONFIRMATION).expect(200);
    });
});
