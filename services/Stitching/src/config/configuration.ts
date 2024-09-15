export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    subgraphs: {
        users: `http://${process.env.USERS_SERVICE_SUBGRAPH_HOST}/graphql`,
    },
});
