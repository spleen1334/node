var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var booksSeed = [{
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lav Nikolajevic Tolstoj',
    bookId: 656,
    read: false
}, {
    title: 'Ana Karenjina',
    genre: 'Masterpiece',
    author: 'Lav Nikolajevic Tolstoj',
    read: true
}];

var router = function(nav) {
    adminRouter.route('/addBooks')
        .get(function(req, res) {
            var url = 'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function(err, db) {
                var collection = db.collection('books');
                collection.insertMany(booksSeed, function(err, results) {
                    res.send(results);
                    db.close();
                });
            });
        });

    return adminRouter;
};

module.exports = router;
