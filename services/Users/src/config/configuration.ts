export default () => ({
    port: +process.env.PORT,
    database: {
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
    },
});
