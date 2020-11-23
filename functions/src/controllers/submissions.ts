import * as express from 'express'
import axios from "axios";
import {EMAILJS_SERVICE_ID, EMAILJS_UID, EMAILJS_SUBMISSION_TEMPLATE_ID} from './secrets'
import {db} from '../db/connection'
import {Submission, SubmissionEmail} from  '../db/models/submission'

const router = express.Router();

// INDEX -- get all submissions assigned to a specific editor
router.get('/editors/:editor_uid', async (req: express.Request, res: express.Response) => {
    try {
        const editorId: string = req.params.editor_uid
        const allSubmissionsForEditor = await db.collection('submissions').where('editor_id', '==', editorId).get()

        const submissionData: Submission[] = []

        allSubmissionsForEditor.forEach((sub: any) => {
            submissionData.push({
                submission_id: sub.id,
                created_at: sub.data().created_at,
                editor_id: sub.data().editor_id,
                writer_id: sub.data().writer_id,
                url: sub.data().url,
                notes: sub.data().notes,
                title: sub.data().title,
                edits_complete: sub.data().edits_complete
            })
        })

        res.status(200).json({status:200, message: "ok", data: submissionData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// INDEX -- get all submissions submitted by a specific writer
router.get('/writers/:writer_uid', async (req: express.Request, res: express.Response) => {
    try {
        const writerId: string = req.params.writer_uid
        const allSubmissionsForWriter = await db.collection('submissions').where('writer_id', '==', writerId).get()

        const submissionData: Submission[] = []

        allSubmissionsForWriter.forEach((sub: any) => {
            submissionData.push({
                submission_id: sub.id,
                created_at: sub.data().created_at,
                editor_id: sub.data().editor_id, 
                writer_id: sub.data().writer_id,
                url: sub.data().url,
                notes: sub.data().notes,
                title: sub.data().title,
                edits_complete: sub.data().edits_complete
            })
        })
        res.status(200).json({status:200, message: "ok", data: submissionData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// CREATE
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        // create a new submission in the database
        const newSubmission: Submission = {
            created_at: req.body.created_at,
			editor_id: req.body.editor_id,
			edits_complete: req.body.edits_complete,
			title: req.body.title,
			notes: req.body.notes,
			url: req.body.url,
			writer_id: req.body.writer_id,
        }
        await db.collection('submissions').add(newSubmission)

        // send email to Editor with submission details
        const newSubmissionEmail: SubmissionEmail = {
            title: newSubmission.title,
            link: newSubmission.url,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            reply_to: req.body.writer_email,
            to_email: req.body.editor_email,
            notes: newSubmission.notes,
        }

        const emailjsConfig = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_SUBMISSION_TEMPLATE_ID,
            user_id: EMAILJS_UID,
            template_params: {
                'reply_to': newSubmissionEmail.reply_to,
                'to_email': newSubmissionEmail.to_email,
                'first_name': newSubmissionEmail.first_name,
                'last_name': newSubmissionEmail.last_name,
                'title': newSubmissionEmail.title,
                'link': newSubmissionEmail.link,
                'notes': newSubmissionEmail.notes
            }
        }

        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsConfig)

        res.status(201).json({status:201, message: "created", data: newSubmission, email: response.data})
    } catch (error) {

        const emailjsConfig = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_SUBMISSION_TEMPLATE_ID,
            user_id: EMAILJS_UID,
            template_params: {
                'reply_to': "newSubmissionEmail.reply_to",
                'to_email': "newSubmissionEmail.to_email",
                'first_name': "newSubmissionEmail.first_name",
                'last_name': "newSubmissionEmail.last_name",
                'title': "newSubmissionEmail.title",
                'link': "newSubmissionEmail.link",
                'notes': "newSubmissionEmail.notes"
            }
        }

        console.log(error)
        res.status(400).json({status: 400, message: error, data: error.message, config: emailjsConfig, stringified: JSON.stringify(emailjsConfig)})
    }
})

// UPDATE 
router.put('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const submissionDocId = req.params.doc_id
        const newSubmissionData = req.body
        const submissionToUpdate = db.doc(`submissions/${submissionDocId}`)
        await submissionToUpdate.update(newSubmissionData)
        res.status(200).json({status: 200, message: `updated submission with doc_id ${submissionDocId}`, data: newSubmissionData})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: error, data: error.message})
    }
})

// DESTROY
router.delete('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const submissionDocId = req.params.doc_id
        const submissionToUpdate = db.doc(`submissions/${submissionDocId}`)
        await submissionToUpdate.delete()
        res.status(200).json({status: 200, message: `deleted submission with doc_id ${submissionDocId}`})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: error, data: error.message})
    }
})

export = router