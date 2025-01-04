import { Equals, IsBoolean } from "class-validator";

export class RegisterViaOIDCDto {
    @IsBoolean()
    @Equals(true)
    readonly hasAcceptedTermsAndConditions: boolean;

    constructor({ hasAcceptedTermsAndConditions }: { hasAcceptedTermsAndConditions: boolean }) {
        this.hasAcceptedTermsAndConditions = hasAcceptedTermsAndConditions;
    }
}
