const express = require('express');
const usersRouter = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

usersRouter.use(bodyParser.json())



/* GET users listing. */
usersRouter
.route('/register')
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

  const {name, userName, email, password, avatar} = req.body
  
  try {
    let user = await User.findOne({email})

    if(user) {
      return res.status(400).json({ errors: [ { msg: 'User already exists' }]})
    }

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
      (err, token) => {
        if(err) throw err;
        res.status(200)
        res.json({token, user})
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
  console.log('req', req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const {email, password} = req.body
  
  try {
    console.log('here')
    console.log(email)
    let user = await User.findOne({email})
    console.log(user)

    if(!user) {
      return res.status(400).json({ errors: [ { msg: 'Invalid email or password' }]})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)

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
        if(err) {
          console.log('this fail')
          throw err;
        }
        console.log(token, user)
        res.status(200)
        res.json({token, user})
        console.log('sent')
      }
    );
  } catch(err){
    console.error(err.message)
    console.log('fail')
    res.status(500).send('Server error')
  }
});

usersRouter
.route('/')
.put(auth, async (req, res, next) => {
  try {
    
    const user = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true })
    
    if (!user) {
      res.status(400)
      res.send({msg: 'User does not exist in the database'})
    }

    if (req.body.password) {
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password, salt);

    user.save();
    }

    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.json(user)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = usersRouter;
