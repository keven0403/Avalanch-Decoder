"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownFormatError = exports.SubnetAddressError = exports.SubnetThresholdError = exports.SubnetIdError = exports.ProtocolError = exports.InvalidEntropy = exports.EVMFeeError = exports.Bech32Error = exports.UnknownTypeError = exports.TypeNameError = exports.TypeIdError = exports.HexError = exports.NodeIdError = exports.PrivateKeyError = exports.Base58Error = exports.MergeRuleError = exports.PublicKeyError = exports.AddressIndexError = exports.BufferSizeError = exports.SubnetOwnerError = exports.DelegationFeeError = exports.TimeError = exports.StakeError = exports.FeeAssetError = exports.EVMOutputError = exports.EVMInputError = exports.SECPMintOutputError = exports.ThresholdError = exports.InsufficientFundsError = exports.UTXOError = exports.OutputIdError = exports.ChecksumError = exports.InvalidOperationIdError = exports.OperationError = exports.InputIdError = exports.TransferableInputError = exports.TransferableOutputError = exports.CredIdError = exports.CodecIdError = exports.TransactionError = exports.NameError = exports.SymbolError = exports.NoAtomicUTXOsError = exports.ChainIdError = exports.GooseEggCheckError = exports.AddressError = exports.AvalancheError = void 0;
var ADDRESS_ERROR_CODE = "1000";
var GOOSE_EGG_CHECK_ERROR_CODE = "1001";
var CHAIN_ID_ERROR_CODE = "1002";
var NO_ATOMIX_UTXOS_ERROR_CODE = "1003";
var SYMBOL_ERROR_CODE = "1004";
var NAME_ERROR_CODE = "1005";
var TRANSACTION_ERROR_CODE = "1006";
var CODEC_ID_ERROR_CODE = "1007";
var CRED_ID_ERROR_CODE = "1008";
var TRANSFERABLE_OUTPUT_ERROR_CODE = "1009";
var TRANSFERABLE_INPUT_ERROR_CODE = "1010";
var INPUT_ID_ERROR_CODE = "1011";
var OPERATION_ERROR_CODE = "1012";
var INVALID_OPERATION_ID_CODE = "1013";
var CHECKSUM_ERROR_CODE = "1014";
var OUTPUT_ID_ERROR_CODE = "1015";
var UTXO_ERROR_CODE = "1016";
var INSUFFICIENT_FUNDS_ERROR_CODE = "1017";
var THRESHOLD_ERROR_CODE = "1018";
var SECP_MINT_OUTPUT_ERROR_CODE = "1019";
var EVM_INPUT_ERROR_CODE = "1020";
var EVM_OUTPUT_ERROR_CODE = "1021";
var FEE_ASSET_ERROR_CODE = "1022";
var STAKE_ERROR_CODE = "1023";
var TIME_ERROR_CODE = "1024";
var DELEGATION_FEE_ERROR_CODE = "1025";
var SUBNET_OWNER_ERROR_CODE = "1026";
var BUFFER_SIZE_ERROR_CODE = "1027";
var ADDRESS_INDEX_ERROR_CODE = "1028";
var PUBLIC_KEY_ERROR_CODE = "1029";
var MERGE_RULE_ERROR_CODE = "1030";
var BASE58_ERROR_CODE = "1031";
var PRIVATE_KEY_ERROR_CODE = "1032";
var NODE_ID_ERROR_CODE = "1033";
var HEX_ERROR_CODE = "1034";
var TYPE_ID_ERROR_CODE = "1035";
var UNKNOWN_TYPE_ERROR_CODE = "1036";
var BECH32_ERROR_CODE = "1037";
var EVM_FEE_ERROR_CODE = "1038";
var INVALID_ENTROPY = "1039";
var PROTOCOL_ERROR_CODE = "1040";
var SUBNET_ID_ERROR_CODE = "1041";
var TYPE_NAME_ERROR_CODE = "1042";
var SUBNET_THRESHOLD_ERROR_CODE = "1043";
var SUBNET_ADDRESS_ERROR_CODE = "1044";
var UNKNOWN_FORMAT_ERROR_CODE = "1045";
var AvalancheError = /** @class */ (function (_super) {
    __extends(AvalancheError, _super);
    function AvalancheError(m, code) {
        var _this = _super.call(this, m) || this;
        Object.setPrototypeOf(_this, AvalancheError.prototype);
        _this.errorCode = code;
        return _this;
    }
    AvalancheError.prototype.getCode = function () {
        return this.errorCode;
    };
    return AvalancheError;
}(Error));
exports.AvalancheError = AvalancheError;
var AddressError = /** @class */ (function (_super) {
    __extends(AddressError, _super);
    function AddressError(m) {
        var _this = _super.call(this, m, ADDRESS_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, AddressError.prototype);
        return _this;
    }
    return AddressError;
}(AvalancheError));
exports.AddressError = AddressError;
var GooseEggCheckError = /** @class */ (function (_super) {
    __extends(GooseEggCheckError, _super);
    function GooseEggCheckError(m) {
        var _this = _super.call(this, m, GOOSE_EGG_CHECK_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, GooseEggCheckError.prototype);
        return _this;
    }
    return GooseEggCheckError;
}(AvalancheError));
exports.GooseEggCheckError = GooseEggCheckError;
var ChainIdError = /** @class */ (function (_super) {
    __extends(ChainIdError, _super);
    function ChainIdError(m) {
        var _this = _super.call(this, m, CHAIN_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, ChainIdError.prototype);
        return _this;
    }
    return ChainIdError;
}(AvalancheError));
exports.ChainIdError = ChainIdError;
var NoAtomicUTXOsError = /** @class */ (function (_super) {
    __extends(NoAtomicUTXOsError, _super);
    function NoAtomicUTXOsError(m) {
        var _this = _super.call(this, m, NO_ATOMIX_UTXOS_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, NoAtomicUTXOsError.prototype);
        return _this;
    }
    return NoAtomicUTXOsError;
}(AvalancheError));
exports.NoAtomicUTXOsError = NoAtomicUTXOsError;
var SymbolError = /** @class */ (function (_super) {
    __extends(SymbolError, _super);
    function SymbolError(m) {
        var _this = _super.call(this, m, SYMBOL_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SymbolError.prototype);
        return _this;
    }
    return SymbolError;
}(AvalancheError));
exports.SymbolError = SymbolError;
var NameError = /** @class */ (function (_super) {
    __extends(NameError, _super);
    function NameError(m) {
        var _this = _super.call(this, m, NAME_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, NameError.prototype);
        return _this;
    }
    return NameError;
}(AvalancheError));
exports.NameError = NameError;
var TransactionError = /** @class */ (function (_super) {
    __extends(TransactionError, _super);
    function TransactionError(m) {
        var _this = _super.call(this, m, TRANSACTION_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TransactionError.prototype);
        return _this;
    }
    return TransactionError;
}(AvalancheError));
exports.TransactionError = TransactionError;
var CodecIdError = /** @class */ (function (_super) {
    __extends(CodecIdError, _super);
    function CodecIdError(m) {
        var _this = _super.call(this, m, CODEC_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, CodecIdError.prototype);
        return _this;
    }
    return CodecIdError;
}(AvalancheError));
exports.CodecIdError = CodecIdError;
var CredIdError = /** @class */ (function (_super) {
    __extends(CredIdError, _super);
    function CredIdError(m) {
        var _this = _super.call(this, m, CRED_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, CredIdError.prototype);
        return _this;
    }
    return CredIdError;
}(AvalancheError));
exports.CredIdError = CredIdError;
var TransferableOutputError = /** @class */ (function (_super) {
    __extends(TransferableOutputError, _super);
    function TransferableOutputError(m) {
        var _this = _super.call(this, m, TRANSFERABLE_OUTPUT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TransferableOutputError.prototype);
        return _this;
    }
    return TransferableOutputError;
}(AvalancheError));
exports.TransferableOutputError = TransferableOutputError;
var TransferableInputError = /** @class */ (function (_super) {
    __extends(TransferableInputError, _super);
    function TransferableInputError(m) {
        var _this = _super.call(this, m, TRANSFERABLE_INPUT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TransferableInputError.prototype);
        return _this;
    }
    return TransferableInputError;
}(AvalancheError));
exports.TransferableInputError = TransferableInputError;
var InputIdError = /** @class */ (function (_super) {
    __extends(InputIdError, _super);
    function InputIdError(m) {
        var _this = _super.call(this, m, INPUT_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, InputIdError.prototype);
        return _this;
    }
    return InputIdError;
}(AvalancheError));
exports.InputIdError = InputIdError;
var OperationError = /** @class */ (function (_super) {
    __extends(OperationError, _super);
    function OperationError(m) {
        var _this = _super.call(this, m, OPERATION_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, OperationError.prototype);
        return _this;
    }
    return OperationError;
}(AvalancheError));
exports.OperationError = OperationError;
var InvalidOperationIdError = /** @class */ (function (_super) {
    __extends(InvalidOperationIdError, _super);
    function InvalidOperationIdError(m) {
        var _this = _super.call(this, m, INVALID_OPERATION_ID_CODE) || this;
        Object.setPrototypeOf(_this, InvalidOperationIdError.prototype);
        return _this;
    }
    return InvalidOperationIdError;
}(AvalancheError));
exports.InvalidOperationIdError = InvalidOperationIdError;
var ChecksumError = /** @class */ (function (_super) {
    __extends(ChecksumError, _super);
    function ChecksumError(m) {
        var _this = _super.call(this, m, CHECKSUM_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, ChecksumError.prototype);
        return _this;
    }
    return ChecksumError;
}(AvalancheError));
exports.ChecksumError = ChecksumError;
var OutputIdError = /** @class */ (function (_super) {
    __extends(OutputIdError, _super);
    function OutputIdError(m) {
        var _this = _super.call(this, m, OUTPUT_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, OutputIdError.prototype);
        return _this;
    }
    return OutputIdError;
}(AvalancheError));
exports.OutputIdError = OutputIdError;
var UTXOError = /** @class */ (function (_super) {
    __extends(UTXOError, _super);
    function UTXOError(m) {
        var _this = _super.call(this, m, UTXO_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, UTXOError.prototype);
        return _this;
    }
    return UTXOError;
}(AvalancheError));
exports.UTXOError = UTXOError;
var InsufficientFundsError = /** @class */ (function (_super) {
    __extends(InsufficientFundsError, _super);
    function InsufficientFundsError(m) {
        var _this = _super.call(this, m, INSUFFICIENT_FUNDS_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, InsufficientFundsError.prototype);
        return _this;
    }
    return InsufficientFundsError;
}(AvalancheError));
exports.InsufficientFundsError = InsufficientFundsError;
var ThresholdError = /** @class */ (function (_super) {
    __extends(ThresholdError, _super);
    function ThresholdError(m) {
        var _this = _super.call(this, m, THRESHOLD_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, ThresholdError.prototype);
        return _this;
    }
    return ThresholdError;
}(AvalancheError));
exports.ThresholdError = ThresholdError;
var SECPMintOutputError = /** @class */ (function (_super) {
    __extends(SECPMintOutputError, _super);
    function SECPMintOutputError(m) {
        var _this = _super.call(this, m, SECP_MINT_OUTPUT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SECPMintOutputError.prototype);
        return _this;
    }
    return SECPMintOutputError;
}(AvalancheError));
exports.SECPMintOutputError = SECPMintOutputError;
var EVMInputError = /** @class */ (function (_super) {
    __extends(EVMInputError, _super);
    function EVMInputError(m) {
        var _this = _super.call(this, m, EVM_INPUT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, EVMInputError.prototype);
        return _this;
    }
    return EVMInputError;
}(AvalancheError));
exports.EVMInputError = EVMInputError;
var EVMOutputError = /** @class */ (function (_super) {
    __extends(EVMOutputError, _super);
    function EVMOutputError(m) {
        var _this = _super.call(this, m, EVM_OUTPUT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, EVMOutputError.prototype);
        return _this;
    }
    return EVMOutputError;
}(AvalancheError));
exports.EVMOutputError = EVMOutputError;
var FeeAssetError = /** @class */ (function (_super) {
    __extends(FeeAssetError, _super);
    function FeeAssetError(m) {
        var _this = _super.call(this, m, FEE_ASSET_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, FeeAssetError.prototype);
        return _this;
    }
    return FeeAssetError;
}(AvalancheError));
exports.FeeAssetError = FeeAssetError;
var StakeError = /** @class */ (function (_super) {
    __extends(StakeError, _super);
    function StakeError(m) {
        var _this = _super.call(this, m, STAKE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, StakeError.prototype);
        return _this;
    }
    return StakeError;
}(AvalancheError));
exports.StakeError = StakeError;
var TimeError = /** @class */ (function (_super) {
    __extends(TimeError, _super);
    function TimeError(m) {
        var _this = _super.call(this, m, TIME_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TimeError.prototype);
        return _this;
    }
    return TimeError;
}(AvalancheError));
exports.TimeError = TimeError;
var DelegationFeeError = /** @class */ (function (_super) {
    __extends(DelegationFeeError, _super);
    function DelegationFeeError(m) {
        var _this = _super.call(this, m, DELEGATION_FEE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, DelegationFeeError.prototype);
        return _this;
    }
    return DelegationFeeError;
}(AvalancheError));
exports.DelegationFeeError = DelegationFeeError;
var SubnetOwnerError = /** @class */ (function (_super) {
    __extends(SubnetOwnerError, _super);
    function SubnetOwnerError(m) {
        var _this = _super.call(this, m, SUBNET_OWNER_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SubnetOwnerError.prototype);
        return _this;
    }
    return SubnetOwnerError;
}(AvalancheError));
exports.SubnetOwnerError = SubnetOwnerError;
var BufferSizeError = /** @class */ (function (_super) {
    __extends(BufferSizeError, _super);
    function BufferSizeError(m) {
        var _this = _super.call(this, m, BUFFER_SIZE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, BufferSizeError.prototype);
        return _this;
    }
    return BufferSizeError;
}(AvalancheError));
exports.BufferSizeError = BufferSizeError;
var AddressIndexError = /** @class */ (function (_super) {
    __extends(AddressIndexError, _super);
    function AddressIndexError(m) {
        var _this = _super.call(this, m, ADDRESS_INDEX_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, AddressIndexError.prototype);
        return _this;
    }
    return AddressIndexError;
}(AvalancheError));
exports.AddressIndexError = AddressIndexError;
var PublicKeyError = /** @class */ (function (_super) {
    __extends(PublicKeyError, _super);
    function PublicKeyError(m) {
        var _this = _super.call(this, m, PUBLIC_KEY_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, PublicKeyError.prototype);
        return _this;
    }
    return PublicKeyError;
}(AvalancheError));
exports.PublicKeyError = PublicKeyError;
var MergeRuleError = /** @class */ (function (_super) {
    __extends(MergeRuleError, _super);
    function MergeRuleError(m) {
        var _this = _super.call(this, m, MERGE_RULE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, MergeRuleError.prototype);
        return _this;
    }
    return MergeRuleError;
}(AvalancheError));
exports.MergeRuleError = MergeRuleError;
var Base58Error = /** @class */ (function (_super) {
    __extends(Base58Error, _super);
    function Base58Error(m) {
        var _this = _super.call(this, m, BASE58_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, Base58Error.prototype);
        return _this;
    }
    return Base58Error;
}(AvalancheError));
exports.Base58Error = Base58Error;
var PrivateKeyError = /** @class */ (function (_super) {
    __extends(PrivateKeyError, _super);
    function PrivateKeyError(m) {
        var _this = _super.call(this, m, PRIVATE_KEY_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, PrivateKeyError.prototype);
        return _this;
    }
    return PrivateKeyError;
}(AvalancheError));
exports.PrivateKeyError = PrivateKeyError;
var NodeIdError = /** @class */ (function (_super) {
    __extends(NodeIdError, _super);
    function NodeIdError(m) {
        var _this = _super.call(this, m, NODE_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, NodeIdError.prototype);
        return _this;
    }
    return NodeIdError;
}(AvalancheError));
exports.NodeIdError = NodeIdError;
var HexError = /** @class */ (function (_super) {
    __extends(HexError, _super);
    function HexError(m) {
        var _this = _super.call(this, m, HEX_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, HexError.prototype);
        return _this;
    }
    return HexError;
}(AvalancheError));
exports.HexError = HexError;
var TypeIdError = /** @class */ (function (_super) {
    __extends(TypeIdError, _super);
    function TypeIdError(m) {
        var _this = _super.call(this, m, TYPE_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TypeIdError.prototype);
        return _this;
    }
    return TypeIdError;
}(AvalancheError));
exports.TypeIdError = TypeIdError;
var TypeNameError = /** @class */ (function (_super) {
    __extends(TypeNameError, _super);
    function TypeNameError(m) {
        var _this = _super.call(this, m, TYPE_NAME_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, TypeNameError.prototype);
        return _this;
    }
    return TypeNameError;
}(AvalancheError));
exports.TypeNameError = TypeNameError;
var UnknownTypeError = /** @class */ (function (_super) {
    __extends(UnknownTypeError, _super);
    function UnknownTypeError(m) {
        var _this = _super.call(this, m, UNKNOWN_TYPE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, UnknownTypeError.prototype);
        return _this;
    }
    return UnknownTypeError;
}(AvalancheError));
exports.UnknownTypeError = UnknownTypeError;
var Bech32Error = /** @class */ (function (_super) {
    __extends(Bech32Error, _super);
    function Bech32Error(m) {
        var _this = _super.call(this, m, BECH32_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, Bech32Error.prototype);
        return _this;
    }
    return Bech32Error;
}(AvalancheError));
exports.Bech32Error = Bech32Error;
var EVMFeeError = /** @class */ (function (_super) {
    __extends(EVMFeeError, _super);
    function EVMFeeError(m) {
        var _this = _super.call(this, m, EVM_FEE_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, EVMFeeError.prototype);
        return _this;
    }
    return EVMFeeError;
}(AvalancheError));
exports.EVMFeeError = EVMFeeError;
var InvalidEntropy = /** @class */ (function (_super) {
    __extends(InvalidEntropy, _super);
    function InvalidEntropy(m) {
        var _this = _super.call(this, m, INVALID_ENTROPY) || this;
        Object.setPrototypeOf(_this, InvalidEntropy.prototype);
        return _this;
    }
    return InvalidEntropy;
}(AvalancheError));
exports.InvalidEntropy = InvalidEntropy;
var ProtocolError = /** @class */ (function (_super) {
    __extends(ProtocolError, _super);
    function ProtocolError(m) {
        var _this = _super.call(this, m, PROTOCOL_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, ProtocolError.prototype);
        return _this;
    }
    return ProtocolError;
}(AvalancheError));
exports.ProtocolError = ProtocolError;
var SubnetIdError = /** @class */ (function (_super) {
    __extends(SubnetIdError, _super);
    function SubnetIdError(m) {
        var _this = _super.call(this, m, SUBNET_ID_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SubnetIdError.prototype);
        return _this;
    }
    return SubnetIdError;
}(AvalancheError));
exports.SubnetIdError = SubnetIdError;
var SubnetThresholdError = /** @class */ (function (_super) {
    __extends(SubnetThresholdError, _super);
    function SubnetThresholdError(m) {
        var _this = _super.call(this, m, SUBNET_THRESHOLD_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SubnetThresholdError.prototype);
        return _this;
    }
    return SubnetThresholdError;
}(AvalancheError));
exports.SubnetThresholdError = SubnetThresholdError;
var SubnetAddressError = /** @class */ (function (_super) {
    __extends(SubnetAddressError, _super);
    function SubnetAddressError(m) {
        var _this = _super.call(this, m, SUBNET_ADDRESS_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, SubnetAddressError.prototype);
        return _this;
    }
    return SubnetAddressError;
}(AvalancheError));
exports.SubnetAddressError = SubnetAddressError;
var UnknownFormatError = /** @class */ (function (_super) {
    __extends(UnknownFormatError, _super);
    function UnknownFormatError(m) {
        var _this = _super.call(this, m, UNKNOWN_FORMAT_ERROR_CODE) || this;
        Object.setPrototypeOf(_this, UnknownFormatError.prototype);
        return _this;
    }
    return UnknownFormatError;
}(AvalancheError));
exports.UnknownFormatError = UnknownFormatError;
