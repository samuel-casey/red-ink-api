import * as express from 'express'
const router = express.Router();
import * as db from '../db/connection'
import {Editor} from  '../db/models/editor'

// INDEX
router.get('/', async (_req: express.Request, res: express.Response) => {
    try {
        const editorsResponse = await db.collection('editors').get()
        const editors: Editor[] = []
        editorsResponse.forEach((editor) => {
            const editorData = {
                doc_id: editor.id, 
                uid: editor.data().uid, 
                first_name: editor.data().first_name,
                last_name: editor.data().last_name,
                email: editor.data().email,
                profile_img_url: editor.data().profile_img_url,
                linkedin_url: editor.data().linkedin_url,
                twitter_url: editor.data().twitter_url,
                about_me: editor.data().about_me
            }
            editors.push(editorData)
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
            const editorData = {
                doc_id: editor.id, 
                uid: editor.data().uid, 
                first_name: editor.data().first_name,
                last_name: editor.data().last_name,
                email: editor.data().email,
                profile_img_url: editor.data().profile_img_url,
                linkedin_url: editor.data().linkedin_url,
                twitter_url: editor.data().twitter_url,
                about_me: editor.data().about_me
            }
            theEditor.push(editorData)
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