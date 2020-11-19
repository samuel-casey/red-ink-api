import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors'
import * as fruitsController from './controllers/fruits'



// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const db = admin.initializeApp().firestore()
const app = express()
app.use(express.json())
app.use(cors())

// router
app.use('/fruits', fruitsController)

// returns json
app.get('/', (_req: express.Request, res: express.Response) => {
    res.send("hello world")
})

interface Editor {
    email: string,
    uid: string
}

app.get('/editors', async (_req: express.Request, res: express.Response) => {
    try {
        const editorsCollection = await db.collection('editors').get()
        const allEditors: Editor[] = []
        editorsCollection.forEach((editor) => {
            allEditors.push({uid: editor.data().uid, email: editor.data().email})
        })
        res.status(200).json(allEditors)
    } catch (error) {
        console.log(error)
    }
})

// returns new thing from body -- does not save to db
app.post('/editors', async (req: express.Request, res: express.Response) => {
    try {
        const newEditor: Editor = req.body
        await db.collection('editors').add(newEditor)
        res.status(200).json(newEditor) 
    } catch (error) {
        console.log(error)
    }
})

interface Submission {
    sub_id: string;
    editor_id: string; 
    writer_id: string;
    url: string;
    title: string;
    edits_complete: boolean;
}


// get all submissions assigned to a specific editor
app.get('/submissions/:editor_id', async (req: express.Request, res: express.Response) => {
    try {
        const editorId: string = req.params.editor_id
        const allSubmissionsForEditor = await db.collection('submissions').where('editor_id', '==', editorId).get()

        const submissionData: Submission[] = []

        allSubmissionsForEditor.forEach((sub: any) => {
            submissionData.push({
                sub_id: sub.id,
                editor_id: sub.data().editor_id, 
                writer_id: sub.data().writer_id,
                url: sub.data().url,
                title: sub.data().title,
                edits_complete: sub.data().edits_complete
            })
        })

        res.status(200).json(allSubmissionsForEditor)
    } catch (error) {
        console.log(error)
    }
})

// to change an editor's email
app.put('/editors', async (req: express.Request, res: express.Response) => {
    try {
        const newEditor: Editor = req.body
        await db.collection('editors')
    }
})

exports.app = functions.https.onRequest(app);
