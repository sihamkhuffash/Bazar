const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;



app.use(bodyParser.json());

// Endpoint to handle purchase operations
app.post('/purchase', async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

       
        const { data: book } = await axios.get(`${"http://localhost:4002"}/info/${bookId}`);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ error: 'Error' });
        }

        // Step 2: Update the catalog with the new quantity
        const updatedStock = book.stock - quantity;
        await axios.put(`${"http://localhost:4002"}/edit/${bookId}`, { stock: updatedStock });

        
        res.json({ message: 'successful' });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Order server is running on port ${PORT}`);
});

