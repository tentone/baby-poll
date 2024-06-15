
/**
 * Configuration file for the application.
 */
export const Config = {
  // The locale to be used.
  locale: "pt",
  
  // Minimum time between votes in seconds.
  timeBetweenVotes: 5,

  // Sperm count.
  spermCount: 50,

  // Colored sperm
  coloredSperm: true,

  // Allow a user to vote multiple times.
  multipleVotes: true,

  // The URL of the API.
  api: {
    // Address of the server
    address: "jfpc.net",

    // Port of the server.
    port: 3000,
  },

  // Path to the database.
  database: 'database.json',
};