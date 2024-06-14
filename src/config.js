
/**
 * Configuration file for the application.
 */
export const Config = {
  // The locale to be used.
  locale: "pt",
  
  // Time between votes in seconds.
  timeBetweenVotes: 5,

  // Allow a user to vote multiple times.
  multipleVotes: true,

  // The URL of the API.
  api: {
    // URL of the API
    address: "jfpc.net",

    // Port of the server.
    port: 3000,
  },

  // Path to the database.
  database: 'database.json',
};