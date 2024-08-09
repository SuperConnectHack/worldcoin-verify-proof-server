const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// Use CORS middleware
app.use(cors()); // This will allow all origins by default
// Middleware to parse JSON request bodies
app.use(express.json());

// Proxy endpoint
app.post('/api/verify', async (req, res) => {
    try {
        // Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        const response = await fetch("https://developer.worldcoin.org/api/v2/verify/app_staging_f3a97c0c7a87ffad90737c4cd149a763", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...req.body, action: "verify-for-bigger-transaction" }),
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorResponse = await response.text(); // Read the error response
            return res.status(response.status).json({ error: errorResponse });
        }

        // Parse and return the successful response
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error verifying proof:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});