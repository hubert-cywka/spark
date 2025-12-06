export const AppConfig = () => ({
    appName: process.env.APP_NAME,
    port: parseInt(process.env.PORT ?? ""),

    throttle: {
        ttl: process.env.RATE_LIMITING_BASE_TTL,
        limit: process.env.RATE_LIMITING_BASE_LIMIT,
    },

    client: {
        url: {
            base: process.env.CLIENT_URL_BASE,
        },
    },

    cookies: {
        secret: process.env.COOKIES_SECRET,
    },

    events: {
        partitioning: {
            numberOfPartitions: process.env.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS,
            staleThresholdInMs: process.env.PUBSUB_PARTITIONS_STALE_THRESHOLD_IN_MS,
        },
        encryption: {
            secret: process.env.EVENTS_ENCRYPTION_SECRET_64_BYTES,
        },
        inbox: {
            processing: {
                clearingInterval: process.env.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL,
                pollingInterval: process.env.PUBSUB_INBOX_PROCESSOR_POLLING_INTERVAL,
                maxBatchSize: process.env.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE,
                maxAttempts: process.env.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS,
            },
            retentionPeriod: process.env.PUBSUB_INBOX_RETENTION_PERIOD_IN_DAYS ?? 210,
        },
        outbox: {
            processing: {
                clearingInterval: process.env.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL,
                pollingInterval: process.env.PUBSUB_OUTBOX_PROCESSOR_POLLING_INTERVAL,
                maxBatchSize: process.env.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE,
                maxAttempts: process.env.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS,
            },
            retentionPeriod: process.env.PUBSUB_OUTBOX_RETENTION_PERIOD_IN_DAYS ?? 180,
        },
    },

    pubsub: {
        brokers: process.env.PUBSUB_BROKERS?.split(","),
        producer: {},
        consumer: {
            concurrentPartitions: process.env.PUBSUB_CONSUMER_CONCURRENT_PARTITIONS,
            maxWaitTimeForBatchInMs: process.env.PUBSUB_CONSUMER_MAX_WAIT_FOR_BATCH_MS,
            maxBytesPerBatch: process.env.PUBSUB_CONSUMER_MAX_BYTES_PER_PATCH,
        },
    },

    auth: {
        jwt: {
            signingSecret: process.env.JWT_SIGNING_SECRET,
            expirationTimeInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_IN_SECONDS ?? ""),
        },
    },

    modules: {
        gdpr: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.GDPR_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        configuration: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.CONFIGURATION_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        scheduling: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.SCHEDULING_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        alerts: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.ALERTS_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        mail: {
            isDebugMode: process.env.MAIL_DEBUG_MODE === "true",
            sender: {
                name: process.env.MAIL_SENDER_NAME,
                password: process.env.MAIL_SENDER_PASSWORD,
            },
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.MAIL_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        users: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.USERS_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        journal: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.JOURNAL_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        identity: {
            twoFactorAuth: {
                encryptionSecret: process.env.TWO_FACTOR_AUTH_ENCRYPTION_SECRET_64_BYTES,
            },
            refreshToken: {
                signingSecret: process.env.REFRESH_TOKEN_SIGNING_SECRET,
                expirationTimeInSeconds: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS ?? ""),
            },
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.AUTH_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
            throttle: {
                ttl: parseInt(process.env.AUTH_THROTTLE_TTL_IN_MS ?? ""),
                limit: parseInt(process.env.AUTH_THROTTLE_LIMIT ?? ""),
            },
            oidc: {
                cookie: {
                    expirationTimeInSeconds: parseInt(process.env.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS ?? ""),
                },
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    redirectUrl: process.env.GOOGLE_OIDC_REDIRECT_URL,
                },
            },
        },
    },
});
