import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './modules/identity/authentication/authentication.module'; // Upewnij się, że ścieżka jest poprawna

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Sprawia, że ConfigService jest dostępny globalnie
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          // Domyślny (globalny) limit dla większości endpointów
          ttl: config.get<number>('THROTTLER_TTL', 60000), // Domyślnie 60 sekund
          limit: config.get<number>('THROTTLER_LIMIT', 100), // Domyślnie 100 żądań
        },
        {
          // Nazwany limit dla endpointu logowania
          name: 'auth-login',
          ttl: config.get<number>('AUTH_LOGIN_THROTTLER_TTL', 60000), // Domyślnie 60 sekund
          limit: config.get<number>('AUTH_LOGIN_THROTTLER_LIMIT', 10), // Domyślnie 10 żądań
        },
        {
          // Nazwany limit dla endpointu rejestracji
          name: 'auth-register',
          ttl: config.get<number>('AUTH_REGISTER_THROTTLER_TTL', 60000), // Domyślnie 60 sekund
          limit: config.get<number>('AUTH_REGISTER_THROTTLER_LIMIT', 5), // Domyślnie 5 żądań
        },
      ],
    }),
    AuthenticationModule,
    // Dodaj tutaj inne moduły swojej aplikacji
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Zastosuj ThrottlerGuard globalnie
    },
  ],
})
export class AppModule {}
