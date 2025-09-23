import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { getCompanyProfile } from "../../services/companyProfileService";

interface PscViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
}
export function formatDateBorn (dateOfBirth: any): string {
    try {
        const formattedMonth = Intl.DateTimeFormat(dateOfBirth, { month: "long" }).format(new Date("" + dateOfBirth?.month));
        const formattedYear = dateOfBirth?.year?.toString() ?? "";
        return `${formattedMonth} ${formattedYear}`;
    } catch (error) {
        logger.error(`Error formatting date: ${error}`);
        return "Invalid date";
    }
}

export class ExtensionInfoHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        if (!pscIndividual || !companyProfile) {
            throw new Error("Company profile or psc is not found");
        }
        return {
            ...baseViewData,
            pscName: pscIndividual.resource?.name!,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            dateOfBirth: formatDateBorn(pscIndividual.resource?.dateOfBirth),
            backURL: SERVICE_PATH_PREFIX + PATHS.INDIVIDUAL_PSC_LIST,
            templateName: PATHS.EXTENSION_INFO.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_INFO,
            viewData: await this.getViewData(req, res)
        };
    }
}
