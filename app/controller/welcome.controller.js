import express from 'express';

import {isAuthenticated} from './middleware/permission';
// Assign router to the express.Router() instance
const router = express.Router();

router.get('/info', isAuthenticated, (req, res) => {
  res.send(`Hello, ${JSON.stringify(req.user)}`);
});

export {router};
