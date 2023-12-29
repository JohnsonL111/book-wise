import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import {Book} from './models/bookModel.js'

const app = express();

// middleware to allow express to parse request payload
app.use(express.json());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('lets go')
})

// Route for save a new book
app.post('/books', async (request, response) => {
    try {
        // validate
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publish year'
            });
        }
        // create book object
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook)

        return response.status(201).send(book);
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// route to get all books from db 
app.get('/books', async (request, response) => {
    try {
        // finds all books that match the criteria in object
        const books = await Book.find({})

        // structure response to return the length and the data
        return response.status(200).json({
            count: books.length,
            data: books
        });

    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

// route to get a book from db by id
app.get('/books/:id', async (request, response) => {
    try {
        const {id} = request.params

        // finds book by id
        const book = await Book.findById(id)

        // structure response to return the length and the data
        return response.status(200).json(book)

    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})




mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });