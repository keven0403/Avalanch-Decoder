import express, { Express } from 'express'
import { main } from './examples/evm/blockExtraDataDecoder'
const hostname = '127.0.0.1' // '0.0.0.0' // '127.0.0.1' // '47.245.81.53'
const port = 5005

const app: Express = express() // 创建 express 服务


app.get(`/tx/:code`, async (req: any, res: any) => {
    let id = req.params.code
    let resJson: any = await main(id)
    console.log({
        req,
        res,
        resJson
    })
    if (resJson.message) {
        res.send({
            message: resJson.message
        })
    } else {
        res.send(resJson)
    }
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})