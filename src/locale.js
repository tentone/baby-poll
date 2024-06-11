import {Config} from "./config";

/**
 * Object with the translations.
 */
export const Locale = {
    pt: {
        "results": "Resultados",
        "vote": "Votar",
        "boy": "Menino",
        "girl": "Menina",
        "boyOrGirl": "Menino ou Menina?",
        "voteSubmitted": "Voto submetido!"
    },
    en: {
        "results": "Results",
        "vote": "Vote",
        "boy": "Boy",
        "girl": "Girl",
        "boyOrGirl": "Boy or Girl?",
        "voteSubmitted": "Vote submitted!"
    }
};

/**
 * Get the locale string.
 * 
 * @param {string} str - The string to be translated. 
 * @returns Translated string.
 */
export const getLocale = (str) => {
    return Locale[Config.locale][str];
}
