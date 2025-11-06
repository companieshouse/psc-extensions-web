import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import logger from "../../lib/logger";
import { addSearchParams } from "../../utils/queryParams";
import { PATHS, PREFIXED_URLS, ROUTER_VIEWS_FOLDER_PATH, EXTERNALURLS } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { getPscExtensionCount } from "../../services/pscExtensionService";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getLocaleInfo, getLocalesService, selectLang } from "../../utils/localise";
import { formatDateBorn, internationaliseDate } from "../../utils/date";
import { saveDataInSession, getSessionValue } from "../../lib/utils/sessionHelper";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
    dueDate: string;
    companyLookupUrl: string | null;
    differentPscInCompanyUrl: string | null;
}

export class ExtensionConfirmationHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        let templateName = "";
        if (req.originalUrl.includes(PATHS.FIRST_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.FIRST_EXTENSION_CONFIRMATION.slice(1);
        } else if (req.originalUrl.includes(PATHS.SECOND_EXTENSION_CONFIRMATION)) {
            templateName = PATHS.SECOND_EXTENSION_CONFIRMATION.slice(1);
        }

        const baseViewData = await super.getViewData(req, res);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const companyNumber = req.query.companyNumber as string;
        const selectedPscId = req.query.selectedPscId as string;
        const pscIndividual = await getPscIndividual(req, companyNumber, selectedPscId);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        const transactionId = req.query.id as string;
        const extensionCount = await getPscExtensionCount(req, selectedPscId);
        const forward = decodeURI(addSearchParams(EXTERNALURLS.COMPANY_LOOKUP_FORWARD, { companyNumber: "{companyNumber}", lang }));

        let getDate = pscIndividual.resource?.identityVerificationDetails?.appointmentVerificationStatementDueOn;
        let originalVerificationDateFromSession;

        try {
            originalVerificationDateFromSession = await getSessionValue(req, "originalVerificationDueDate");
            if (!originalVerificationDateFromSession && getDate) {
                await saveDataInSession(req, "originalVerificationDueDate", getDate);
            }
        } catch (error) {
            logger.error(`Error handling session data: ${error}`);
            originalVerificationDateFromSession = null;
        }

        const originalVerificationDueDate = originalVerificationDateFromSession || getDate;

        if (originalVerificationDueDate && (typeof originalVerificationDueDate === "string" || originalVerificationDueDate instanceof Date)) {
            const newExtensionVerificationDueDate = new Date(originalVerificationDueDate);

            // Add 14 days for the first extension
            newExtensionVerificationDueDate.setDate(newExtensionVerificationDueDate.getDate() + 14);

            // If extensionCount > 1, add another 14 days
            if (extensionCount > 1) {
                newExtensionVerificationDueDate.setDate(newExtensionVerificationDueDate.getDate() + 14);
            }

            getDate = newExtensionVerificationDueDate;
        }

        function resolveUrlTemplate (PREFIXEDURL: string): string | null {
            return addSearchParams(PREFIXEDURL, { companyNumber, lang });
        }
        return {
            ...baseViewData,
            ...getLocaleInfo(locales, lang),
            templateName: templateName,
            pscName: pscIndividual.resource?.name!,
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            dueDate: this.getLocalizedDate(getDate, lang),
            referenceNumber: transactionId,
            companyLookupUrl: addSearchParams(EXTERNALURLS.COMPANY_LOOKUP, { forward }),
            differentPscInCompanyUrl: resolveUrlTemplate(PREFIXED_URLS.INDIVIDUAL_PSC_LIST)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);

        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }

    private getLocalizedDate (date: Date | undefined, lang: string): string {
        return date === undefined ? "" : internationaliseDate(date.toString(), lang);
    }
}
