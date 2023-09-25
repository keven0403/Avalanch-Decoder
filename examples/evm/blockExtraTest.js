
const blockExtraData = "0x00000000000100000001000000010427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652000000000000000000000000000000000000000000000000000000000000000000000001bb900bbe1a20da4d474666b79a5fa6ce1262973300000000009dba8421e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000000000000370000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000000000989680000000000000000000000001000000015feaa6c211cc8376e16211a76eff1e88bad8079d000000010000000900000001f526c9a38a2da08291583bf86e5160bd8b49df585b3fc2fb57884390c673f748428c58e95c6514b9d6a27d273550c63070ab64d257798e8d07f8a208489ebb2100"

const EVMConstants = {
    SECPCREDENTIAL: 9,
    IMPORTTX: 0,
    EXPORTTX: 1,
    SECPINPUTID: 5,
    ASSETIDLEN: 32,
    SECPXFEROUTPUTID: 7,
    LATESTCODEC: 0,
    ADDRESSLENGTH: 20,
}

const bintools = {
    copyFrom(buff, start, end) {
        if (start === void 0) { start = 0 }
        if (end === void 0) { end = undefined }
        if (end === undefined) {
            end = buff.length
        }
        return Buffer.from(Uint8Array.prototype.slice.call(buff.slice(start, end)))
    }
}

const EVMInput = {
    comparator(a, b) {
        // primarily sort by address
        let sorta = a.getAddress()
        let sortb = b.getAddress()
        // secondarily sort by assetID
        if (sorta.equals(sortb)) {
            sorta = a.getAssetID()
            sortb = b.getAssetID()
        }
        return Buffer.compare(sorta, sortb)
    }
}

const ExportTx = {
    initContract(networkID, blockchainID, destinationChain, inputs, exportedOutputs) {
        if (networkID === void 0) { networkID = undefined }
        if (blockchainID === void 0) { blockchainID = Buffer.alloc(32, 16) }
        if (destinationChain === void 0) { destinationChain = Buffer.alloc(32, 16) }
        if (inputs === void 0) { inputs = undefined }
        if (exportedOutputs === void 0) { exportedOutputs = undefined }
        var _this = {networkID, blockchainID}
        _this._typeName = "ExportTx"
        _this._typeID = EVMConstants.EXPORTTX
        _this.destinationChain = Buffer.alloc(32)
        _this.numInputs = Buffer.alloc(4)
        _this.inputs = inputs || []
        _this.numExportedOutputs = Buffer.alloc(4)
        _this.exportedOutputs = exportedOutputs || []
        _this.destinationChain = destinationChain
        return _this
    },

    serialize(encoding) {
        if (encoding === void 0) { encoding = "hex" }
        var fields = _super.prototype.serialize.call(this, encoding)
        return __assign(__assign({}, fields), { destinationChain: serializer.encoder(this.destinationChain, encoding, "Buffer", "cb58"), exportedOutputs: this.exportedOutputs.map(function (i) { return i.serialize(encoding) }) })
    },

    getDestinationChain() {
        return this.destinationChain
    },

    getInputs() {
        return this.inputs
    },

    getExportedOutputs() {
        return this.exportedOutputs
    },

    toBuffer() {
        if (typeof this.destinationChain === "undefined") {
            throw new errors_1.ChainIdError("ExportTx.toBuffer -- this.destinationChain is undefined")
        }
        this.numInputs.writeUInt32BE(this.inputs.length, 0)
        this.numExportedOutputs.writeUInt32BE(this.exportedOutputs.length, 0)
        var barr = [
            _super.prototype.toBuffer.call(this),
            this.destinationChain,
            this.numInputs
        ]
        var bsize = _super.prototype.toBuffer.call(this).length +
            this.destinationChain.length +
            this.numInputs.length
        this.inputs.forEach(function (importIn) {
            bsize += importIn.toBuffer().length
            barr.push(importIn.toBuffer())
        })
        bsize += this.numExportedOutputs.length
        barr.push(this.numExportedOutputs)
        this.exportedOutputs.forEach(function (out) {
            bsize += out.toBuffer().length
            barr.push(out.toBuffer())
        })
        return buffer_1.Buffer.concat(barr, bsize)
    },

    fromBuffer(bytes, offset) {
        if (offset === void 0) { offset = 0 }
        offset = _super.prototype.fromBuffer.call(this, bytes, offset)
        this.destinationChain = bintools.copyFrom(bytes, offset, offset + 32)
        offset += 32
        this.numInputs = bintools.copyFrom(bytes, offset, offset + 4)
        offset += 4
        var numInputs = this.numInputs.readUInt32BE(0)
        for (var i = 0; i < numInputs; i++) {
            var anIn = new inputs_1.EVMInput()
            offset = anIn.fromBuffer(bytes, offset)
            this.inputs.push(anIn)
        }
        this.numExportedOutputs = bintools.copyFrom(bytes, offset, offset + 4)
        offset += 4
        var numExportedOutputs = this.numExportedOutputs.readUInt32BE(0)
        for (var i = 0; i < numExportedOutputs; i++) {
            var anOut = new outputs_1.TransferableOutput()
            offset = anOut.fromBuffer(bytes, offset)
            this.exportedOutputs.push(anOut)
        }
        return offset
    },

    toString() {
        return bintools.bufferToB58(this.toBuffer())
    },

    sign(msg, kc) {
        var creds = _super.prototype.sign.call(this, msg, kc)
        this.inputs.forEach(function (input) {
            var cred = (0, credentials_1.SelectCredentialClass)(input.getCredentialID())
            var sigidxs = input.getSigIdxs()
            sigidxs.forEach(function (sigidx) {
                var keypair = kc.getKey(sigidx.getSource())
                var signval = keypair.sign(msg)
                var sig = new credentials_2.Signature()
                sig.fromBuffer(signval)
                cred.addSignature(sig)
            })
            creds.push(cred)
        })
        return creds
    }
}

