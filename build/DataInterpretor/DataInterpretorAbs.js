"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataInterpretorAbs = void 0;
class DataInterpretorAbs {
    constructor(pathPrefix, data, adapter) {
        this.model = data.model || "unkown";
        this.pathPrefix = pathPrefix;
        delete data.model;
        this.data = data;
        this.adapter = adapter;
    }
}
exports.DataInterpretorAbs = DataInterpretorAbs;
//# sourceMappingURL=DataInterpretorAbs.js.map