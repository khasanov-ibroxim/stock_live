import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ball from "../../../assets/icons/icons8-football-50.svg";
import { Collapse_stock_leg } from "./collapse/collapse_stock_leg.jsx";
import {FootballStore} from "../../../store/footballStore/footballStore.jsx";

const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

const LigaCalendar = () => {
    const [loadingFixtures, setLoadingFixtures] = useState(false);
    const [loadingImages, setLoadingImages] = useState({});
    const { t } = useTranslation();
    const { league_id } = useParams();
    const {CalendarLeagueById , calendar_league} = FootballStore()


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const monthIndex = date.getMonth();
        const month = monthNames[monthIndex];
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return <>{day}-{month}  {hour}:{minute}</>;
    };


    const retryImage = (event) => {
        setTimeout(() => {
            event.target.src = event.target.src;
        }, 2000);
    };

    const handleImageLoadStart = (key) => {
        setLoadingImages(prev => ({ ...prev, [key]: true }));
    };

    const handleImageLoadEnd = (key) => {
        setLoadingImages(prev => ({ ...prev, [key]: false }));
    };


    const upcomingFixtures = calendar_league.filter(game => new Date(game.fixture.date) > new Date());
    console.log(upcomingFixtures);

    const collapseItem = upcomingFixtures.map((game, index) => ({
        key: index,
        label: (
            <div className="table-row">
                <div className="team1">
                    <h1>{game.teams.home.name}</h1>
                    {loadingImages[`${game.teams.home.logo}-${index}`] && <div className="image-loader">Loading...</div>}
                    <img
                        loading={"lazy"}
                        src={game.teams.home.logo || ball}
                        alt={game.teams.home.name}
                        onError={retryImage}
                        onLoad={() => handleImageLoadEnd(`${game.teams.home.logo}-${index}`)}
                        onLoadStart={() => handleImageLoadStart(`${game.teams.home.logo}-${index}`)}
                    />
                </div>
                <p style={game.goals.home !== null && game.goals.away !== null ? { marginTop: "25px" } : {}}>
                    <span>
                        {game.goals.home !== null && game.goals.away !== null &&
                            <> {game.goals.home} : {game.goals.away} </>}
                    </span>
                    <span style={{ fontSize: "12px" }}>{formatDate(game.fixture.date)}</span>
                </p>
                <div className="team2">
                    {loadingImages[`${game.teams.away.logo}-${index}`] && <div className="image-loader">Loading...</div>}
                    <img
                        loading={"lazy"}
                        src={game.teams.away.logo || ball}
                        alt={game.teams.away.name}
                        onError={retryImage}
                        onLoad={() => handleImageLoadEnd(`${game.teams.away.logo}-${index}`)}
                        onLoadStart={() => handleImageLoadStart(`${game.teams.away.logo}-${index}`)}
                    />
                    <h1>{game.teams.away.name}</h1>
                </div>
            </div>
        ),
        children: (
            <div className="league_collapseChildren">
                <div className="league_collapseChildren_box">
                    <div className="league_collapseChildren_item">
                        <div className="league_collapseChildren_item_logo">
                            <h1>{t("liga.home")}</h1>
                            {loadingImages[`${game.teams.home.logo}-${index}`] &&
                                <div className="image-loader">Loading...</div>}
                            <img
                                loading={"lazy"}
                                src={game.teams.home.logo || ball}
                                alt={game.teams.home.name}
                                onError={retryImage}
                                onLoad={() => handleImageLoadEnd(`${game.teams.home.logo}-${index}`)}
                                onLoadStart={() => handleImageLoadStart(`${game.teams.home.logo}-${index}`)}
                            />
                        </div>

                    </div>
                    <div className="league_collapseChildren_item">
                        <div className="league_collapseChildren_item_logo">
                            {loadingImages[`${game.teams.away.logo}-${index}`] &&
                                <div className="image-loader">Loading...</div>}
                            <h1>{t("liga.away")}</h1>
                            <img
                                loading={"lazy"}
                                src={game.teams.away.logo || ball}
                                alt={game.teams.away.name}
                                onError={retryImage}
                                onLoad={() => handleImageLoadEnd(`${game.teams.away.logo}-${index}`)}
                                onLoadStart={() => handleImageLoadStart(`${game.teams.away.logo}-${index}`)}
                            />
                        </div>

                    </div>
                </div>
                <div className="info_calendar">{formatDate(game.fixture.date)}</div>
            </div>
        ),
    }));

    useEffect(() => {
        CalendarLeagueById(league_id);
    }, [league_id]);

    return (
        <>
            <div className="league_data_calendar">
                {loadingFixtures ? (
                    <p style={{ textAlign: 'center' }}>{t("loading")}</p>
                ) : upcomingFixtures.length > 0 ? (
                    <div className="fixtures_calendar">
                        <Collapse_stock_leg items={collapseItem} />
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>{t("no_data")}</p>
                )}
            </div>
        </>
    );
};

export default LigaCalendar;
