import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePageFootball from "./pages/Home_Page_Football/homePageFootball.jsx";
import {RouterFootballData} from "./utils/consts.jsx";
import App_bar_football from "./component/App_bar/app_bar_football.jsx";
import LoaderFootball from "./component/loader/loader_football.jsx";


function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const tg = window.Telegram.WebApp;

    useEffect(() => {
        // 2 soniyadan keyin loaderni o'chirish
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        tg.expand();
        tg.headerColor = "#378805";
        tg.bottomBarColor = "#378805";
        tg.isVerticalSwipesEnabled = false;
        tg.isHorizontalSwipesEnabled = false;

        return () => clearTimeout(timer);
    }, [tg]);

    if (isLoading) {
        return <>
            <LoaderFootball />
        </>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {RouterFootballData.map(({Component,Path}, index)=>(
                    <Route key={index} path={Path} element={<><App_bar_football/><Component/></>} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;