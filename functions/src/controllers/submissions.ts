import * as express from 'express'
const router = express.Router();
import * as db from '../db/connection'
import {Submission} from  '../db/models/submission'

// INDEX -- get all submissions assigned to a specific editor
router.get('/editors/:editor_id', async (req: express.Request, res: express.Response) => {
    try {
        const editorId: string = req.params.editor_id
        const allSubmissionsForEditor = await db.collection('submissions').where('editor_id', '==', editorId).get()

        const submissionData: Submission[] = []

        allSubmissionsForEditor.forEach((sub: any) => {
            submissionData.push({
                submission_id: sub.id,
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
router.get('/writers/:writer_id', async (req: express.Request, res: express.Response) => {
    try {
        const writerId: string = req.params.writer_id
        const allSubmissionsForWriter = await db.collection('submissions').where('writer_id', '==', writerId).get()

        const submissionData: Submission[] = []

        allSubmissionsForWriter.forEach((sub: any) => {
            submissionData.push({
                submission_id: sub.id,
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

export = router