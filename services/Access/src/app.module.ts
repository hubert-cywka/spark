import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
    ],
    exports: [ConfigModule],
})
export class AppModule {}
