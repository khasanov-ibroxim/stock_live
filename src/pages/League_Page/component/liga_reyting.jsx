import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {FootballStore} from "../../../store/footballStore/footballStore.jsx";

const LigaReyting = () => {
    const { league_id } = useParams();
    const { t } = useTranslation();
    const [loadingStandings, setLoadingStandings] = useState(false);
    const [loadingImages, setLoadingImages] = useState({});
    const {RatingById , standings , isLoading} = FootballStore()



    const retryImage = (event) => {
        setTimeout(() => {
            event.target.src = event.target.src; // Retry loading the image
        }, 2000);
    };

    const handleImageLoadStart = (key) => {
        setLoadingImages(prev => ({ ...prev, [key]: true }));
    };

    const handleImageLoadEnd = (key) => {
        setLoadingImages(prev => ({ ...prev, [key]: false }));
    };

    useEffect(() => {
        RatingById(league_id);
    }, [league_id]);

    return (
        <>
            {loadingStandings ? (
                <p style={{textAlign: 'center'}}>{t("loading")}</p>
            ) : standings.length > 0 ? (
                <div className="standings">
                    <div className="container">
                        <table className={"table_standing"}>
                            <thead>
                            <tr>
                                <th></th>
                                <th style={{textAlign: 'left'}}>{t("liga.jamoa")}</th>
                                <th>{t("liga.oyin")}</th>
                                <th>{t("liga.ochko")}</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GF</th>
                            </tr>
                            </thead>
                            <tbody>
                            {standings.map((team, index) => (
                                <tr key={team.team.id}>
                                    <td style={{textAlign: 'center'}}>{index + 1}</td>
                                    <td style={{textAlign: 'left'}}>
                                        <img
                                            src={team.team.logo}
                                            alt={team.team.name}
                                            width="30"
                                            height="30"
                                            onError={retryImage}
                                            onLoadStart={() => handleImageLoadStart(team.team.id)}
                                            onLoad={() => handleImageLoadEnd(team.team.id)}
                                        />
                                        {team.team.name}
                                    </td>
                                    <td style={{textAlign: 'center'}}>{team.all.played}</td>
                                    <td style={{textAlign: 'center'}}>{team.points}</td>
                                    <td style={{textAlign: 'center'}}> {team.all.win}</td>
                                    <td style={{textAlign: 'center'}}> {team.all.draw}</td>
                                    <td style={{textAlign: 'center'}}> {team.all.lose}</td>
                                    <td style={{textAlign: 'center'}}> {team.all.goals.for}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            ) : (
                <p style={{textAlign: 'center'}}>{t("no_data")}</p>
            )}
        </>
    );
};

export default LigaReyting;