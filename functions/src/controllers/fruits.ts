import * as express from 'express'
// import { app } from 'firebase-functions';

const router = express.Router();

interface Fruit {
    name: string;
    color: string;
}

const fruits: Fruit[] = [
    {name: "apple", color: "red"}, {name: "apple", color: "orange"}, {name: "pear", color: "green"}
]

router.get('/', (_req: express.Request, res: express.Response) => {
    res.json(fruits)
})

router.post('/', (req: express.Request, res: express.Response) => {
    const newFruits: Fruit[] = req.body
    res.json(newFruits)
})

export = router