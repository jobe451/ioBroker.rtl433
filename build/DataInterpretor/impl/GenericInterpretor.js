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
exports.GenericDataInterpretor = void 0;
const DataInterpretorAbs_1 = require("../DataInterpretorAbs");
class GenericDataInterpretor extends DataInterpretorAbs_1.DataInterpretorAbs {
    getInterpretedData() {
        return __awaiter(this, void 0, void 0, function* () {
            const outData = {
                name: this.model,
                id: this.data.id,
                data: this.data
            };
            outData.path = this.pathPrefix + outData.name + (outData.data.id !== undefined ? "." + outData.data.id : "") + ".";
            delete outData.data.id;
            return outData;
        });
    }
}
exports.GenericDataInterpretor = GenericDataInterpretor;
//# sourceMappingURL=GenericInterpretor.js.map