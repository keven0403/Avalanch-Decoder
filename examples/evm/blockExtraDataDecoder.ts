import { Buffer } from "../../src"
import { Tx } from "../../src/apis/evm"
import { Serialization } from "../../src/utils"
import { SerializedType } from "../../src/utils"
import * as bech32 from "bech32"

const cb58: SerializedType = "cb58"
const serialization: Serialization = Serialization.getInstance()

const getTxData = (item: string) => {
    const txSplit = item.split("0x000000000001") // item.split("0x000000000001")
    const prefix = "0x0000"
    const txData = prefix + txSplit[1]
    return txData
}

const fromDecToHex = (item: number) => {
    let hexVal = item.toString(16)
    let hexString = hexVal.length < 2 ? "0" + hexVal : hexVal
    return hexString
}
const fromHexToDec = (item: string) => {
    let hexString = item.split("0x").join("")
    let decNumber = parseInt(hexString, 16)
    let value = decNumber / 10 ** 9
    return value
}
const toHexThenDec = (item: number) => {
    let toHex = fromDecToHex(item).split(",").join("")
    let hexString = toHex.split("0x").join("")
    let decNumber = parseInt(hexString, 16)
    return decNumber
}
const bufToHex = (item: string) => {
    let valueFromJSON = item
    let bufValueFromJson = Buffer.from(valueFromJSON)
    let arrValueFromJSON = [...bufValueFromJson]
    let hexValueFromJSON = arrValueFromJSON.map((item) => fromDecToHex(item))
    return "0x" + hexValueFromJSON.toString().split(",").join("")
}
const bech32Encoder = (item: string) => {
    const hrp = "avax"
    let valueFromJSON = item
    let bufValueFromJson = Buffer.from(valueFromJSON)
    let arrValueFromJSON = [...bufValueFromJson]
    let bech32Address = bech32.bech32.encode(
        hrp,
        bech32.bech32.toWords(arrValueFromJSON)
    )
    return "C-" + bech32Address
}
const base58Encoder = (item: string) => {
    let valToBeEncoded = Buffer.from(item)
    let base58Val: string = serialization.bufferToType(valToBeEncoded, cb58)
    return base58Val
}
const chainName = (item: string) => {
    const chainID = base58Encoder(item)
    let name: string = "null"
    const cchainID = "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5"
    const pchainID = "11111111111111111111111111111111LpoYY"
    chainID == "11111111111111111111111111111111LpoYY"
        ? (name = "P-Chain")
        : (name = "X-Chain")
    chainID == cchainID
        ? (name = "C-Chain")
        : chainID == pchainID
            ? name == "P-Chain"
            : (name = "X-Chain")
    return name
}

