import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {LanguageProvider} from "./utils/lang/LangContext.jsx";
import "swiper/css"

createRoot(document.getElementById('root')).render(
    <LanguageProvider>
        <App/>
    </LanguageProvider>,
)
