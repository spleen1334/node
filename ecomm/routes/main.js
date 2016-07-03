var router = require('express').Router();
var User = require('../model/user');
var Product = require('../model/product');
var Cart = require('../model/cart');

var async = require('async');

var stripe = require('stripe')('SECRETKEY');

// Elastic Search
// Connect db to ES
Product.createMapping(function(err, mapping) {
    if(err) {
        console.log('Error creating mapping (Elastic Search)');
        console.log(err);
    } else {
        console.log('Mapping created (Elastic Search)');
        console.log(mapping);
    }
});

// Sync with ES
var stream = Product.synchronize();
var count = 0;

stream.on('data', function() {
    count++;
});
stream.on('close', function() {
    console.log('Indexed ' + count + ' documents');
});
stream.on('error', function(err) {
    console.log(err);
});

// Cart index
router.get('/cart', function(req, res, next) {
    Cart.findOne({ owner: req.user._id })
        .populate('imtes.item')
        .exec(function(err, foundCart) {
            if(err) return next(err);
            res.render('main/cart', {
                foundCart: foundCart,
                message: req.flash('remove')
            });
        });
});

// Update cart
router.post('/product/:product_id', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        cart.save(function(err) {
            if(err) return next(err);
            return res.redirect('/cart');
        });
    });
});

// Remove from cart
router.post('/remove', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
        foundCart.items.pull(String(req.body.item));

        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
        foundCart.save(function(err, found) {
            if(err) return next(err);

            req.flash('remove', 'Successfully removed');
            res.redirect('/cart');
        });
});
});

// Elastic Search Routes
router.post('/search', function(req, res, next) {
    res.redirect('/search?q=' + req.body.q);
});

// Pagination
function paginate(req, res, next) {
    var perPage = 9;
    var page = req.params.page;

    Product
        .find()
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if(err) return next(err);

                res.render('main/product-main', {
                    products: products,
                    pages: count / perPage
                });
            });
        });
}

router.get('/search', function(req, res, next) {
    if(req.query.q) {
        Product.search({
            query_string: { query: req.query.q }
        }, function(err, results) {
            if(err) return next(err);

            var data = results.hits.hits.map(function(hit) {
                return hit;
            });

            res.render('main/search-result', {
                query: req.query.q,
                data: data
            });
        });
    }
});


// HOME
router.get('/', function(req, res, next) {
    // Check if logged in
    if(req.user) {
        paginate(req, res, next);
    } else {
        res.render('main/home');
    }
});

// Pagination
router.get('/page/:page', function(req, res, next) {
    paginate(req, res, next);
});

router.get('/about', function(req, res) {
    res.render('main/about');
});

// Product category view
router.get('/products/:id', function(req, res, next) {
    Product
        .find({ category: req.params.id })
        .populate('category')
        .exec(function(err, products) {
            if(err) return next(err);

            res.render('main/category', { products: products });
        });
});

// Product detail view
require.get('/product/:id', function(req, res, next) {
    Product.findById({ _id: req.params.id }, function(err, product) {
        if(err) return next(err);

        res.render('main/product', { product: product });
    });
});

// PAYMENT
router.post('/payment', function(req, res, next) {
    var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100); // Price is in cent by default

    stripe.customers.create({
        source: stripeToken,
    }).then(function(customer) {
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        });
    }).tehn(function(charge) {
        async.waterfall([
            function(callback) {
                Cart.findOne({ owner: req.user._id }, function(err, cart) {
                    callback(err, cart);
                });
            },
            function(cart, callback) {
                User.findOne({ _id: req.user._id }, function(err, user) {
                    if(user) {
                        for(var i=0; i<cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price
                            });
                        }
                    }
                    user.save(function(err, user) {
                        if(err) return next(err);
                        callback(err, user);
                    });
                });
            }, function(user) {
                Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
                    if(updated) {
                        res.redirect('/profile');
                    }
                });
            }
        ]);
    });

    res.redirect('/profile');
});

module.exports = router;
