import * as express from 'express'
const router = express.Router();

// get all submissions assigned to a specific editor
router.get('/submissions/editors/:editor_id', async (req: express.Request, res: express.Response) => {
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

        res.status(200).json(submissionData)
    } catch (error) {
        console.log(error)
    }
})

// get all submissions submitted by a specific writer
router.get('/submissions/writers/:writer_id', async (req: express.Request, res: express.Response) => {
    try {
        const writerId: string = req.params.writer_id
        const allSubmissionsForWriter = await db.collection('submissions').where('writer_id', '==', writerId).get()

        const submissionData: Submission[] = []

        allSubmissionsForWriter.forEach((sub: any) => {
            submissionData.push({
                sub_id: sub.id,
                editor_id: sub.data().editor_id, 
                writer_id: sub.data().writer_id,
                url: sub.data().url,
                title: sub.data().title,
                edits_complete: sub.data().edits_complete
            })
        })

        res.status(200).json(submissionData)
    } catch (error) {
        console.log(error)
    }
})

export = router