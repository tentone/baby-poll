import express from 'express';
import * as fs from 'fs';
import cors from 'cors';
import {Config} from "./src/config.js";

/**
 * Main application class.
 */
class Server {
    constructor(config) {
        this.config = config;

        this.loadData();
    }

    /**
     * Create new data in the database.
     */
    createData() {
        this.data = {
            results: {
                boy: 0,
                girl: 0
            },
            votes: []
        };
        this.saveData();
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
            this.createData();
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
        this.app.use(cors());
        this.app.use(express.json());

        this.app.post('/reset', (req, res) => {
            this.createData();
            res.send();
        });

        this.app.get('/results', (req, res) => {
            res.send(this.data.results);
        });

        this.app.post('/vote', (req, res) => {
            const data = req.body;

            console.log(' - Received a vote.', data, req);

            if (data.vote !== 'boy' && data.vote !== 'girl') {
                res.status(400).send('Invalid vote, must be boy or girl.');
                return;
            }

             
            // Check if the user has voted already.
            if (!this.config.multipleVotes) {
                const hasVoted = this.data.votes.find(vote => vote.clientId === data.clientId);
                if (hasVoted) {
                    res.status(400).send('You have already voted.');
                    return;
                }
            }


            // Update the results.
            this.data.results[data.vote] += 1;

            this.data.votes.push({
                timestamp: new Date().toISOString(),
                vote: data.vote,
                ip: req.ip,
                clientId: data.clientId
            });

            this.saveData();

            res.send();
        });
        
        this.app.listen(this.config.api.port, () => {
            console.log(` - Server running at http://localhost:${this.config.api.port}`);
        });
    }
}


new Server(Config).start();