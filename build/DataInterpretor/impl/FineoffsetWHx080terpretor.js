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
exports.FineoffsetWHx080terpretor = void 0;
const DataInterpretorAbs_1 = require("../DataInterpretorAbs");
class FineoffsetWHx080terpretor extends DataInterpretorAbs_1.DataInterpretorAbs {
    getInterpretedData() {
        return __awaiter(this, void 0, void 0, function* () {
            const outData = {
                data: this.data
            };
            if (this.data.uv_sensor_id !== undefined) {
                outData.id = outData.data.uv_sensor_id;
                outData.name = "Fineoffset-uv-data";
                delete outData.data.uv_sensor_id;
            }
            else {
                outData.id = outData.data.id;
                outData.name = "Fineoffset-weather-data";
                delete outData.data.id;
            }
            outData.path = this.pathPrefix + outData.name + (outData.id !== undefined ? "." + outData.id : "") + ".";
            if (this.data.uv_sensor_id === undefined) {
                const rain_mm_per_hour = yield this.getLProMMProHour(outData.path);
                if (rain_mm_per_hour !== undefined) {
                    outData.data.rain_mm_per_hour = rain_mm_per_hour;
                }
            }
            return outData;
        });
    }
    getLProMMProHour(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const rain_mm_state = yield this.adapter.getStateAsync(path + "rain_mm");
            this.adapter.log.info("rain_mm_state " + JSON.stringify(rain_mm_state));
            const rain_mm_str = this.getValueFromStateObj(rain_mm_state);
            if (rain_mm_str === undefined) {
                return undefined;
            }
            const rain_mm_previous = parseFloat(rain_mm_str);
            const rain_mm_now = parseFloat(this.data.rain_mm);
            if (rain_mm_previous === NaN || rain_mm_now === NaN || rain_mm_now < rain_mm_previous) {
                this.adapter.log.info("no previous rain");
                return undefined;
            }
            const time_state = yield this.adapter.getStateAsync(path + "time");
            this.adapter.log.info("time_state " + JSON.stringify(time_state));
            const time_str = this.getValueFromStateObj(time_state);
            if (time_str === undefined) {
                this.adapter.log.info("no previous time");
                return undefined;
            }
            const currentTime = new Date(this.data.time + " UTC");
            const previousTime = new Date(time_str + " UTC");
            const hourDelta = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60 * 60);
            const rainDelta = rain_mm_now - rain_mm_previous;
            if (hourDelta <= 0) {
                this.adapter.log.info("houre delta " + hourDelta);
                return undefined;
            }
            const rain_per_hour = rainDelta / hourDelta;
            this.adapter.log.info("rain per hour logging " + rain_per_hour);
            return rain_per_hour;
        });
    }
    getValueFromStateObj(obj) {
        if (obj === undefined || obj === null) {
            return undefined;
        }
        if (obj.val) {
            return obj.val;
        }
        else {
            return undefined;
        }
    }
}
exports.FineoffsetWHx080terpretor = FineoffsetWHx080terpretor;
//# sourceMappingURL=FineoffsetWHx080terpretor.js.map