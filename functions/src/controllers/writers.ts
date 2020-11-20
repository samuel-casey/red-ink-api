import * as express from 'express'
const router = express.Router();
import * as db from '../db/connection'
import {Writer} from  '../db/models/writer'

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