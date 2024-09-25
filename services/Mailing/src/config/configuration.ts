export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    appUrl: process.env.APP_URL,
    isDebugMode: process.env.DEBUG_MODE === "true",
    sender: {
        name: process.env.SENDER_NAME,
        user: process.env.SENDER_USER,
        port: process.env.SENDER_PORT,
        password: process.env.SENDER_PASSWORD,
        host: process.env.SENDER_HOST,
    },
    pubsub: {
        host: process.env.PUBSUB_HOST,
        port: process.env.PUBSUB_PORT,
    },
});
