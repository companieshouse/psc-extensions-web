import errorManifest from "../../utils/error_manifests/errorManifests";
import { EXTENSION_REASONS } from "../../../routers/handlers/reasonForExtensionHandler";

export class PscExtensionsFormsValidator {

    validateExtensionReason (reason: string): string | null {
        return EXTENSION_REASONS.includes(reason) ? null : errorManifest.validation.extensionReason;
    }

}
