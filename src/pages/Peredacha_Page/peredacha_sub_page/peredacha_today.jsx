import React, { useEffect, useState } from 'react';
import { Collapse_Stock } from "../../../component/collapse/collapse_stock.jsx";
import ball from "../../../assets/icons/icons8-football-50.svg";
import { useTranslation } from "react-i18next";
import { FootballStore } from "../../../store/footballStore/footballStore.jsx";

const PeredashaToday = ({ activeDate, leagueList }) => {
    const { t } = useTranslation();
    const { Football_today_games, today_games, isLoading } = FootballStore();
    const [imageCache, setImageCache] = useState({});

    useEffect(() => {
        Football_today_games(activeDate);
        const intervalId = setInterval(() => {
            Football_today_games(activeDate);
        }, 900000); // 15 daqiqa
        return () => clearInterval(intervalId);
    }, [activeDate, leagueList.length]);

    const loadImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.src);
            img.onerror = () => {
                setTimeout(() => {
                    img.src = url;
                }, 2000);
                resolve(ball);
            };
            img.src = url;
        });
    };

    useEffect(() => {
        const fetchImages = async () => {
            const newCache = {};
            for (const game of today_games) {
                if (game.teams.home.logo) {
                    newCache[game.teams.home.logo] = await loadImage(game.teams.home.logo);
                }
                if (game.teams.away.logo) {
                    newCache[game.teams.away.logo] = await loadImage(game.teams.away.logo);
                }
            }
            setImageCache(prevCache => ({ ...prevCache, ...newCache }));
        };

        fetchImages();
    }, [today_games]);

    const items = today_games.map((game, index) => ({
        key: index.toString(),
        label: (
            <div className="table-row" key={index}>
                <div className="team1">
                    <h1>{game.teams.home.name}</h1>
                    <img loading="lazy" src={imageCache[game.teams.home.logo] || ball} alt={game.teams.home.name} />
                </div>
                <p>
                    {game.fixture.date >= new Date().toISOString() ? (
                        <div style={{ width: "50px" }}>
                            {new Intl.DateTimeFormat('en-US', {
                                timeZone: 'Asia/Tashkent',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }).format(new Date(game.fixture.date))}
                            <br />
                        </div>
                    ) : (
                        <div style={{ width: "50px" }}>
                            {game.goals.home} - {game.goals.away}
                        </div>
                    )}
                </p>
                <div className="team2">
                    <img loading="lazy" src={imageCache[game.teams.away.logo] || ball} alt={game.teams.away.name} />
                    <h1>{game.teams.away.name}</h1>
                </div>
            </div>
        ),
        children: (
            <div>
                <p style={{ display: 'flex', alignItems: "center" }}>
                    {t('peredacha.liga')} : {game.league.name}
                    <img src={game.league.flag} width={25} style={{ marginLeft: "10px" }} alt="" />
                </p>
                <p>{t('peredacha.hisob')} : {game.goals.home} - {game.goals.away}</p>
                <p>{t('peredacha.oyin_vaqti')} : {new Date(game.fixture.date).toLocaleDateString()}</p>
            </div>
        ),
    }));

    return (
        <div className="peredacha_list_items">
            {isLoading ? (
                <p style={{ textAlign: 'center' }}>{t("loading")}</p>
            ) : (
                today_games.length > 0 ? (
                    <Collapse_Stock items={items} />
                ) : (
                    <p style={{ textAlign: 'center' }}>{t("no_data")}</p>
                )
            )}
        </div>
    );
};

export default PeredashaToday;
