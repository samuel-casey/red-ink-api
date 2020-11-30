import axios from 'axios';
import * as express from 'express';
const router = express.Router();
import {db} from '../db/connection';
import {Editor} from  '../db/models/editor';
import { mapEditorData } from '../utils/editorHelpers';
import * as functions from 'firebase-functions';

// INDEX
router.get('/', async (_req: express.Request, res: express.Response) => {
    try {
        const editorsResponse = await db.collection('editors').get()
        const editors: Editor[] = []
        editorsResponse.forEach((editor) => {
           mapEditorData(editor, editors)
        })
        res.status(200).json({status: 200, message: "ok", data: editors})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// // SHOW
// uses UID, not doc_id
router.get('/:uid', async (req: express.Request, res: express.Response) => {
    try {
        const editorId = req.params.uid
        const theEditorResponse = await db.collection('editors').where('uid', '==', editorId).get()
        const theEditor: Editor[] = []
        theEditorResponse.forEach((editor) => {
            mapEditorData(editor, theEditor)
        })
        res.status(200).json({status: 200, message: "ok", data: theEditor})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


// CREATE
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const newEditor: Editor = req.body
        await db.collection('editors').add(newEditor)
        res.status(201).json({status: 201, message: "created", data: newEditor})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


// UPDATE
router.put('/:doc_id', async (req: express.Request, res: express.Response) => {
    const newEditorData = req.body // SHOULD NEVER EDIT UID OR EMAIL SINCE THOSE ARE FROM AUTH
    try {
        const editorDocId = req.params.doc_id
        const editorToUpdate = db.doc(`editors/${editorDocId}`)
        await editorToUpdate.update(newEditorData)
        res.status(200).json({status: 200, message: `updated editor with doc_id ${editorDocId}`, data: newEditorData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// SEND A REMINDER EMAIL TO THE EDITOR USING EMAILJS
router.put('/remind/:uid', async (req: express.Request, res: express.Response) => {
    const newEditorData = req.body // SHOULD NEVER EDIT UID OR EMAIL SINCE THOSE ARE FROM AUTH
    try {
        const editorUid = req.params.uid
        const title = newEditorData.title
        const link = newEditorData.link
        const created_at = newEditorData.createdAt
        const editorName = newEditorData.editorName

        const foundEditor = await db.collection('editors').where('uid', '==', editorUid).get()

        const editorToNotify : Editor[] = []

        foundEditor.forEach((editor) => mapEditorData(editor, editorToNotify))

        // combine body data (link and title), and writerEmail
        const reminderEmailParams = {
            'to_email': editorToNotify[0].email,
            'title': title,
            'to_name': editorName,
            'created_at': created_at,
            'link': link
        }

        const emailjsEditorReminderConfig = {
            service_id: functions.config().editor_reminders.service_id,
            template_id: functions.config().editor_reminders.editor_reminder_template_id,
            user_id: functions.config().editor_reminders.uid,
            template_params: {...reminderEmailParams}
        }
        
        // send reminder email to editor from red.ink.reminders@gmail.com
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsEditorReminderConfig)

        res.status(200).json({status: 200, message: `reminder email sent to editor`})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// // DESTROY
router.delete('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const editorDocId = req.params.doc_id
        const editorToDelete = db.doc(`editors/${editorDocId}`)
        await editorToDelete.delete()
        res.status(200).json({status: 200, message: `deleted editor with doc_id ${editorDocId}`})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


export = router