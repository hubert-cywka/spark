import { All, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { User } from '@/auth/interfaces/user.interface';
import { Public } from '@/auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @All('/authorize')
    authorize() {
        // TODO: Attach authorization metadata like permissions etc.
        return true;
    }

    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        const user: User = {
            email: registerDto.email,
            password: registerDto.password,
            name: registerDto.name,
        };

        return this.authService.register(user);
    }
}
