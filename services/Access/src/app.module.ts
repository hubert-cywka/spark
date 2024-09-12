import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
    exports: [ConfigModule],
})
export class AppModule {}
