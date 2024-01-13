import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '@/app.module';
import configuration from '@/config/configuration';
import { ValidationPipe } from '@nestjs/common';

function getMicroserviceOptions(): MicroserviceOptions {
    const temporaryConfig = configuration();

    return {
        transport: Transport.TCP,
        options: {
            port: temporaryConfig.port,
        },
    };
}

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        getMicroserviceOptions(),
    );

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.listen();
}

bootstrap();
