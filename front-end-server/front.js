const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Endpoint to handle purchase requests
app.post('/purchase', async (req, res) => {
    try {
        // Extract bookId and quantity from the request body
        const { bookId, quantity } = req.body;

        // Send a request to the catalog server to check availability
        const catalogResponse = await axios.get(`http://localhost:4002/info/${bookId}`);
        const bookInfo = catalogResponse.data;

        // If the book is available, send a request to the order server to make the purchase
        if (bookInfo && bookInfo.stock >= quantity) {
            const orderResponse = await axios.post(`http://localhost:3000/order`, {
                bookId,
                quantity
            });
            const orderResult = orderResponse.data;

            // If the purchase was successful, return success message
            if (orderResult.success) {
                res.status(200).json({ success: true, message: "Purchase successful" });
            } else {
                res.status(400).json({ success: false, message: "Purchase failed" });
            }
        } else {
            // If the book is not available, return error message
            res.status(400).json({ success: false, message: "Book not available or insufficient stock" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend server is running on port ${PORT}`);
});
