import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import arrowRight from "../../assets/icon/arrowRight.png"
import "./component/league_component.css"

import {useTranslation} from "react-i18next";
import {FootballStore} from "../../store/footballStore/footballStore.jsx";

const League = () => {
    const {user_id, language} = useParams();
    const {t} = useTranslation();
    const {allLeagues} = FootballStore()
    return (
        <div className={"league-container"}>
            <div className="back_liga">
                <h1 style={{marginLeft:10}}>{t('liga.title')}</h1>
            </div>
            <div className="league_box">
                <div className="league_box_container">
                    {allLeagues?.map((league, index) => (<Link key={index} className="league_item"
                                                            to={`/${language}/league/${league.id}`}>
                        <div className="league_item_left">
                            <img src={league.logo} alt=""/>
                            <h1>{league.name}</h1>
                        </div>
                        <div className="league_item_right">
                            <img src={arrowRight} alt=""/>
                        </div>
                    </Link>))}
                </div>

            </div>
        </div>
    );
};

export default League;
