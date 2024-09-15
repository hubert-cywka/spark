import { All, Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "@/auth/auth.service";
import { Public } from "@/auth/decorators/public.decorator";
import { AuthenticationResponseDto } from "@/auth/dto/authenticationResponse.dto";
import { LoginDto } from "@/auth/dto/login.dto";
import { RegisterDto } from "@/auth/dto/register.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @All("/authorize")
    authorize() {
        // TODO: Attach authorization metadata like permissions etc.
        return true;
    }

    @Public()
    @Post("login")
    login(@Body() loginDto: LoginDto): Promise<AuthenticationResponseDto> {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Public()
    @Post("register")
    register(@Body() registerDto: RegisterDto): Promise<AuthenticationResponseDto> {
        return this.authService.register(registerDto.email, registerDto.password);
    }
}
