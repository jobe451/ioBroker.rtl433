"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretData = void 0;
const GenericInterpretor_1 = require("./impl/GenericInterpretor");
const FineoffsetWHx080terpretor_1 = require("./impl/FineoffsetWHx080terpretor");
function interpretData(pathPrefix, data, adapter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.model === "Fineoffset-WHx080") {
            adapter.log.info("FineoffsetWHx080terpretor interpretor");
            return new FineoffsetWHx080terpretor_1.FineoffsetWHx080terpretor(pathPrefix, data, adapter).getInterpretedData();
        }
        adapter.log.info("Generic interpretor");
        return new GenericInterpretor_1.GenericDataInterpretor(pathPrefix, data, adapter).getInterpretedData();
    });
}
exports.interpretData = interpretData;
//# sourceMappingURL=interpreteData.js.map