const ImportTx = {
    constructor(networkID, blockchainID, sourceChainID, importIns, outs, fee) {
        if (networkID === void 0) { networkID = 1 }
        if (blockchainID === void 0) { blockchainID = Buffer.alloc(32, 16) }
        if (sourceChainID === void 0) { sourceChainID = Buffer.alloc(32, 16) }
        if (importIns === void 0) { importIns = undefined }
        if (outs === void 0) { outs = undefined }
        // if (fee === void 0) { fee = new bn_js_1.default(0) }
        var _this = {networkID, blockchainID}
        _this._typeName = "ImportTx"
        _this._typeID = EVMConstants.IMPORTTX
        _this.sourceChain = Buffer.alloc(32)
        _this.numIns = Buffer.alloc(4)
        _this.importIns = []
        _this.numOuts = Buffer.alloc(4)
        _this.outs = outs || []
        _this.sourceChain = sourceChainID
        var inputsPassed = false
        var outputsPassed = false
        if (typeof importIns !== "undefined" &&
            Array.isArray(importIns) &&
            importIns.length > 0) {
            inputsPassed = true
            _this.importIns = importIns
        }
        if (typeof outs !== "undefined" && Array.isArray(outs) && outs.length > 0) {
            if (outs.length > 1) {
                outs = outs.sort(outputs_1.EVMOutput.comparator())
            }
            outputsPassed = true
            _this.outs = outs
        }
        if (inputsPassed && outputsPassed) {
            _this.validateOuts(fee)
        }
        return _this
    }
}

const SelectTxClass = (txTypeID, ...args) => {
    if (txTypeID === EVMConstants.IMPORTTX) {
        return ImportTx.constructor(...args)
    } else if (txTypeID === EVMConstants.EXPORTTX) {
        return ExportTx.initContract(...args)
    }
    throw Error("TransactionError - SelectTxClass: unknown txType")
}

const transactionFromBuffer = (bytes, offset = 0) => {
    networkID = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    blockchainID = bintools.copyFrom(bytes, offset, offset + 32)
    offset += 32
    return offset
}

const UnsignedTx = {
    getTransaction() {
        return this.transaction
    },

    fromBuffer(bytes, offset) {
        if (offset === void 0) { offset = 0 }
        codecID = bintools.copyFrom(bytes, offset, offset + 2).readUInt16BE(0)
        offset += 2
        var txtype = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0)
        offset += 4
        transaction = SelectTxClass(txtype)
        return transactionFromBuffer(bytes, offset)
    },

    sign(kc) {
        var txbuff = this.toBuffer()
        var msg = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(txbuff).digest())
        var creds = this.transaction.sign(msg, kc)
        return new Tx(this, creds)
    }
}

const getTxData = (item) => {
    const txSplit = item.split("0x000000000001")
    const prefix = "0x0000"
    const txData = prefix + txSplit[1]
    return txData
}

const fromBuffer = (bytes, offset = 0) => {
    offset = UnsignedTx.fromBuffer(bytes, offset)
    const numcreds = bintools
        .copyFrom(bytes, offset, offset + 4)
        .readUInt32BE(0)
    offset += 4
    credentials = []
    for (let i = 0; i < numcreds; i++) {
        const credid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0)
        offset += 4
        const cred = SelectCredentialClass(credid)
        offset = cred.fromBuffer(bytes, offset)
        credentials.push(cred)
    }
    return offset
}


const Tx = () => {
    function Tx(unsignedTx, credentials) {
        if (typeof unsignedTx !== "undefined") {
            _this.unsignedTx = unsignedTx
            if (typeof credentials !== "undefined") {
                _this.credentials = credentials
            }
        }
        _this._typeName = "Tx";
        _this._typeID = undefined;
        return _this;
    }

    //serialize is inherited
    Tx.prototype.deserialize = function (fields, encoding) {
        if (encoding === void 0) { encoding = "hex"; }
        _super.prototype.deserialize.call(this, fields, encoding);
        this.unsignedTx = new UnsignedTx();
        this.unsignedTx.deserialize(fields["unsignedTx"], encoding);
        this.credentials = [];
        for (var i = 0; i < fields["credentials"].length; i++) {
            var cred = (0, credentials_1.SelectCredentialClass)(fields["credentials"]["".concat(i)]["_typeID"]);
            cred.deserialize(fields["credentials"]["".concat(i)], encoding);
            this.credentials.push(cred);
        }
    }

    Tx.prototype.fromBuffer = function (bytes, offset) {
        if (offset === void 0) { offset = 0; }
        this.unsignedTx = new UnsignedTx();
        offset = this.unsignedTx.fromBuffer(bytes, offset);
        var numcreds = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.credentials = [];
        for (var i = 0; i < numcreds; i++) {
            var credid = bintools
                .copyFrom(bytes, offset, offset + 4)
                .readUInt32BE(0);
            offset += 4;
            var cred = (0, credentials_1.SelectCredentialClass)(credid);
            offset = cred.fromBuffer(bytes, offset);
            this.credentials.push(cred);
        }
        return offset;
    }

    return Tx
}

const main = async (blockExtraData) => {
    const txData = getTxData(blockExtraData)
    const buf = Buffer.from(txData.slice(2), "hex")
    const tx = Tx()
    tx = fromBuffer(buf)
    const txString = JSON.stringify(tx)
    const txToObject = JSON.parse(txString)

    console.log({
        buf,
        txToObject
    })
}

main(blockExtraData)