
/**
 * Configuration file for the application.
 */
export const Config = {
  // The locale to be used.
  locale: "pt",
  
  // Minimum time between votes in seconds.
  timeBetweenVotes: 0,

  // Allow a user to vote multiple times.
  multipleVotes: false,

  // The URL of the API.
  api: {
    // Address of the server
    address: "localhost",

    // Port of the server.
    port: 3000,
  },

  // Path to the database.
  database: 'database.json',
};