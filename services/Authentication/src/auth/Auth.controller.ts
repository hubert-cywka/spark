import {
    All,
    Body,
    ConflictException,
    Controller,
    HttpCode,
    Inject,
    Logger,
    Post,
    UnauthorizedException,
} from "@nestjs/common";

import { LoginDto } from "@/auth/dto/Login.dto";
import { RegisterDto } from "@/auth/dto/Register.dto";
import { IAuthService, IAuthServiceToken } from "@/auth/services/IAuth.service";
import { Public } from "@/common/decorators/Public.decorator";
import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ifError } from "@/common/utils/ifError";

@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(@Inject(IAuthServiceToken) private authService: IAuthService) {}

    @All("/authorize/*")
    authorize() {
        // TODO: Attach authorization metadata like permissions etc.
        return true;
    }

    @Public()
    @HttpCode(200)
    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(loginDto.email, loginDto.password);
        } catch (err) {
            this.logger.error("Failed to login user.", {
                err,
                email: loginDto.email,
            });
            ifError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
        }
    }

    @Public()
    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        try {
            return await this.authService.register(registerDto.email, registerDto.password);
        } catch (err) {
            this.logger.error("Failed to register user.", {
                err,
                email: registerDto.email,
            });
            ifError(err).is(EntityAlreadyExistsError).throw(new ConflictException()).elseRethrow();
        }
    }
}
