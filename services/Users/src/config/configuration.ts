export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    database: {
        port: parseInt(process.env.DATABASE_PORT ?? ""),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
    },
});
