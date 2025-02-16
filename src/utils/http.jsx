import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const $API = axios.create({
    baseURL: "https://api-football-v1.p.rapidapi.com/v3",
    headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
});

export default $API;
