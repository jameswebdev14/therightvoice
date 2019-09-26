let express = require('express');
let User = require('../../schemas/users');
let Thread = require('../../schemas/threads');
let Posts = require('../../schemas/Posts');
let bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
let expressJWT = require('express-jwt');
let jwt = require('jsonwebtoken');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');
let fs = require('fs');
let path = require('path');
let multer = require('multer');

app.use(multer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Router Setup
let Router = express.Router();
Router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    next();
});
app.use(expressJWT({
    secret: 'brgi7gj4385ognpei408j'
}).unless({
    path: ['/login', '/register', '/threads', '/posts']
}));

// REGISTER
Router.post('/register', function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.sendStatus(417).end();
        return;
    }
    let username = req.body.username;
    let email = req.body.email;

    User.findOne({
        email: email
    }, function(err, data) {
        if (data) {
            res.send('Email already registered. Already have an acccount?');
        } else {
            User.findOne({
                username: username
            }, function(err, data) {
                if (data) {
                    res.send('Username not available');
                } else {
                    let hashedPassword = bcrypt.hashSync(req.body.password, salt);
                    User.create({
                        username: username,
                        email: email,
                        password: hashedPassword
                    }, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).send(data);
                        }
                    });
                }
            });
        }
    });

});

// LOGIN
Router.post('/login', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.end();
        return;
    }

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) return (err);
        if (!user) return res.status(401).send('Not Found');
        // Check stored password with posted password for match
        if (bcrypt.compareSync(req.body.password, user.password)) {
            // Set active status of user to true
            User.findOneAndUpdate({
                username: req.body.username
            }, {
                $set: {
                    active: true
                }
            }, function(err, data) {
                if (err) return err;
                let token = jwt.sign({
                    user: user
                }, 'brgi7gj4385ognpei408j');
                let me = {
                    'username': user.username,
                    'email': user.email,
                    'userId': user._id,
                    'token': token
                };
                res.status(200).json(me);
            });
        } else {
            res.status(401).send('Invalid Login');
        }
    });
});

// LOGOUT
Router.post('/logout', function(req, res) {
    // Set active status of user to false
    User.findOneAndUpdate({
        username: req.body.username
    }, {
        $set: {
            active: false
        }
    }, function(err, data) {
        if (data) {
            res.status(201).send(data.username);
        }
    });
});

// NEW THREAD
Router.post('/newThread', function(req, res) {
    if (req.body.title) {
        let id = req.body.Id;
        let name = req.body.Name;
        let post = req.body.post;

        // save new thread
        Thread.create({
            title: req.body.title,
            creatorId: id,
            creatorName: name
        }, function(err, data) {
            if (err) {
                res.send('Unknown error');
            }
            if (!data) {
                res.status(401).send('Error creating thread');
            } else {
                // Save first post if provided
                if (post) {
                    Posts.create({
                        threadID: data._id,
                        title: post,
                        posterId: data.creatorId,
                        postedBy: data.creatorName
                    }, function(err, response) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).send(response);
                        }
                    });
                } else {
                    res.send(data);
                }
            }
        });
    } else {
        res.end();
    }
});

// GET ALL THREADS
Router.get('/latestThreads', function(req, res) {
    Thread.find({}, function(err, response) {
        if (err) {
            res.status(401).send('No data');
            return;
        }
        res.json(response);
    }).sort({
        'createdOn': 1
    }).limit(20);
});

// GET ALL POSTS
Router.get('/latestPosts', function(req, response) {
    var posts = [];
    
    response.set({
        'content-type': 'application/json'
    });

    Posts.find({}, function(err, res) {
        if (err) {
            res.status(401).send(err);
        } else {
            for (var i = 0; i < res.length; i++) {
                // read imageUrl to obtain actual image for post
                if (!res[i].image == '') {
                    var image = fs.readFileSync('./public/images/postImages/' + res[i].image);
                    var imageData = new Buffer(image).toString('base64');
                    if (err || !image) {
                        console.log(err);
                        posts[i] = res[i];
                    } else {
                        posts[i] = res[i];
                        posts[i].image = imageData;
                    }
                } else {
                    posts[i] = res[i];
                }

            }
            response.send(posts);
        }
    })

});

// get single thread from post
Router.get('/threadPosts/:id', function(req, response) {
    Posts.find({
        threadID: req.params.id
    }, function(err, res) {
        var posts = [];
        if (err) {
            res.status(401).send(err);
        } else {
            for (var i = 0; i < res.length; i++) {
                // read imageUrl to obtain actual image for post
                if (!res[i].image == '') {
                    var image = fs.readFileSync('./public/images/postImages/' + res[i].image);
                    var imageData = new Buffer(image).toString('base64');
                    if (err || !image) {
                        console.log(err)
                        posts[i] = res[i];
                    } else {
                        posts[i] = res[i];
                        posts[i].image = imageData;
                    }
                } else {
                    posts[i] = res[i];
                }
            }
        }
        response.set({
            'content-type': 'application/json'
        });
        response.send(posts);
    })
});

