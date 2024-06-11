/**
 * Object with the translations.
 */
export const Locale = {
    pt: {
        "results": "Resultados",
        "vote": "Votar",
        "boy": "Menino",
        "girl": "Menina",

    },
    en: {
        "results": "Results",
        "vote": "Vote",
        "boy": "Boy",
        "girl": "Girl"
    }
};

/**
 * The current locale.
 */
let currentLocale = "en";

/**
 * Get the locale string.
 * 
 * @param {string} str - The string to be translated. 
 * @returns Translated string.
 */
export const getLocale = (str) => {
    return Locale[currentLocale][str];
}
