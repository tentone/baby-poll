# Baby Poll
 - Simple app for a gender reveal poll
 - Composed of client and server components
 - The client is a [Vue.js](https://vuejs.org/) app and the server is built with Node.js and [Express](https://expressjs.com/)

<img src="./readme/results.png" width="300">
<img src="./readme/vote.png" width="300">

## Usage
 - Install [node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
 - Clone the repository
 - Run `npm install` in the project directory
 - To run the client app, run `npm run start` 
 - To run the server, run `npm run server`

## Configuration
 - The server is configured to run on port 3000 and client to run on port 80 by default.
 - Change the file `src/config.js` to change the server address.

```javascript
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
```
## License
 - The project is distributed under [MIT](https://opensource.org/licenses/MIT), available in the LICENSE file
