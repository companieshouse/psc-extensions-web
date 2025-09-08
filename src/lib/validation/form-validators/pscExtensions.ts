import errorManifest from "../../utils/error_manifests/errorManifests";
import { validExtensionReasons, ExtensionReason } from "../../constants";

export class PscExtensionsFormsValidator {

    validateExtensionReason (reason: string | undefined): string | null {
        const isValid = typeof reason === "string" && validExtensionReasons.includes(reason as ExtensionReason);
        return isValid ? null : errorManifest.validation.extensionReason;
    }

}
