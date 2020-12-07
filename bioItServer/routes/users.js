const express = require('express');
const usersRouter = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator')

usersRouter.use(bodyParser.json())



/* GET users listing. */
usersRouter
.route('/')
.post([
  check('name', 'Name is required').not().isEmpty(),
  check('userName', 'User Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const {name, userName, email, password} = req.body
  
  try {
    let user = await User.findOne({email})

    if(user) {
      return res.status(400).json({ errors: [ { msg: 'User already exists' }]})
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    user = new User({
      name,
      email,
      userName,
      avatar,
      password
    })

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save()

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: '365d'},
      (err, token) => {
        if(err) throw err;
        res.json({token})
      }
    );
  } catch(err){
    console.error(err.message)
    res.status(500).send('Server error')
  }
});

usersRouter
.route('/login')
.post([
  // check('userName', 'User Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required')
    .exists()
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const {email, password} = req.body
  
  try {
    let user = await User.findOne({email})

    if(!user) {
      return res.status(400).json({ errors: [ { msg: 'Invalid email or password' }]})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({ errors: [ { msg: 'Invalid email or password' }]})
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      (err, token) => {
        if(err) throw err;
        res.json({token, user})
      }
    );
  } catch(err){
    console.error(err.message)
    res.status(500).send('Server error')
  }
});

module.exports = usersRouter;
