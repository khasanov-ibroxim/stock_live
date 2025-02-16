import {create} from "zustand";
import {
    uzbekistan_league,
    england_league,
    france_league,
    germany_league,
    italy_league,
    spain_league,
    portugal_league
} from "../../pages/League_Page/component/leagueList.jsx";
import axios from "axios";
import $API from "../../utils/http.jsx";

// API kalitni tekshiramiz
const apiKey = import.meta.env.VITE_API_KEY;
const uzbekistanTeamId = 1568;
if (!apiKey) {
    console.error("API kaliti mavjud emas! Iltimos, .env faylini tekshiring.");
}

const initialState = {
    isLoading: false,
    liveGames: [],
    today_games: [],
    standings: [],
    calendar_league: [],
    allLeagues: [
        ...uzbekistan_league,
        ...england_league,
        ...france_league,
        ...germany_league,
        ...italy_league,
        ...spain_league,
        ...portugal_league,
    ],
};

export const FootballStore = create((set, get) => ({
    ...initialState,
    Football_live: async () => {
        set((state) => ({...state, isLoading: true}));
        try {
            const res = await $API.get("/fixtures",
                {
                    params: {live: "all"},
                }
            );

            if (res.data && res.data.response) {
                const filteredLiveGames = res.data.response.filter((game) =>
                    get().allLeagues.some((league) => league.id === game.league.id)
                );

                set((state) => ({
                    ...state,
                    liveGames: filteredLiveGames,
                    isLoading: false, // Yuklanish tugadi
                }));
            } else {
                console.warn("API dan kutilmagan javob keldi:", res.data);
                set((state) => ({...state, isLoading: false}));
            }
        } catch (error) {
            console.error("Xatolik yuz berdi:", error);
            set((state) => ({...state, isLoading: false}));
        }
    },
    Football_today_games: async (activeDate) => {
        set((state) => ({...state, isLoading: true}));

        try {
            const res = await $API.get("/fixtures", {
                params: {
                    date: new Date(new Date(activeDate).setHours(24, 0, 0, 0)).toISOString().split("T")[0],
                },
            });

            const allLeagues = Array.isArray(get().allLeagues)
                ? get().allLeagues.map(league => Number(league.id)) // Har bir obyektning id sini olish
                : [];

            console.log("All League IDs:", allLeagues);

            // Ligalar va O‘zbekiston jamoalariga ko‘ra filter qilish
            const filteredGames = res?.data?.response.filter((game) => {
                const leagueId = Number(game.league.id); // API'dan kelayotgan liga ID sini Number qilish
                return (
                    allLeagues.includes(leagueId) ||
                    game.teams.home.id === uzbekistanTeamId ||
                    game.teams.away.id === uzbekistanTeamId
                );
            });

            console.log("Filtered Games:", filteredGames);

            set((state) => ({
                ...state,
                today_games: filteredGames,
                isLoading: false,
            }));
        } catch (error) {
            console.log("API Error:", error);
            set((state) => ({...state, isLoading: false}));
        }
    },

    RatingById: async (league_id) => {
        try {
            const currentYear = new Date().getFullYear();
            const previousYear = currentYear - 1;

            // Hozirgi va o'tgan yil uchun so‘rov yuborish
            const [currentRes, previousRes] = await Promise.all([
                $API.get("/standings", { params: { league: league_id, season: currentYear } }),
                $API.get("/standings", { params: { league: league_id, season: previousYear } }),
            ]);

            // API javoblarini olish
            const currentStandings = currentRes?.data?.response?.[0]?.league?.standings?.[0] || [];
            const previousStandings = previousRes?.data?.response?.[0]?.league?.standings?.[0] || [];

            // Hamma ma'lumotlarni birlashtirib, id bo‘yicha faqat yangisini olish
            const standingsMap = new Map();
            [...previousStandings, ...currentStandings].forEach((team) => {
                standingsMap.set(team.team.id, team);
            });

            const standings = Array.from(standingsMap.values());

            console.log("Final Standings:", standings);

            set((state) => ({
                ...state,
                standings, // Barcha yangilangan ma'lumotlar
            }));
        } catch (e) {
            console.log("API Error:", e);
        }
    },

    CalendarLeagueById: async (league_id) => {
        try {
            const currentYear = new Date().getFullYear();
            const previousYear = currentYear - 1;

            // Hozirgi va o'tgan yil uchun so‘rov yuborish
            const [currentRes, previousRes] = await Promise.all([
                $API.get("/fixtures", { params: { league: league_id, season: currentYear } }),
                $API.get("/fixtures", { params: { league: league_id, season: previousYear } }),
            ]);

            // API javoblarini olish
            const currentFixtures = currentRes?.data?.response || [];
            const previousFixtures = previousRes?.data?.response || [];

            // Hamma o‘yinlarni birlashtirib, id bo‘yicha faqat yangisini olish
            const fixturesMap = new Map();
            [...previousFixtures, ...currentFixtures].forEach((match) => {
                fixturesMap.set(match.fixture.id, match);
            });

            const fixtures = Array.from(fixturesMap.values());

            console.log("Final Fixtures:", fixtures);

            set((state) => ({
                ...state,
                calendar_league: fixtures, // Yangilangan barcha ma'lumotlar
            }));
        } catch (error) {
            console.log("API Error:", error);
            set((state) => ({
                ...state,
                calendar_league: [], // Xatolik bo‘lsa, bo‘sh array
            }));
        }
    },

}));
