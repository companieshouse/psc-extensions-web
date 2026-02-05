import { STOP_TYPE } from "lib/constants";

export const getUrlWithStopType = (url: string, stopType: STOP_TYPE): string => {
    url = url.replace(":stopType", stopType.valueOf());

    return url;
};
