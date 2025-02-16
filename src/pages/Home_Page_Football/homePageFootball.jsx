import React, {useEffect, useRef, useState} from 'react';
import ball from "../../assets/icons/icons8-football-50.svg";
import {Collapse_Stock} from "../../component/collapse/collapse_stock.jsx";
import "./footballHomePage.css"
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import BackTab from "../../component/backTab/BackTab.jsx";
import {Tour} from "antd";
import App_bar_football from "../../component/App_bar/app_bar_football.jsx";
import {FootballStore} from "../../store/footballStore/footballStore.jsx";

const HomePageFootball = () => {
    const [loading, setLoading] = useState(false); // Loading holatini qo'shish
    const [openTour, setOpenTour] = useState(false);
    const {user_id, language} = useParams();
    const {t} = useTranslation()
    const {Football_live, liveGames} = FootballStore()

    useEffect(() => {
        Football_live();
        const intervalId = setInterval(() => {
            Football_live();
        }, 300000);
        return () => clearInterval(intervalId);
    }, []);

    const formatToTashkentTime = (dateString) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hour12: false,
        }).format(new Date(dateString));
    };
    useEffect(() => {
        const isTourShown = localStorage.getItem('tourShownLive');
        const tourShownFootball = localStorage.getItem('tourShownFootball');

        if (tourShownFootball && !isTourShown) {
            setOpenTour(true);
            localStorage.setItem('tourShownLive', 'true');
        }
    }, []);


    const items = liveGames.map((game, index) => {
        const goals = game.events?.filter(event => event.type === 'Goal') || [];
        return {
            key: index.toString(), label: (<div className="table-row">
                <div className="team1">
                    <h1>{game.teams.home.name}</h1>
                    <img loading={"lazy"} src={game.teams.home.logo || ball} alt={game.teams.home.name}/>
                </div>
                <p>
                    {formatToTashkentTime(game.fixture.date) === formatToTashkentTime(game.fixture.date) ? <>{game.goals.home} - {game.goals.away}</> : <> {formatToTashkentTime(game.fixture.date)}</>}</p>
                <div className="team2">
                    <img loading={"lazy"} src={game?.teams?.away?.logo ? game?.teams?.away?.logo : ball}
                         alt={game.teams.away.name}/>
                    <h1>{game.teams.away.name}</h1>
                </div>
            </div>), children: (<div>
                <p>{t('peredacha.liga')} : {game.league.name}</p>
                <p>{t('peredacha.hisob')} : {game.goals.home} - {game.goals.away}</p>
                <p>{t('peredacha.oyin_vaqti')} : {new Date(game.fixture.date).toLocaleDateString()} {formatToTashkentTime(game.fixture.date)}</p>
                <p><strong>Goals:</strong></p>
                <ul>
                    {goals.length > 0 ? (goals.map((goal, idx) => (<li key={idx}>
                        {goal.player.name} ({goal.team.name}) - {goal.time.elapsed}'
                    </li>))) : (<li>{t('live.goals')}</li>)}
                </ul>
            </div>),
        };
    });

    const liveRef = useRef(null);
    const liveButtonRef = useRef(null);
    const stepsTour = [{
        title: t("tour_fotballLive.live_button.title"),
        description: t("tour_fotballLive.live_button.description"),
        target: () => liveButtonRef.current,
    }, {
        title: t("tour_fotballLive.live.title"),
        description: t("tour_fotballLive.live.description"),
        target: () => liveRef.current,
    },]
    return (<div className={"homePageFootball"} style={{marginTop:"30px"}}>
        <h1 className={"footballTitle"}>
            <App_bar_football/>
            <div className={"jonliEfir"} ref={liveButtonRef}>{t('live.live')}
                <div className="livenow">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </h1>

        <div className={"footballContent"} ref={liveRef}>
            {loading ? <p style={{textAlign: 'center'}}>{t("loading")}</p> : (liveGames.length > 0 ?
                <Collapse_Stock items={items}/> : <p style={{textAlign: 'center'}}>{t("no_data")}</p>)}
        </div>
        <Tour
            open={openTour}
            steps={stepsTour}
            closeIcon={false}
            onClose={() => setOpenTour(false)}
        />
    </div>);
};

export default HomePageFootball;
