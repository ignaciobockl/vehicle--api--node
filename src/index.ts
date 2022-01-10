import express from 'express';
import dotenv from 'dotenv';

import indexRoutes from './routes/index';


// dotenv
dotenv.config();

const app = express();
const port = process.env.PORT;


const normalizePort = (val: number | string): number | string | boolean => {
  const normPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(normPort)) {
    return val;
  } else if (normPort >= 0) {
    return normPort;
  } else {
    return false;
  }
};


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));


// routes
app.use( indexRoutes );


app.listen( normalizePort( port || 8000 ) , (): void => {
    console.log('Server on port', port);
});