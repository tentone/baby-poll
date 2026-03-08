
/**
 * Configuration file for the application.
 */
export const Config = {
  // The locale to be used.
  locale: "pt",

  // Colored sperm, if false the sperm will be white.
  coloredSperm: true,

  // Allow a user to vote multiple times.
  multipleVotes: true,

  // Minimum time between votes in seconds.
  timeBetweenVotes: 5,

  // The URL of the API.
  api: {
    // Port of the server.
    port: 80,
  },

  // Path to the database.
  database: 'database.json',
};