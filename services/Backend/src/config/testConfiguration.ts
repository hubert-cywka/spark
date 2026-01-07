export const TestConfig = () => ({
    appName: process.env.APP_NAME,
    port: parseInt(process.env.PORT ?? ""),

    client: {
        url: {
            base: process.env.CLIENT_URL_BASE,
        },
    },

    cookies: {
        secret: "cookies-secret-for-tests",
    },

    events: {
        partitioning: {
            numberOfPartitions: process.env.PUBSUB_PARTITIONS_NUM_OF_PARTITIONS,
            staleThresholdInMs: 30_000,
        },
        encryption: {
            secret: "aaabbbaaabbdaacaaceaaaaeaaabeaaaaaaaaacaafaaaaaaaaaddaaacbbbdaaa",
        },
        inbox: {
            processing: {
                clearingInterval: process.env.PUBSUB_INBOX_PROCESSOR_CLEARING_INTERVAL,
                pollingInterval: 5000,
                maxBatchSize: process.env.PUBSUB_INBOX_PROCESSOR_MAX_BATCH_SIZE,
                maxAttempts: process.env.PUBSUB_INBOX_PROCESSOR_MAX_ATTEMPTS,
            },
            retentionPeriod: 1,
        },
        outbox: {
            processing: {
                clearingInterval: process.env.PUBSUB_OUTBOX_PROCESSOR_CLEARING_INTERVAL,
                pollingInterval: 5000,
                maxBatchSize: process.env.PUBSUB_OUTBOX_PROCESSOR_MAX_BATCH_SIZE,
                maxAttempts: process.env.PUBSUB_OUTBOX_PROCESSOR_MAX_ATTEMPTS,
            },
            retentionPeriod: 1,
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
            signingSecret: "jwt-signing-secret",
            expirationTimeInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_IN_SECONDS ?? ""),
        },
    },

    gateway: {
        internalUrl: process.env.GATEWAY_INTERNAL_URL,
    },

    s3: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        buckets: {
            exports: {
                name: process.env.S3_EXPORTS_BUCKET_NAME,
            },
        },
    },

    modules: {
        privacy: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.PRIVACY_DATABASE_NAME,
            },
            cache: {
                connectionString: process.env.CACHE_CONNECTION_STRING,
            },
        },

        exports: {
            database: {
                logging: process.env.DATABASE_LOGGING_ENABLED === "true",
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.EXPORTS_DATABASE_NAME,
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
            refreshToken: {
                signingSecret: "refresh-token-signing-secret",
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
        },
    },
});
