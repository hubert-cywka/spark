import axios from "axios";

export const apiClient = axios.create({
    // Hubert: This can be parametrized with env variables, but is it necessary? Not in the development phase, certainly.
    baseURL: process.env.NEXT_PUBLIC_API_URL?.concat("/api"),
    withCredentials: true,
    adapter: "fetch",
});
