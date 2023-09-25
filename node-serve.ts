import express, { Express } from 'express'
import { main } from './examples/evm/blockExtraDataDecoder'
const hostname = '127.0.0.1'
const port = 7000

const app: Express = express() // 创建 express 服务

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

app.get(`/tx/:code`, async (req: any, res: any) => {
    let id = req.params.code
    let resJson: any = await main(id)
    console.log({
        req,
        res,
        resJson
    })
    res.send(resJson)
})
