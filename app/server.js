const express = require('express');
const { createClient } = require('redis');
const app = express();
const port = 3000;

const redisHost = process.env.REDIS_HOST || 'localhost';
const client = createClient({ url: `redis://${redisHost}:6379` });

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    if (process.env.REDIS_HOST) {
        await client.connect();
        console.log("Connected to Redis");
    }
})();

const fortunes = [
    "It works on my machine.",
    "Unknown error in line 0.",
    "A commit a day keeps the conflict away.",
    "You are one semicolon away from disaster.",
    "Sudo make me a sandwich.",
    "Deploying on Friday is a path to the heaven."
];

app.get('/', async (req, res) => {
    let count = 0;
    if (client.isOpen) {
        count = await client.incr('visits');
    }
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.send(`
        <html>
        <head>
            <style>
                body { font-family: 'Courier New', monospace; background: #222; color: #0f0; text-align: center; padding-top: 50px; }
                .box { border: 2px solid #0f0; display: inline-block; padding: 20px; box-shadow: 0 0 10px #0f0; }
                h1 { font-size: 20px; }
                h2 { font-size: 30px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>DEV_SOLUTIONS_LTD TERMINAL [Version 3.0]</h1>
                <hr>
                <h2>"${randomFortune}"</h2>
                <p>Fortunes Revealed: ${count}</p>
                <p>Host: ${require('os').hostname()}</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`DevOps Fortune App listening at http://localhost:${port}`);
});