import { createContext, useContext, useState, useEffect } from "react";
import i18n from "./i18n.jsx";

const LangContext = createContext();

const LanguageProvider = ({ children }) => {
    const validLanguages = ["rus", "uz"]; // Faqat "rus" va "uz" tillarini ruxsat beramiz

    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        // URL'dagi tilni olish
        const pathParts = window.location.pathname.split("/").filter(Boolean); // Bo'sh elementlarni olib tashlaymiz
        const urlLanguage = pathParts[0]; // 1-qism til bo'ladi: /rus/

        return validLanguages.includes(urlLanguage) ? urlLanguage : "uz"; // Default: uz
    });

    useEffect(() => {
        // URL'dagi tilni doimiy kuzatamiz
        const checkLanguageInURL = () => {
            const pathParts = window.location.pathname.split("/").filter(Boolean);
            const urlLanguage = pathParts[0];

            if (validLanguages.includes(urlLanguage) && urlLanguage !== selectedLanguage) {
                setSelectedLanguage(urlLanguage);
            }
        };

        // Sahifa yuklanganda yoki URL o'zgarganda tilni tekshiramiz
        checkLanguageInURL();

        // Popstate event listener qo'shamiz (orqaga-oldinga bosilganda ishlaydi)
        window.addEventListener("popstate", checkLanguageInURL);

        return () => {
            window.removeEventListener("popstate", checkLanguageInURL);
        };
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage]);

    const handleLanguageChange = (languageCode) => {
        if (validLanguages.includes(languageCode)) {
            setSelectedLanguage(languageCode);
            i18n.changeLanguage(languageCode);

            // Yangi URL tuzamiz: /rus/ yoki /uz/
            const newUrl = `/${languageCode}/`;

            // URL'ni yangilaymiz va sahifani qayta yuklaymiz
            window.history.replaceState(null, "", newUrl);
            window.location.reload(); // Sahifani yangilash
        }
    };

    return (
        <LangContext.Provider
            value={{
                selectedLanguage,
                handleLanguageChange,
            }}
        >
            {children}
        </LangContext.Provider>
    );
};

function useLanguage() {
    const context = useContext(LangContext);

    if (context === undefined) {
        throw new Error("Language context was used outside of LangProvider");
    }

    return context;
}

export { LanguageProvider, useLanguage };
