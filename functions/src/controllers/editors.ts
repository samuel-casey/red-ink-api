// import * as express from 'express'
// const router = express.Router();

// router.get('/editors', async (_req: express.Request, res: express.Response) => {
//     try {
//         const editorsCollection = await db.collection('editors').get()
//         const allEditors: Editor[] = []
//         editorsCollection.forEach((editor) => {
//             allEditors.push({uid: editor.data().uid, email: editor.data().email})
//         })
//         res.status(200).json(allEditors)
//     } catch (error) {
//         console.log(error)
//     }
// })

// // returns new thing from body -- does not save to db
// router.post('/editors', async (req: express.Request, res: express.Response) => {
//     try {
//         const newEditor: Editor = req.body
//         await db.collection('editors').add(newEditor)
//         res.status(200).json(newEditor) 
//     } catch (error) {
//         console.log(error)
//     }
// })

// // to change an editor's email
// router.put('/editors', async (req: express.Request, res: express.Response) => {
//     try {
//         const newEditor: Editor = req.body
//         await db.collection('editors')
//         res.status(200).json(newEditor)
//     } catch (error) {
//         console.log(error)
//     }
// })

// export = router