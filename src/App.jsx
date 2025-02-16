import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePageFootball from "./pages/Home_Page_Football/homePageFootball.jsx";
import {RouterFootballData} from "./utils/consts.jsx";
import App_bar_football from "./component/App_bar/app_bar_football.jsx";


function App(props) {
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