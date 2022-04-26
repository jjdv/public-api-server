import express from 'express';

import generateEndpoints from './lib/generateEndpoints';
import controllers from './controllers';

const app = express();

generateEndpoints(app, controllers);

export default app;
