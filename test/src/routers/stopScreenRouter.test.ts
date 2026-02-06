import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { PREFIXED_URLS, STOP_TYPE } from "../../../src/lib/constants";
import { HttpStatusCode } from "axios";
import { PSC_INDIVIDUAL } from "../../mocks/psc.mock";
import { getUrlWithStopType } from "../../../src/utils/url";
const router = supertest(app);

jest.mock("../../../src/services/pscIndividualService", () => ({
    getPscIndividual: () => ({
        httpStatusCode: HttpStatusCode.Ok,
        resource: PSC_INDIVIDUAL
    })
}));
describe("GET stop screen router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it.each(Object.values(STOP_TYPE))("Should render the stop screen '%s' with successful status code", async (stopType: STOP_TYPE) => {
        const stopScreenURL = getUrlWithStopType(PREFIXED_URLS.STOP_SCREEN, stopType);
        await router.get(getUrlWithStopType(stopScreenURL, stopType)).expect(200);
    });
});
