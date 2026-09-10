const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = 8080;

// Connect to the Redis sidecar via localhost
const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

app.get('/', async (req, res) => {
    if (!client.isOpen) await client.connect();
    
    // Increment a counter in our sidecar
    const visits = await client.incr('visits');
    res.send(`<h1>200 OK!</h1><p>Docker Compose sidecar architecture is live.</p><p>Redis visits: ${visits}</p>`);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Web container listening on port ${port}`);
});
