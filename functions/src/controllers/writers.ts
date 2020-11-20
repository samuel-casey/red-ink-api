import * as express from 'express'
const router = express.Router();
import {Writer} from  '../models/writer'

const writers: Writer[] = [
    {email: 'Sam', uid: "123"},
    {email: 'Casey', uid: "456"},
]

router.get('/', (_req: express.Request, res: express.Response) => {
    try {
        res.status(200).json(writers)
    } catch (error) {
        console.log(error);
    }
})

// router.post('/', (req: express.Request, res: express.Response) => {
// })

export = router