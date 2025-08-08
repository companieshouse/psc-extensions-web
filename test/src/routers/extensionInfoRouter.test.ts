import mocks from "../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SERVICE_PATH_PREFIX, PATHS } from "../../../src/lib/constants";

const router = supertest(app);

describe("GET extension info router", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(SERVICE_PATH_PREFIX + PATHS.EXTENSION_INFO).expect(200);
    });
});
