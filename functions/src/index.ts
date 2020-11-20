import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors'
import * as writersController from './controllers/writers'



// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// const db = admin.initializeApp().firestore()
const app = express()
app.use(express.json())
app.use(cors())

// controllers
app.use('/writers', writersController)
// app.use('/editors', editorsController)
// app.use('/submissions', submissionsController)

// returns json
app.get('/', (_req: express.Request, res: express.Response) => {
    res.send("red ink api -- documentation can be found at https://github.com/samuel-casey/red-ink-api")
})

exports.app = functions.https.onRequest(app);
