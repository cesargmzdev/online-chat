import { Users } from '##/db/models.js';
import jwt from 'jsonwebtoken';
import process from 'node:process';

const requests = (app) => {
  app.post('/signup', async (req, res) => {
    if (!req.body.username || !req.body.password) {
      res.status(500).json({ message: 'Username and password are required!' });
      return;
    }
    const userAlreadyExists = await Users.findOne({
      username: req.body.username
    });
    if (userAlreadyExists) return res.status(409).json({ message: 'User already exists!' });
    const new_user = new Users({
      username: req.body.username,
      password: req.body.password
    });
    new_user.save();
    res.status(200).json({ message: 'User registered successfully!', user: new_user });
  });

  app.post('/findUser', async (req, res) => {
    const findUser = await Users.findOne({ username: req.body.username });
    if (findUser) {
      res.json({ message: 'User found!', username: findUser });
    } else {
      res.json({ error: 'User not found!' });
    }
  });

  app.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
      res.status(500).json({ error: 'Username and password are required!' });
      return;
    }
    try {
      const userRegistered = await Users.findOne({
        username: req.body.username,
        password: req.body.password
      });
      if (userRegistered) {
        const token = jwt.sign({ username: req.body.username }, process.env.JWT_SECRET_KEY);
        const userWithoutPassword = {
          username: userRegistered.username
        };
        res.json({
          message: 'User logged in successfully!',
          userWithoutPassword,
          token
        });
      } else {
        res.json({ error: 'Invalid username or password' });
      }
    } catch (e) {
      res.json({ error: e });
    }
  });

  app.get('/getUser', (req, res) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ user: username });
        }
      });
    } else {
      res.json({ error: 'Token not provided' });
    }
  });
};

export default requests;
