import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class LogoutDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    readonly allSessions?: boolean;
}
