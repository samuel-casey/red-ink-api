import * as express from 'express'
import axios from "axios";
import {db} from '../db/connection'
import * as functions from 'firebase-functions'
import {mapSubmissionData} from '../utils/submissionHelpers'
import {Submission, SubmissionEmail} from  '../db/models/submission'

const router = express.Router();

// INDEX -- get all submissions assigned to a specific editor
router.get('/editors/:editor_uid', async (req: express.Request, res: express.Response) => {
    try {
        const editorId: string = req.params.editor_uid
        const allSubmissionsForEditor = await db.collection('submissions').where('editor_id', '==', editorId).get()

        const submissionData: Submission[] = []

        allSubmissionsForEditor.forEach((sub: any) => {
           mapSubmissionData(sub, submissionData) 
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
           mapSubmissionData(sub, submissionData)
        })
        res.status(200).json({status:200, message: "ok", data: submissionData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})  

// SHOW -- get a single submission by its document id
router.get('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        // MdKigbdbcsaTCoddQ7sf

        const submissionId: string = req.params.doc_id
        const singleSubmission = await db.collection('submissions').doc(submissionId).get()

        res.status(200).json({status:200, message: "ok", data: singleSubmission.data()})
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
			edits_status: req.body.edits_status,
			title: req.body.title,
			notes: req.body.notes,
			url: req.body.url,
            writer_id: req.body.writer_id,
            editor_reminded: false,
            writer_notified: false,
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

        // config for red.ink.edit.submissions@gmail.com account
        const emailjsEditorSubmissionConfig = {
            service_id: functions.config().editor_submissions.service_id,
            template_id: functions.config().editor_submissions.submission_template_id,
            user_id: functions.config().editor_submissions.uid,
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

        // send an email to the editor when they've had an assignment submitted
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailjsEditorSubmissionConfig)

        res.status(201).json({status:201, message: "created", data: newSubmission, email: response.data})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: error, data: error.message})
    }
})

// UPDATE 
router.put('/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const submissionDocId = req.params.doc_id
        const newSubmissionData = req.body

        const submissionToUpdate = db.doc(`submissions/${submissionDocId}`)
     
        // if user attempted to update status of document, update document status, else update the document's editor_notified field
        newSubmissionData.type === 'status' ? (
            await submissionToUpdate.update({edits_status: newSubmissionData.edits_status})
            ) : (
                await submissionToUpdate.update({writer_notified: newSubmissionData.writer_notified})
                )
    
        res.status(200).json({status: 200, message: `updated submission with doc_id ${submissionDocId}`, data: newSubmissionData})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: 400, message: error, data: error.message})
    }
})


// RESET DEMO WRITER'S SUBMISSIONS EACH TIME DEMO BUTTON IS CLICKED
router.put('/writers/demo/:demo_writer_id', async (req: express.Request, res: express.Response) => {
    try {
        const demoWriterId = req.params.demo_writer_id

        const batch = db.batch()
        
        // seed data for demo writer
           const demoDocs: Submission[] = [{
                    created_at: 'Sat, 28 Nov 2020 19:08:49 GMT',
                    title: "An Analysis of Plato's Writing Style",
                    url: 'https://docs.google.com/document/d/1wBZ7M1KHr3LfPmD54pWn_CEvwJKuoHBj74snZ2HnzH0/edit?usp=sharing',
                    writer_id: demoWriterId,
                    editor_id: 'yffuTH7TrSQ3WwaKnZ0MBLdS06I3',
                    notes: 'none',
                    editor_reminded: false,
                    edits_status: 'awaiting',
                    writer_notified: false
                
            },{
                    created_at: 'Fri, 27 Nov 2020 19:08:49 GMT',
                    title: 'Law School Essays',
                    url: 'https://docs.google.com/document/d/1y42s1YMImtn95S3prud19GWgy5g6Gs43QY5gmPN10nQ/edit?usp=sharing',
                    writer_id: demoWriterId,
                    editor_id: 'yffuTH7TrSQ3WwaKnZ0MBLdS06I3',
                    notes: 'none',
                    editor_reminded: false,
                    edits_status: 'complete',
                    writer_notified: false
                },{
                    created_at: 'Tue, 24 Nov 2020 19:08:49 GMT',
                    title: 'The Impact of Diet on Early Childhood Education',
                    url: 'https://docs.google.com/document/d/1hsmHd6NKupw4H8sOzPf2Ybz1MFThMpvO4wJNgSUflDM/edit?usp=sharing',
                    writer_id: demoWriterId,
                    editor_id: 'yffuTH7TrSQ3WwaKnZ0MBLdS06I3',
                    notes: 'none',
                    editor_reminded: false,
                    edits_status: 'ongoing',
                    writer_notified: false
                }, {
                    created_at: 'Sat, 21 Nov 2020 19:08:49 GMT',
                    title: 'Friendship in Seven Short Stories',
                    url: 'https://docs.google.com/document/d/1--R5h6iGmOYTPFtMQkQJFTpYsMasdWTmH0yEUhJT-MM/edit?usp=sharing',
                    writer_id: demoWriterId,
                    editor_id: 'yffuTH7TrSQ3WwaKnZ0MBLdS06I3',
                    notes: 'none',
                    editor_reminded: false,
                    edits_status: 'complete',
                    writer_notified: false
                }]
        
        // create a new submission for each demoDoc and add it to the submissions collection
        demoDocs.forEach((doc) => {
            const newSubmission = db.collection('submissions').doc()
            batch.set(newSubmission, doc)
        })

        await batch.commit()

        res.status(200).json({status: 200, message: "reset demo writer data"})

    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message})
    }
})

// UPDATE EDITOR_REMINDED STATUS FOR A DOC IN SUBMISSIONS COLLECTION
router.put('/reminders/:doc_id', async (req: express.Request, res: express.Response) => {
    try {
        const submissionDocId = req.params.doc_id
        const newReminderStatus = req.body.editor_reminded

        const submissionToUpdate = db.doc(`submissions/${submissionDocId}`)

        await submissionToUpdate.update({editor_reminded: newReminderStatus})

        res.status(200).json({status: 200, message: "reminder changed in db"})
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