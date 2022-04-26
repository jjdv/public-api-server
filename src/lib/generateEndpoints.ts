import { Express } from 'express';
// import cors from 'cors';

import { Controllers } from '../controllers/Controller';
import getSanitizedImplementedMethods from './getSanitizedImplementedMethods';
import makeMethodNotAllowedHandler from './makeMethodNotAllowedHandler';

export default function generateEndpoints(
  app: Express,
  controllers: Controllers,
) {
  Object.entries(controllers).forEach(
    ([apiPath, { allowOrigin, methods, handlers }]) => {
      const path = `/${apiPath}`;

      methods.forEach(method => {
        switch (method) {
          case 'GET':
            app.get(path, handlers[method]);
            break;
          case 'POST':
            app.post(path, handlers[method]);
            break;
          case 'PUT':
            app.put(path, handlers[method]);
            break;
          case 'PATCH':
            app.patch(path, handlers[method]);
            break;
          case 'DELETE':
            app.delete(path, handlers[method]);
            break;
          default:
        }
      });

      const sanitizedImplementedMethods =
        getSanitizedImplementedMethods(methods);

      /* cors has problem with types in this kind of use
      const corsOptions: cors.CorsOptions = {
        origin,
        methods: sanitizedImplementedMethods,
      };
      app.options(path, cors(corsOptions)); */
      // the solution alternative to cors applied below
      app.options(path, (req, res) => {
        res.set({
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': sanitizedImplementedMethods,
        });
        res.sendStatus(204);
      });

      app.all(path, makeMethodNotAllowedHandler(sanitizedImplementedMethods));
    },
  );
}
