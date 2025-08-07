import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { PrefixedUrls } from "../../../src/lib/constants";

const router = supertest(app);

describe("GET healthcheck router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(PrefixedUrls.HEALTHCHECK);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(PrefixedUrls.HEALTHCHECK).expect(200);
    });
});
