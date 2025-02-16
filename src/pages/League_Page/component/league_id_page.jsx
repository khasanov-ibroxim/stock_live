import React, { useEffect, useState } from 'react';
import BackTab from "../../../component/backTab/BackTab.jsx";
import LigaReyting from "./liga_reyting.jsx";
import LigaCalendar from "./liga_calendar.jsx";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

const LeagueIdPage = () => {
    const [activeTab, setActiveTab] = useState('rating'); // Initialize active tab
    const { t } = useTranslation();
    const { league_id,language } = useParams();
    return (
        <div className={"standings_container"}>
            <div className="back_liga">
                <BackTab back_url={`/${language}/league`} />
                <h1>{t('liga.title')}</h1>
            </div>
            <div className="rating_tabs">
                <div
                    className={`rating_tabs_item ${activeTab === 'rating' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rating')}
                >
                    {t("liga.liga_tab_rating")}
                </div>
                <div
                    className={`rating_tabs_item ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    {t("liga.liga_tab_calendar")}
                </div>
            </div>

            {activeTab === "rating" && <LigaReyting liga={league_id}/>}
            {activeTab === "calendar" && <LigaCalendar />}
        </div>
    );
};

export default LeagueIdPage;
