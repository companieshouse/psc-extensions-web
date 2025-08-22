import {Request, Response} from "express";
import {Transaction} from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import {ApiErrorResponse, Resource} from "@companieshouse/api-sdk-node/dist/services/resource";
import {postTransaction} from "../../../services/transactionService";
import {createPscExtension, PscExtensions, PscExtensionsData} from "../../../services/pscExtensionsService";
import {logger} from "../../../lib/logger";

export class NewSubmissionHandler {

    // todo(1): implement this fully with the web app, when submitting an extension request
    public async handleNewSubmission(req: Request, res: Response): Promise<string> {
        const transaction: Transaction = await postTransaction(req);
        logger.info(`CREATED transaction with transactionId="${transaction.id}"`);

        // todo(2): ensure we have server side validation to not allow MORE than 2 verification requests
        const resource = await this.createNewSubmission(req, transaction);

        const companyNumber = req.query.companyNumber as string;

        let nextPageUrl: string = "";
        if (this.isErrorResponse(resource)) {
            // todo(any): proper error page i.e extensions already submitted/can't submit more
            // todo(any): 500, server error or something went wrong page if server error?
            nextPageUrl = "/extensions/problem-with-psc-data";
        } else {
            const pscExtension = resource.resource;
            logger.info(`CREATED New Resource ${pscExtension?.links?.self}`);

            // todo(any): route to generic extension successful page, or have a page per extension req?
            // page per extension req might be better for tracking etc, but generic one is "simpler"
            // psuedo-code atm below, will need to be worked on and integrated with front-end
            const regex = "persons-with-significant-control-extensions/(.*)$";
            const resourceId = pscExtension?.links?.self?.match(regex);
            nextPageUrl = `/extensions/confirmation/${transaction.id}/${resourceId?.[1]}`;
        }

        // do we even need company number here? or can do it just on the transaction id and resource?
        return `${nextPageUrl}?companyNumber=${companyNumber}`;
    }

    public async createNewSubmission(request: Request, transaction: Transaction): Promise<Resource<PscExtensions> | ApiErrorResponse> {
        // are these accurate? we need to make sure we have these query params and body.
        const companyNumber = request.query.companyNumber as string;
        const pscNotificationId = request.query.selectedPscId as string;

        // todo(any): better enums/keys for extension reasons
        // psc-extensions-web/src/views/router_views/reason-for-extension.njk:25
        // can we use more sensible mappings i.e
        // rather than:
        //   - reason_for_extension_1
        //   - reason_for_extension_2
        // we could have:
        //   - applied-for-identity-documents-but-not-received-yet
        //   - arranged-through-govuk-one-login-to-verify-at-post-office
        // these mappings would need updated in translations and chips.
        const extensionReason = request.body.extensionReason as string;

        const extensionData: PscExtensionsData = {
            companyNumber,
            pscNotificationId,
            extensionDetails: {
                extensionReason,
                extensionRequestDate: new Date().toISOString()
            }
        };

        return createPscExtension(request, transaction, extensionData);
    }

    public isErrorResponse(obj: any): obj is ApiErrorResponse {
        return obj.httpStatusCode >= 400;
    }
}