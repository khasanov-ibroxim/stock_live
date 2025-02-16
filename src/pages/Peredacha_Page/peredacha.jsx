import React, { useState, useEffect } from 'react';
import './peredacha.css';
import PeredachaToday from "./peredacha_sub_page/peredacha_today.jsx";

import {
    england_league, france_league, germany_league, italy_league,
    portugal_league, spain_league, uzbekistan_league
} from "../League_Page/component/leagueList.jsx";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import BackTab from "../../component/backTab/BackTab.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import ball from "../../assets/icons/icons8-football-50.svg";

const Peredacha = () => {
    const [time, setTime] = useState(new Date());
    const [leagues, setLeagues] = useState([]);
    const [activeDate, setActiveDate] = useState(new Date()); // Tanlangan sana
    const {user_id, language} = useParams();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        setLeagues([
            ...uzbekistan_league,
            ...england_league,
            ...spain_league,
            ...portugal_league,
            ...france_league,
            ...germany_league,
            ...italy_league,
        ]);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Asia/Tashkent'
    }).format(time);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Tashkent'
    }).format(time);

    const getSurroundingDays = () => {
        const days = [];
        const weekdayNamesUz = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];
        const weekdayNamesRu = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        // Til noto‘g‘ri bo‘lsa, 'uz' yoki 'ru' ni olish
        const currentLanguage = ['uz', 'ru'].includes(i18n.language) ? i18n.language : 'uz';
        const weekdayNames = currentLanguage === 'uz' ? weekdayNamesUz : weekdayNamesRu;

        for (let i = -4; i <= 4; i++) {
            const date = new Date();
            date.setDate(time.getDate() + i);

            const weekday = weekdayNames[(date.getDay() + 6) % 7];

            days.push({
                label: new Intl.DateTimeFormat('en-US', { // `currentLanguage` o‘rniga 'en-US' ishlatildi
                    day: '2-digit',
                    month: '2-digit'
                }).format(date).replace('/', '.'),
                weekday: weekday,
                value: date
            });
        }
        return days;
    };

    const handleDateChange = (date) => {
        // Vaqtni 00:00 ga o'rnating
        const newDate = new Date(date);
        // newDate.setHours(0, 0, 0, 0);
        setActiveDate(newDate);
    };


    // Hozirgi sana uchun indeksni aniqlash
    const surroundingDays = getSurroundingDays();
    const todayIndex = surroundingDays.findIndex(day => day.value.toDateString() === new Date().toDateString());

    // Endi leagueIds string emas, array holatida
    const leagueIds = leagues.map(league => league.id);


    return (
        <div className="peredacha">
            <div className="peredacha_time">

                <div className="peredacha_time_box">
                    <h1>{formattedTime}</h1>
                    <p>{formattedDate}</p>
                </div>
            </div>
            <div className="peredacha_tabs">

                <Swiper
                    slidesPerView={4.5}      // 5 ta slaydni ko'rsatish
                    spaceBetween={10}      // Slaydlar orasidagi masofa
                    loop={false}           // Slaydlarni qaytadan takrorlamaslik
                    pagination={{ clickable: true }}
                    navigation
                    centeredSlides={true}  // O‘rtaga joylashtirish
                    className="mySwiperPeredacha"
                    initialSlide={todayIndex}   // Hozirgi sanani markazga qo'yamiz
                >
                    {surroundingDays.map((day, index) => (
                        <SwiperSlide
                            key={index}
                            className={`peredacha__tab_item ${activeDate.toDateString() === day.value.toDateString() ? 'active' : ''}`}
                            onClick={() => handleDateChange(day.value)}
                        >
                            {day.weekday}  {/* Hafta kunining qisqa nomi */}
                            <br/>
                            {day.label}  {/* Sana formati: Kun/Oy */}
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

            <div className="peredacha_list">
                {activeDate && <PeredachaToday activeDate={activeDate} leagueList={leagueIds} />}
                {/* Shu yerda boshqa sanalar uchun boshqa komponentlarni ko'rsatish */}
            </div>
        </div>
    );
};

export default Peredacha;