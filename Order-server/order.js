const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle purchase operations
app.post('/purchase', async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        // Step 1: Query the catalog server to check availability
        const { data: book } = await axios.get(`${"http://localhost:4002"}/info/${bookId}`);

        if (!book) {
            return res.status(404).json({ error: 'Book not found in the catalog' });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        // Step 2: Update the catalog with the new quantity
        const updatedStock = book.stock - quantity;
        await axios.put(`${"http://localhost:4002"}/edit/${bookId}`, { stock: updatedStock });

        // Step 3: Respond with success message
        res.json({ message: 'successful' });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Order server is running on port ${PORT}`);
});