// get logged in members list
Router.get('/members', function(req, res) {
    User.find({
        active: true
    }, {
        username: 1
    }, function(err, data) {
        if (err) {
            res.status(401).send('No data');
            return;
        }
        res.send(data);
    });
});

// get all members list
Router.get('/allMembers', function(req, res) {
    User.find({}, function(err, data) {
        if (err) {
            res.status(401).send('No data');
            return;
        }
        res.send(data);
    });
});;
// SET UP MULTER

const postImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/postImages/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: postImageStorage,
    limits: {
        fileSize: 10000000
    },
    fileFilter: function(req, file, cb) {
        // allowed file types
        const filetypes = /jpeg|jpg|png|gif|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true)
        } else {
            return cb('error: images or pdf only')
            console.log('Error in filefilter')
        }
    }
}).single('image');
// New post Route
Router.post('/newPost', function(req, res) {
    if (!req.body) {
        res.status(501).send('No data');
        return;
    }
    var postData = {};
    upload(req, res, (err) => {
        if (err) {
            return;
        } else {
            var imageName = '';
            const {
                postedBy,
                posterId,
                postText,
                threadId,
                threadName
            } = req.body;
            if (req.file) {
                imageName = req.file.filename;
            } else {
                imageName = '';
            }
            Posts.create({
                postedBy: postedBy,
                posterId: posterId,
                threadID: threadId,
                threadName: threadName,
                title: postText,
                image: imageName
            }, function(err, post) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (req.file) { 
                        let file = req.file.path;
                        // read image file
                        fs.readFile(file, (err, image) => {
                            if(err) { return; }
                            postData.postedBy = post.postedBy;
                            postData.posterId = post.posterId;
                            postData.threadID = post.threadId;
                            postData.threadName = post.threadName;
                            postData.title = post.title;
                            postData.image = image;
                        })
                    } else {
                        postData.postedBy = post.postedBy;
                        postData.posterId = post.posterId;
                        postData.threadID = post.threadId;
                        postData.threadName = post.threadName;
                        postData.title = post.title;
                        postData.image = null;
                    }
                    res.set({
                        'content-type': 'application/json'
                    });
                    res.json(postData);
                }
            })
        }
    })
});

// Logged in users threads
Router.get('/myThreads/:id', function(req, res) {
    if (req.params.id) {
        Thread.find({
            creatorId: req.params.id
        }, function(err, data) {
            if (err) {
                res.status(500).send('Error retrieving your threads');
            } else {
                res.send(data);
            }
        });
    }
});

// Logged in users posts
Router.get('/myPosts/:id', function(req, res) {
    if (req.params.id) {
        Posts.find({
            posterId: req.params.id
        }, function(err, posts) {
            if (err) {
                res.status(500).send('Error retrieving your posts');
                Posts.find({}, function(err, data) {
                    if (err) {
                        res.status(401).send(err)
                    } else {
                        res.status(201).send(data);
                    }
                })
            } else {
                var myPosts = [];
                for (var i = 0; i < posts.length; i++) {
                    // read imageUrl to obtain actual image for post
                    if (!posts[i].image == '') {
                        var image = fs.readFileSync('./public/images/postImages/' + posts[i].image);
                        var imageData = new Buffer(image).toString('base64');
                        if (err || !image) {
                            myPosts[i] = posts[i];
                        } else {
                            myPosts[i] = posts[i];
                            myPosts[i].image = imageData;
                        }
                    } else {
                        myPosts[i] = posts[i];
                    }
                }
                res.set({
                    "content-type": "application/json"
                });
                res.send(myPosts);
            }
        });
    }
});

// Upvote post
Router.post('/upvote', function(req, res) {
    let id = req.body.id;
    Posts.update({
        _id: id
    }, {
        $inc: {
            likes: 1
        }
    }, function(err, data) {
        if (err) {
            res.status(500).send('Error updating post');
            return;
        } else {
            res.status(201).end();
        }
    });
});

// downvote post
Router.post('/downvote', function(req, res) {
    let id = req.body.id;
    Posts.update({
        _id: id
    }, {
        $inc: {
            dislikes: 1
        }
    }, function(err, data) {
        if (err) {
            res.status(500).send('Error updating post');
            return;
        } else {
            res.status(201).end();
        }
    });
});

Router.get('*', function(req, res) {
    res.send('index.html')
})

module.exports = Router;