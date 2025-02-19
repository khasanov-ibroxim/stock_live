import League_id_page from "../pages/League_Page/component/league_id_page.jsx";
import League from "../pages/League_Page/league.jsx";
import Peredacha from "../pages/Peredacha_Page/peredacha.jsx";
import HomePageFootball from "../pages/Home_Page_Football/homePageFootball.jsx";

export const HOME_PAGE_FOOTBALL = "/:language/live";
export const PEREDACHA = "/:language/";
export const LEAGUE = "/:language/league";
export const LEAGUE_ID_PAGE = "/:language/league/:league_id";


export const RouterFootballData = [
    { Path: HOME_PAGE_FOOTBALL, Component: HomePageFootball },
    { Path: PEREDACHA, Component: Peredacha },
    { Path: LEAGUE, Component: League },
    { Path: LEAGUE_ID_PAGE, Component: League_id_page },
];