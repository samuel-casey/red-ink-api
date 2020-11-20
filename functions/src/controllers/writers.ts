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
        const newWriter: Writer = req.body
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
        // need to find document before updating it -- can't update it unless you know its exact path AKA document ID (frontend won't know this document id because it only has uid -- addd that???)
        const writerToUpdate = db.doc(`writers/${writerDocId}`)
        const updated = await writerToUpdate.update(newWriterData)
        res.status(204).json({status: 204, message: "updated", data: updated, a: newWriterData})
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 400, message: "error", data: error.message, a: newWriterData})
    }
})


// DESTROY


export = router