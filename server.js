import express from 'express';
import * as fs from 'fs';

/**
 * Main application class.
 */
class Server {
    constructor(config) {
        this.config = config;

        this.loadData();
    }

    /**
     * Load data from the database.
     */
    loadData() {
        if (fs.existsSync(this.config.database)) {
            console.log(' - Database file exists, reading data.');
            this.data = JSON.parse(fs.readFileSync(this.config.database));
        } else {
            console.log(' - Database file does not exist, creating new data.');
            this.data = {
                results: {
                    boy: 0,
                    girl: 0
                },
                votes: []
            };
            this.saveData();
        }
    }

    /**
     * Save data to the database.
     */
    saveData() {
        console.log(' - Saving data to the database.')
        fs.writeFileSync(this.config.database, JSON.stringify(this.data));
    }

    /**
     * Start the server.
     */
    start() {
        console.log(' - Starting server with config ', this.config);

        this.app = express();

        this.app.use(express.static('.'));

        this.app.get('/results', (req, res) => {
            res.send(this.data.results);
        });

        this.app.post('/vote', (req, res) => {
            console.log(req);

            console.log(' - Received a vote.');
            // this.data.results[req.query] += 1;

        });
        
        this.app.listen(this.config.port, () => {
            console.log(` - Server running at http://localhost:${this.config.port}`);
        });
    }
}


new Server({
    port: 3000,
    database: 'database.json'
}).start();