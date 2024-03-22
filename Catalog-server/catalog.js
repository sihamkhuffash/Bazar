
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4002;


let books = [
    { id: 1, title: "How to get a good grade in DOS in 40 minutes a day", topic: "distributed systems", num: 10, price: 20 },
    { id: 2, title: "RPCs for Noobs", topic: "distributed systems", num: 5, price: 25 },
    { id: 3, title: "Xen and the Art of Surviving Undergraduate School", topic: "undergraduate school", num: 8, price: 30 },
    { id: 4, title: "Cooking for the Impatient Undergrad", topic: "undergraduate school", num: 12, price: 15 }
];

app.use(bodyParser.json());

// I make an array of books match the book topic I want to search .
app.get('/search/:topic', (req, res) => {
    const topic = req.params.topic;
    const matchingBooks = books.filter(book => book.topic === topic);
    res.json(matchingBooks);
});


app.get('/info/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(book => book.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});


app.put('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { num, price } = req.body;

    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        if (num !== undefined) {
            books[bookIndex].num = num;
        }
        if (price !== undefined) {
            books[bookIndex].price = price;
        }
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});


app.listen(PORT, () => {
    console.log(`Catalog server is running on port ${PORT}`);
});
