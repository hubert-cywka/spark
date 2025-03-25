import axios from "axios";

export const apiClient = axios.create({
    // Hubert: This can be parametrized with env variables, but is it necessary? Not in the development phase, certainly.
    baseURL: "/api",
    withCredentials: true,
    adapter: "fetch",
    headers: {
        "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
});
