const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Middleware
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Register GET
router.get('/register', (req, res) => {
  res.render('register');
});

// Register POST
// Register POST
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    // Send back to register page with error message
    return res.render('register', { error: 'Username already exists!' });
  }

  // If not exists, proceed with registration
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, role });
  await user.save();
  res.redirect('/login');
});


// Login GET
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { id: user._id, role: user.role, username: user.username };

    if (user.role === 'student') return res.redirect('/student/home');
    if (user.role === 'mentor') return res.redirect('/mentor/home');
    if (user.role === 'admin') return res.redirect('/admin/home');
  } else {
    res.send("Invalid username or password");
  }
});

// Dashboards
router.get('/student/home', isLoggedIn, (req, res) => {
  if (req.session.user.role === 'student') res.render('studentHome', { user: req.session.user });
  else res.send("Access Denied");
});

router.get('/mentor/home', isLoggedIn, (req, res) => {
  if (req.session.user.role === 'mentor') res.render('mentorHome', { user: req.session.user });
  else res.send("Access Denied");
});

router.get('/admin/home', isLoggedIn, (req, res) => {
  if (req.session.user.role === 'admin') res.render('adminHome', { user: req.session.user });
  else res.send("Access Denied");
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
