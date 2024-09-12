import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import configuration from '@/config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const appConfig = configuration();

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.listen(appConfig.port);
}

bootstrap();
