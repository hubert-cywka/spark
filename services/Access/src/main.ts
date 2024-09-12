import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '@/app.module';
import configuration from '@/config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const appConfig = configuration();

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
    });

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.listen(appConfig.port);
    await app.startAllMicroservices();
}

bootstrap();
