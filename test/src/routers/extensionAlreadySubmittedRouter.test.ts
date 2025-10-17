import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { PREFIXED_URLS } from "../../../src/lib/constants";

const router = supertest(app);

describe("GET extension already submitted router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(PREFIXED_URLS.EXTENSION_ALREADY_SUBMITTED).expect(200);
    });
});
