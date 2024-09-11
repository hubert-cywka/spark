import { NestFactory } from '@nestjs/core';
import * as process from 'process';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';

const PORT = process.env.PORT;

async function bootstrap() {
    const options: MicroserviceOptions = {
        transport: Transport.TCP,
        options: {
            port: parseInt(PORT),
        },
    };

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        UsersModule,
        options,
    );

    await app.listen();
}

bootstrap();
