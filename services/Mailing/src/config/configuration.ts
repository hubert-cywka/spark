export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    isDebugMode: process.env.DEBUG_MODE === "true",
    sender: {
        email: process.env.SENDER_EMAIL,
        password: parseInt(process.env.SENDER_PASSWORD ?? ""),
    },
    pubsub: {
        host: process.env.PUBSUB_HOST,
        port: parseInt(process.env.PUBSUB_PORT ?? ""),
    },
});
