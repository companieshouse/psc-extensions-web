import { Request, Response } from "express";
import { validateExtensionRequest } from "../../../src/middleware/is.valid.extension.middleware";
import { getIsPscExtensionValid, getPscExtensionCount } from "../../../src/services/pscExtensionService";
import { PATHS, PREFIXED_URLS, SERVICE_PATH_PREFIX, STOP_TYPE } from "../../../src/lib/constants";
import { HttpError } from "../../../src/lib/utils/error_manifests/httpError";
import { mockInvalidValidationStatusResponse, mockValidationStatusResponse } from "../../mocks/validationStatus.mock";
import { getUrlWithStopType } from "../../../src/utils/url";

jest.mock("../../../src/services/pscExtensionService");
const mockGetIsPscExtensionValid = getIsPscExtensionValid as jest.MockedFunction<typeof getIsPscExtensionValid>;
const mockGetPscExtensionCount = getPscExtensionCount as jest.MockedFunction<typeof getPscExtensionCount>;

describe("validateExtensionRequest middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            query: {
                companyNumber: "2222222",
                selectedPscId: "1111111"
            },
            originalUrl: "/some-other-url"
        };
        res = {
            redirect: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("when validation passes", () => {
        it("should redirect to request extension page when isValid is true and count is 0", (done) => {
            mockGetIsPscExtensionValid.mockResolvedValue(mockValidationStatusResponse);
            mockGetPscExtensionCount.mockResolvedValue(0);

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    if (error) {
                        done(error);
                        return;
                    }
                    done(new Error("next() should not have been called"));
                } catch (e) {
                    done(e);
                }
            });

            setTimeout(() => {
                try {
                    expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(
                        req,
                        "1111111",
                        "2222222"
                    );
                    expect(mockGetPscExtensionCount).toHaveBeenCalledWith(req, "1111111");
                    expect(res.redirect).toHaveBeenCalledWith(
                        `${SERVICE_PATH_PREFIX}${PATHS.REQUEST_EXTENSION}?companyNumber=2222222&selectedPscId=1111111`
                    );
                    done();
                } catch (e) {
                    done(e);
                }
            }, 10);
        });

        it("should call next() when count is 0 and user is already on request extension path", (done) => {
            const reqOnExtensionPath = {
                ...req,
                originalUrl: "/persons-with-significant-control-extensions/requesting-an-extension?companyNumber=2222222&selectedPscId=1111111"
            };
            mockGetIsPscExtensionValid.mockResolvedValue(mockValidationStatusResponse);
            mockGetPscExtensionCount.mockResolvedValue(0);

            validateExtensionRequest(reqOnExtensionPath as Request, res as Response, (error?: unknown) => {
                try {
                    if (error) {
                        done(error);
                        return;
                    }
                    expect(res.redirect).not.toHaveBeenCalled();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should redirect to extension requesting an extension page when count is 1", (done) => {
            mockGetIsPscExtensionValid.mockResolvedValue(mockValidationStatusResponse);
            mockGetPscExtensionCount.mockResolvedValue(1);

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    if (error) {
                        done(error);
                        return;
                    }
                    done(new Error("next() should not have been called"));
                } catch (e) {
                    done(e);
                }
            });

            setTimeout(() => {
                try {
                    expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(
                        req,
                        "1111111",
                        "2222222"
                    );
                    expect(mockGetPscExtensionCount).toHaveBeenCalledWith(req, "1111111");
                    expect(res.redirect).toHaveBeenCalledWith(
                        `${SERVICE_PATH_PREFIX}${PATHS.REQUEST_EXTENSION}?companyNumber=2222222&selectedPscId=1111111`
                    );
                    done();
                } catch (e) {
                    done(e);
                }
            }, 10);
        });

        it("should redirect to extension refused page when count is >= 2", (done) => {
            mockGetIsPscExtensionValid.mockResolvedValue(mockValidationStatusResponse);
            mockGetPscExtensionCount.mockResolvedValue(2);

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    if (error) {
                        done(error);
                        return;
                    }
                    done(new Error("next() should not have been called"));
                } catch (e) {
                    done(e);
                }
            });

            setTimeout(() => {
                try {
                    expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(
                        req,
                        "1111111",
                        "2222222"
                    );
                    expect(mockGetPscExtensionCount).toHaveBeenCalledWith(req, "1111111");
                    const stopTypeURL: string = getUrlWithStopType(PREFIXED_URLS.STOP_SCREEN, STOP_TYPE.EXTENSION_LIMIT_EXCEEDED);
                    expect(res.redirect).toHaveBeenCalledWith(
                        `${stopTypeURL}?companyNumber=2222222&selectedPscId=1111111`
                    );
                    done();
                } catch (e) {
                    done(e);
                }
            }, 10);
        });
    });

    describe("when validation fails", () => {
        it("should redirect to extension refused page when isValid is false", (done) => {
            mockGetIsPscExtensionValid.mockResolvedValue(mockInvalidValidationStatusResponse);

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    if (error) {
                        done(error);
                        return;
                    }
                    done(new Error("next() should not have been called"));
                } catch (e) {
                    done(e);
                }
            });

            setTimeout(() => {
                try {
                    expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(
                        req,
                        "1111111",
                        "2222222"
                    );
                    const stopTypeURL: string = getUrlWithStopType(PREFIXED_URLS.STOP_SCREEN, STOP_TYPE.VERIFY_DEADLINE_PASSED);
                    expect(res.redirect).toHaveBeenCalledWith(
                        `${stopTypeURL}?companyNumber=2222222&selectedPscId=1111111`
                    );
                    done();
                } catch (e) {
                    done(e);
                }
            }, 10);
        });
    });

    describe("when service throws an error", () => {
        it("should call next with error when validation service throws error", (done) => {
            mockGetIsPscExtensionValid.mockRejectedValue(new Error("Service error"));

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe("Service error");
                    expect(res.redirect).not.toHaveBeenCalled();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should call next with error when extension count service throws error", (done) => {
            mockGetIsPscExtensionValid.mockResolvedValue(mockValidationStatusResponse);
            mockGetPscExtensionCount.mockRejectedValue(new Error("Count service error"));

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe("Count service error");
                    expect(mockGetIsPscExtensionValid).toHaveBeenCalledWith(
                        req,
                        "1111111",
                        "2222222"
                    );
                    expect(mockGetPscExtensionCount).toHaveBeenCalledWith(req, "1111111");
                    expect(res.redirect).not.toHaveBeenCalled();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe("when required parameters are missing", () => {
        it("should call next with error when selectedPscId is missing", (done) => {
            req.query = { ...req.query, selectedPscId: undefined };

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    expect(error).toBeInstanceOf(HttpError);
                    expect(mockGetIsPscExtensionValid).not.toHaveBeenCalled();
                    expect(res.redirect).not.toHaveBeenCalled();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should call next with error when companyNumber is missing", (done) => {
            req.query = { ...req.query, companyNumber: undefined };

            validateExtensionRequest(req as Request, res as Response, (error?: any) => {
                try {
                    expect(error).toBeInstanceOf(HttpError);
                    expect(mockGetIsPscExtensionValid).not.toHaveBeenCalled();
                    expect(res.redirect).not.toHaveBeenCalled();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
