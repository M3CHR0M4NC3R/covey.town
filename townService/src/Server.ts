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
import { logError, isSongValid, isSongNotesEmpty } from './Utils';

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

// Middleware to reveal url encoded data on the response objects for Mongo db.
app.use(Express.urlencoded({ extended: true }));

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

// mongoose and mongo sandbox routes
app.post('/add-song', (req, res) => {
  const thisSong = req.body;

  // Check if this song follows the correct song format
  const isValid = isSongValid(thisSong);
  let isCreator: boolean | null = null;
  let isInDB: boolean | null = null;
  if (!isValid) {
    res.send({ isSuccessful: false, status: 'Invalid song format' });
    return;
  }

  const isEmpty = isSongNotesEmpty(thisSong);
  if (isEmpty === true) {
    res.send({ isSuccessful: false, status: 'Song notes are empty' });
    return;
  }

  // Check if song title exists in database
  Song.findOne({ title: thisSong.title })
    .then(result => {
      if (result != null) {
        isInDB = true;
      }
      if (result?.creator === thisSong.creator) {
        isCreator = true;
      } else {
        isCreator = false;
      }
    })
    .then(result => {
      // Check if song should be put into database
      if (isInDB === true && isCreator === true) {
        // Update entry: edit the entry in database
        Song.updateOne({ title: thisSong.title }, { $set: thisSong })
          .then(resul => {
            res.send({ isSuccessful: true, status: 'Song Updated!' });
          })
          .catch(error => {
            res.send({ isSuccessful: false, status: 'Error updating song' });
          });
      } else if (isInDB === null) {
        // New Entry: add the entry to the database
        const song = new Song(thisSong);
        song
          .save()
          .then(resu => {
            res.send({ isSuccessful: true, status: 'Song Saved!' });
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
            res.send({ isSuccessful: false, status: 'Error saving song' });
          });
      } else if (isInDB === true) {
        res.send({ isSuccessful: false, status: 'Song already exists in the DB' });
      } else {
        res.send({ isSuccessful: false, status: 'Song not added' });
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      res.send({ isSuccessful: false, status: 'Error adding song to DB' });
    });
});

app.post('/like-song', (req, res) => {
  const thisSong = req.body;
  const username = thisSong.thisPlayer;

  // Check if this song follows the correct song format
  if (username === null || thisSong.title === null || thisSong.title.length === 0) {
    res.send({ isSuccessful: false, status: 'Invalid song format' });
    return;
  }

  // Check if user exists in the likedUsers array, if not add them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let songData: any = null;
  Song.findOne({ title: thisSong.title })
    .then(result => {
      if (result === null) {
        res.send({ isSuccessful: false, status: 'Song does not exist in DB' });
      } else {
        songData = result;
      }
    })
    .then(result => {
      const newSong = songData;
      // Check if the user already liked this song, if so return
      if (songData && songData.likedUsers.includes(username)) {
        res.send({ isSuccessful: false, status: 'You already liked this song!' });
        return;
      }
      if (!songData) {
        res.send({ isSuccessful: false, status: 'Error liking song: Song data is null' });
        return;
      }
      if (newSong) {
        newSong.likedUsers.push(username);
        newSong.likes = newSong.likedUsers.length;
      }

      // Update entry: edit the entry in database
      Song.updateOne({ title: thisSong.title }, { $set: newSong })
        .then(resul => {
          res.send({ isSuccessful: true, status: 'Song Liked!' });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
          res.send({ isSuccessful: false, status: 'Error liking song' });
        });
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      res.send({ isSuccessful: false, status: 'Error liking song in DB' });
    });
});

app.get('/all-songs', (req, res) => {
  Song.find()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
});
