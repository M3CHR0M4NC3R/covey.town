import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import fs from 'fs/promises';
import { Server as SocketServer } from 'socket.io';
import Song from './models/song';
import { RegisterRoutes } from '../generated/routes';
import TownsStore from './lib/TownsStore';
import { ClientToServerEvents, ServerToClientEvents } from './types/CoveyTownSocket';
import { TownsController } from './town/TownsController';
import { logError } from './Utils';

// Create the server instances
const app = Express();
app.use(CORS());
const server = http.createServer(app);
const socketServer = new SocketServer<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: '*' },
});

// Initialize the towns store with a factory that creates a broadcast emitter for a town
TownsStore.initializeTownsStore((townID: string) => socketServer.to(townID));

// Connect the socket server to the TownsController. We use here the same pattern as tsoa
// (the library that we use for REST), which creates a new controller instance for each request
socketServer.on('connection', socket => {
  new TownsController().joinTown(socket);
});

// Set the default content-type to JSON
app.use(Express.json());

// Add a /docs endpoint that will display swagger auto-generated documentation
app.use('/docs', swaggerUi.serve, async (_req: Express.Request, res: Express.Response) => {
  const swaggerSpec = await fs.readFile('../shared/generated/swagger.json', 'utf-8');
  return res.send(swaggerUi.generateHTML(JSON.parse(swaggerSpec)));
});

// Register the TownsController routes with the express server
RegisterRoutes(app);

// Add a middleware for Express to handle errors
app.use(
  (
    err: unknown,
    _req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ): Express.Response | void => {
    if (err instanceof ValidateError) {
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      logError(err);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    return next();
  },
);

// Connect to mongo db
const DB_URL: string = process.env.MONGO_DB_URL || '';
mongoose
  .connect(DB_URL)
  .then(result => {
    // Listen for mongodb on port 4000
    // eslint-disable-next-line no-console
    const port = process.env.MONGO_DB_PORT;
    app.listen(port);
    // eslint-disable-next-line no-console
    console.log('Connected to Mongo DB on port', port);
  })
  .then(result => {
    // Start the configured server, defaulting to port 8081 if $PORT is not set
    server.listen(process.env.PORT || 8081, () => {
      const address = server.address() as AddressInfo;
      // eslint-disable-next-line no-console
      console.log(`Listening on ${address.port}`);
      if (process.env.DEMO_TOWN_ID) {
        TownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
      }
    });
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to mongo db:');
    // eslint-disable-next-line no-console
    console.log(err);
  });

// // Start the configured server, defaulting to port 8081 if $PORT is not set
// server.listen(process.env.PORT || 8081, () => {
//   const address = server.address() as AddressInfo;
//   // eslint-disable-next-line no-console
//   console.log(`Listening on ${address.port}`);
//   if (process.env.DEMO_TOWN_ID) {
//     TownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
//   }
// });

// mongoose and mongo sandbox routes
app.get('/add-song', (req, res) => {
  const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];
  const fakeNotes0 = [
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
    { note: notes[0], playNote: false },
  ];
  const fakeNotes1 = [
    { note: notes[1], playNote: true },
    { note: notes[1], playNote: true },
    { note: notes[1], playNote: true },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
    { note: notes[1], playNote: false },
  ];
  const fakeNotes2 = [
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
    { note: notes[2], playNote: false },
  ];
  const fakeNotes3 = [
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
    { note: notes[3], playNote: false },
  ];
  const fakeNotes4 = [
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
    { note: notes[4], playNote: false },
  ];
  const fakeNotes5 = [
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
    { note: notes[5], playNote: false },
  ];
  const fakeNotes6 = [
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
    { note: notes[5], playNote: true },
  ];
  const fakeSong0 = {
    title: 'Song title 0 (3words) - Lorem, ipsum dolor.6',
    creator: 'WWahr4TzizNmctFb-fW5F',
    description: 'Lorem, ipsum dolor.',
    likes: 6,
    likedUsers: ['user1', 'user2'],
    notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes6],
  };
  const song = new Song(fakeSong0);
  song
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/all-songs', (req, res) => {
  Song.find()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
});
