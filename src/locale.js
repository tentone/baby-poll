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
        "voteSubmitted": "Voto submetido!",
        "sending": "A enviar",
        "cannotVote": "Não é possível votar novamente. Aguarde!",
        "errorVoting": "Erro ao votar. Tente novamente.",
        "warning": "Aviso",
        "success": "Sucesso",
        "error": "Erro",
        "noInternet": "Sem ligação à internet."
    },
    en: {
        "results": "Results",
        "vote": "Vote",
        "boy": "Boy",
        "girl": "Girl",
        "boyOrGirl": "Boy or Girl?",
        "voteSubmitted": "Vote submitted!",
        "sending": "Sending",
        "cannotVote": "Cannot vote again. Wait!",
        "errorVoting": "Error voting. Try again.",
        "warning": "Warning",
        "success": "Success",
        "error": "Error",
        "noInternet": "No internet connection."
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
