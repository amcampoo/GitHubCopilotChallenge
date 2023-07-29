//Create web server
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Connect to database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    timestamp: String
});

// Create a model
const Comment = mongoose.model('Comment', commentSchema);

// Use public folder
app.use(express.static('public'));

// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Use ejs
app.set('view engine', 'ejs');

// GET route for home page
app.get('/', (req, res) => {
    // Get comments from database
    Comment.find({}, (err, comments) => {
        if (err) {
            console.log(err);
        } else {
            // Render page with comments
            res.render('home', { comments: comments });
        }
    });
});

// POST route for home page
app.post('/', (req, res) => {
    // Create new comment
    const newComment = new Comment({
        name: req.body.name,
        comment: req.body.comment,
        timestamp: new Date().toLocaleString()
    });
    // Save comment to database
    newComment.save((err) => {
        if (err) {
            console.log(err);
        } else {
            // Redirect to home page
            res.redirect('/');
        }
    });
});

// Listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
