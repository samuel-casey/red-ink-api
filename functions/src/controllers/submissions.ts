import * as express from 'express'
const router = express.Router();
import {db} from '../db/connection'
import {Submission} from  '../db/models/submission'

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
        const newSubmission: Submission = req.body
        await db.collection('submissions').add(newSubmission)
        res.status(201).json({status:201, message: "created", data: newSubmission})
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