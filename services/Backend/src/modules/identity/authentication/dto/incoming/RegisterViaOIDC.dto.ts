import { Equals, IsBoolean } from "class-validator";

export class RegisterViaOIDCDto {
    @IsBoolean()
    @Equals(true)
    readonly hasAcceptedTermsAndConditions!: boolean;
}
