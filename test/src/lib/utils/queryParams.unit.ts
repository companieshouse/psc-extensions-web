import { addSearchParams } from "../../.././../src/utils/queryParams";
import { PREFIXED_URLS } from "../../../../src/lib/constants";

describe("behaviour when adding search params to URI", () => {
    it("should leave the URI unchanged when params are empty", () => {
        const result = addSearchParams(PREFIXED_URLS.REQUEST_EXTENSION, {});

        expect(result).toEqual(PREFIXED_URLS.REQUEST_EXTENSION);
    });

    it("should use '?' separator for first param then '&' for the rest", () => {
        const result = addSearchParams(PREFIXED_URLS.REQUEST_EXTENSION, { colour: "green", flavour: "sour" });

        expect(result).toEqual(`${PREFIXED_URLS.REQUEST_EXTENSION}?colour=green&flavour=sour`);
    });

    it("should add values to any existing URI params", () => {
        const uri = `${PREFIXED_URLS.REQUEST_EXTENSION}?flavour=sweet`;
        const result = addSearchParams(uri, { colour: "green", flavour: "sour" });

        expect(result).toEqual(`${PREFIXED_URLS.REQUEST_EXTENSION}?flavour=sweet&colour=green&flavour=sour`);
    });
});