export const main = async (code: string): Promise<any> => {
    try {
        let txData: string = ''
        let newCodeArr = code.split('10427')
        if (code.includes('0x000000000001') && newCodeArr[0].length === 29) {
            txData = getTxData(code)
        } else {
            txData = code
        }
        const sliTxData = txData.slice(2)
        const buf: Buffer = new Buffer(sliTxData, "hex")
        const tx: Tx = new Tx()
        tx.fromBuffer(buf)
        const txString: string = JSON.stringify(tx)
        const txToObject = JSON.parse(txString)
        let displayExportTx = () => {
            //exportTx
            let exportedTxInputs = txToObject.unsignedTx.transaction.inputs.map(
                (input) => ({
                    Address: bufToHex(input.address.data),
                    Amount: bufToHex(input.amount.data),
                    AmountValue: "0x" + input.amountValue,
                    DecimalAmountValue: fromHexToDec(input.amountValue) + " AVAX",
                    AssetID: base58Encoder(input.assetID.data),
                    Nonce: bufToHex(input.nonce.data),
                    NonceValue: input.nonceValue,
                    SignaturesCount: toHexThenDec(input.sigCount.data),
                    SignaturesIDs: input.sigIdxs
                })
            )
            let exportedTxExpOutputs =
                txToObject.unsignedTx.transaction.exportedOutputs.map((out) => ({
                    Type: out._typeName,
                    AssetID: base58Encoder(out.assetID.data),
                    Output: {
                        Type: out.output._typeName,
                        TypeID: out.output._typeID,
                        Locktime: toHexThenDec(out.output.locktime.data),
                        Threshold: toHexThenDec(out.output.threshold.data),
                        NumberOfAddresses: toHexThenDec(out.output.numaddrs.data),
                        Addresses: out.output.addresses.map((address) => ({
                            Type: address._typeName,
                            Bytes: bufToHex(address.bytes.data),
                            BytesSize: address.bsize,
                            Bech32Format: bech32Encoder(address.bytes.data)
                        })),
                        Amount: bufToHex(out.output.amount),
                        AmountValue: "0x" + out.output.amountValue,
                        DecimalAmountValue: fromHexToDec(out.output.amountValue) + " AVAX"
                    }
                }))
            let exportedTxCredentials = txToObject.credentials.map((credential) => ({
                Type: credential._typeName,
                TypeID: credential._typeID,
                Signatures: credential.sigArray.map((signature) => ({
                    Type: signature._typeName,
                    Bytes: bufToHex(signature.bytes.data),
                    BytesSize: signature.bsize
                }))
            }))
            let exportTx = {
                Type: txToObject.unsignedTx.transaction._typeName,
                UnsignedTx: {
                    Type: txToObject.unsignedTx._typeName,
                    CodecID: txToObject.unsignedTx.codecID,
                    Transaction: {
                        Type: txToObject.unsignedTx.transaction._typeName,
                        TypeID: txToObject.unsignedTx.transaction._typeID,
                        NetworkID: toHexThenDec(
                            txToObject.unsignedTx.transaction.networkID.data
                        ),
                        BlockchainID: base58Encoder(
                            txToObject.unsignedTx.transaction.blockchainID.data
                        ),
                        BlockchainIDName: chainName(
                            txToObject.unsignedTx.transaction.blockchainID.data
                        ),
                        DestinationChain: base58Encoder(
                            txToObject.unsignedTx.transaction.destinationChain.data
                        ),
                        DestinationChainName: chainName(
                            txToObject.unsignedTx.transaction.destinationChain.data
                        ),
                        NumberOfInputs: toHexThenDec(
                            txToObject.unsignedTx.transaction.numInputs.data
                        ),
                        Inputs: exportedTxInputs,
                        NumberOfExportedOutputs: toHexThenDec(
                            txToObject.unsignedTx.transaction.numExportedOutputs.data
                        ),
                        ExportedOutputs: exportedTxExpOutputs
                    }
                },
                Credentials: exportedTxCredentials
            }
            return exportTx
        }
    
        let displayImportTx = () => {
            //importTX
            let importedTxImpInputs = txToObject.unsignedTx.transaction.importIns.map(
                (inp) => ({
                    Type: inp._typeName,
                    TransactionId: base58Encoder(inp.txid.data),
                    OutputId: toHexThenDec(inp.outputidx.data),
                    AssetID: base58Encoder(inp.assetID.data),
                    Input: {
                        Type: inp.input._typeName,
                        TypeID: inp.input._typeID,
                        SignaturesIds: inp.input.sigIdxs.map((signature) => ({
                            Type: signature._typeName,
                            Source: bufToHex(signature.source),
                            Bytes: bufToHex(signature.bytes.data),
                            BytesSize: signature.bsize
                        })),
                        Amount: bufToHex(inp.input.amount),
                        AmountValue: "0x" + inp.input.amountValue,
                        DecimalAmountValue: fromHexToDec(inp.input.amountValue) + " AVAX"
                    }
                })
            )
            let importedTxOutputs = txToObject.unsignedTx.transaction.outs.map(
                (out) => ({
                    Address: bufToHex(out.address.data),
                    Amount: bufToHex(out.amount.data),
                    AmountValue: "0x" + out.amountValue,
                    DecimalAmountValue: fromHexToDec(out.amountValue) + " AVAX",
                    AssetID: base58Encoder(out.assetID.data)
                })
            )
            let importedTxCredentials = txToObject.credentials.map((credential) => ({
                Type: credential._typeName,
                TypeID: credential._typeID,
                Signatures: credential.sigArray.map((signature) => ({
                    Type: signature._typeName,
                    Bytes: bufToHex(signature.bytes.data),
                    BytesSize: signature.bsize
                }))
            }))
            let importTx = {
                Type: txToObject.unsignedTx.transaction._typeName,
                UnsignedTx: {
                    Type: txToObject.unsignedTx._typeName,
                    CodecID: txToObject.unsignedTx.codecID,
                    Transaction: {
                        Type: txToObject.unsignedTx.transaction._typeName,
                        TypeID: txToObject.unsignedTx.transaction._typeID,
                        NetworkID: toHexThenDec(
                            txToObject.unsignedTx.transaction.networkID.data
                        ),
                        BlockchainID: base58Encoder(
                            txToObject.unsignedTx.transaction.blockchainID.data
                        ),
                        BlockchainIDName: chainName(
                            txToObject.unsignedTx.transaction.blockchainID.data
                        ),
                        SourceChain: base58Encoder(
                            txToObject.unsignedTx.transaction.sourceChain.data
                        ),
                        SourceChainName: chainName(
                            txToObject.unsignedTx.transaction.sourceChain.data
                        ),
                        NumberOfImportedInputs: toHexThenDec(
                            txToObject.unsignedTx.transaction.numIns.data
                        ),
                        ImportedInputs: importedTxImpInputs,
                        NumberOfOutputs: toHexThenDec(
                            txToObject.unsignedTx.transaction.numOuts.data
                        ),
                        Outputs: importedTxOutputs
                    }
                },
                Credentials: importedTxCredentials
            }
            return importTx
        }
        console.log(txToObject.unsignedTx.transaction._typeName == "ExportTx" ? displayExportTx() : displayImportTx())
        return txToObject.unsignedTx.transaction._typeName == "ExportTx"
            ? displayExportTx()
            : displayImportTx()
    } catch (error) {
        console.log(error)
        return error
    }
    
}
// let code = '0x00000000000100000000000000010427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000160744b6a28b2fcc3173e42eca1bb85e071f441814093f155e1df4a2871bd44740000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000005e1612179d000000010000000000000001be628a10bf6c19f4a662ecf7b3c9cdb8babb514d0000005e160dceef21e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000010000000900000001589a28e4a6a40dd44affda84c01eab856ff9ca282ae7ec97b59e80fd078d313317003bb690bc49f879cf3bc7cb93a08b7d7ffb2e9732520405c68d901344652000'
// let code = '0x000000000000000000010427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b00000001c52b712aa7dce27a650bf509f799673e245edd4fa9e4e1700eb6105202fe579a0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000002faf080000000010000000000000001b8b5a87d1c05676f1f966da49151fa54dbe68c330000000002faf08021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000100000009000000013e6614876ee01d3b8b27480c00bdcb0ae84ee3e8346d2d5f08320f7dd3e76c4540be021fe85e91817654c9310b54e8f2e88d81db52b8693842b90f3dbd23bd5c01'
// let code = '0x000000000001000000010427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b00000001eb019ccd325ad53543a7e7e3b04828bdecf3cff600000000000f424121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000000000000100000000000000000000000100000001d6ce17826dd7c12a7577af257e82d99143b72500000000010000000900000001254d11f1adbd5dfb556855d02ac236ea2dd45d1463459b73714f55ab8d34a4b74a1f18c2868b886e83a5463c422ea3ccc7e9783d5620b1f5695646b0cb1e4dfa01'
// main(code)