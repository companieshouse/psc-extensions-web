import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS } from "../../../src/lib/constants";

const router = supertest(app);

describe("GET extension confirmation router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 200 and first extension confirmation screen with text", async () => {
        const res = await router.get(SERVICE_PATH_PREFIX + PATHS.FIRST_EXTENSION_CONFIRMATION);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("You can submit another request using this service");
    });

    it("should return status 200 and second extension confirmation screen with text", async () => {
        const res = await router.get(SERVICE_PATH_PREFIX + PATHS.SECOND_EXTENSION_CONFIRMATION);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("You cannot request another extension using this service.");
    });
});
