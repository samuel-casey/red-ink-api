import * as express from 'express'
const router = express.Router();
import {db} from '../db/connection'
import {Writer} from  '../db/models/writer'
import {Submission} from '../db/models/submission'
import {mapSubmissionData} from '../utils/submissionHelpers'
import {EMAILJS_WRITER_SERVICE_ID, EMAILJS_WRITER_NOTIFICATION_TEMPLATE_ID, EMAILJS_WRITER_UID} from './secrets'
import axios from 'axios';


// INDEX
router.get('/', async (_req: express.Request, res: express.Response) => {
    try {
        const writersResponse = await db.collection('writers').get()
        const writers: Writer[] = []
        writersResponse.forEach((writer) => {
            const writerData = {doc_id: writer.id, uid: writer.data().uid, email: writer.data().email, about_me: writer.data().about_me}
            writers.push(writerData)
        })
        res.status(200).json({status: 200, message: "ok", data: writers})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// SHOW
// uses UID, not doc_id
router.get('/:uid', async (req: express.Request, res: express.Response) => {
    try {
        const writerId = req.params.uid
        const writerData = await db.collection('writers').where('uid', '==', writerId).get()
        const theWriter: Writer[] = []
        writerData.forEach((writer) => {
            theWriter.push({doc_id: writer.id, uid: writer.data().uid, email: writer.data().email, about_me: writer.data().about_me})
        })
        res.status(200).json({status: 200, message: "ok", data: theWriter})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// SEND EMAIL TO WRITER WITH COMPOUND QUERY
router.put('/notify/:uid', async (req: express.Request, res: express.Response) => {
    try {
        const writerId = req.params.uid
        const writerData = await db.collection('writers').where('uid', '==', writerId).get()
        const writerToNotify: Writer[] = []
        writerData.forEach((writer) => {
            writerToNotify.push({doc_id: writer.id, uid: writer.data().uid, email: writer.data().email, about_me: writer.data().about_me})
        })

        const writerToNotifyId = writerToNotify[0].uid

        const updatedLink: string = req.body.updatedLink
        const updatedTitle: string = req.body.updatedTitle

        // get document to send notification about -- need to fetch writer email
        const docs = await db.collection('submissions').where('writer_id', '==', writerToNotifyId).where('url', '==', updatedLink).where('title', '==', updatedTitle).get()

        const writerDocs: Submission[] = []
        docs.forEach((doc: any) => mapSubmissionData(doc, writerDocs))

        // combine body data (link and title), and writerEmail
        const notificationEmailParams = {
            'to_email': writerToNotify[0].email,
            'title': writerDocs[0].title,
            'link': writerDocs[0].url
        }

        const emailjsWriterNotificationConfig = {
            service_id: EMAILJS_WRITER_SERVICE_ID,
            template_id: EMAILJS_WRITER_NOTIFICATION_TEMPLATE_ID,
            user_id: EMAILJS_WRITER_UID,
            template_params: {...notificationEmailParams}
        }
        
        // send notification email to writer from red.ink.edit.updates@gmail.com
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsWriterNotificationConfig)

        res.status(200).json({status: 200, message: "ok", data: notificationEmailParams})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


// CREATE
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const newWriter: Writer = req.body // SHOULD NEVER EDIT UID OR EMAIL SINCE THOSE ARE FROM AUTH
        await db.collection('writers').add(newWriter)
        res.status(201).json({status: 201, message: "created", data: newWriter})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


// UPDATE
router.put('/:doc_id', async (req: express.Request, res: express.Response) => {
    const newWriterData = req.body
    try {
        const writerDocId = req.params.doc_id
        const writerToUpdate = db.doc(`writers/${writerDocId}`)
        await writerToUpdate.update(newWriterData)
        res.status(200).json({status: 200, message: `updated writer with doc_id ${writerDocId}`, data: newWriterData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


// DESTROY
router.delete('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const writerDocId = req.params.doc_id
        const writerToDelete = db.doc(`writers/${writerDocId}`)
        await writerToDelete.delete()
        res.status(200).json({status: 200, message: `deleted writer with doc_id ${writerDocId}`})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})


export = router