import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class SudoModeGuard extends AuthGuard("sudo") {}
