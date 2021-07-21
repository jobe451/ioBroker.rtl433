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
const child_process_1 = require("child_process");
const interpreteData_1 = require("./DataInterpretor/interpreteData");
var stdInReadState;
(function (stdInReadState) {
    stdInReadState[stdInReadState["START"] = 0] = "START";
    stdInReadState[stdInReadState["IN_JSON"] = 1] = "IN_JSON";
    stdInReadState[stdInReadState["INBETWEEN_JSON"] = 2] = "INBETWEEN_JSON";
    stdInReadState[stdInReadState["KILL"] = 3] = "KILL";
})(stdInReadState || (stdInReadState = {}));
const procRestartTimeoutSeconds = 60;
/*
 * Created with @iobroker/create-adapter v1.24.2
 */
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
class Misol extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "rtl433" }));
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        //this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.readState = stdInReadState.START;
        this.openParentCount = 0;
        this.currentMsg = "";
        this.proc = null;
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    onReady() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState("info.connection", false, true);
            this.init();
            // in this template all states changes inside the adapters namespace are subscribed
            this.subscribeStates("*");
        });
    }
    init() {
        this.readState = stdInReadState.START;
        this.openParentCount = 0;
        this.currentMsg = "";
        this.proc = child_process_1.spawn("rtl_433", ["-F", "json", "-M", "utc", "-M", "level", "-M", "protocol"]);
        this.proc.stdout.on("data", (data) => {
            this.evalStdInData(data);
        });
        this.proc.stderr.on("data", (data) => {
            const dataStr = data.toString();
            let isError = false;
            // todo also if "error" is mentioned
            if (this.readState !== stdInReadState.START || dataStr === "Async read stalled, exiting!") {
                this.log.error(dataStr);
                isError = true;
            }
            else {
                this.log.info(dataStr);
            }
            if (isError && this.readState !== stdInReadState.KILL) {
                if (this.proc) {
                    console.log("killing the process");
                    this.proc.kill();
                }
            }
        });
        this.proc.on("close", (code, signal) => {
            this.log.info(`rtl_433 closed with code ${code}, signal ${signal}, restarting in ${procRestartTimeoutSeconds} seconds`);
            this.setState("info.connection", false, true);
            setTimeout(() => {
                this.init();
                console.log("restarting process");
            }, procRestartTimeoutSeconds * 1000);
        });
    }
    evalStdInData(data) {
        for (const char of data.toString()) {
            if (this.readState != stdInReadState.IN_JSON) {
                if (char === "{") {
                    this.readState = stdInReadState.IN_JSON;
                    this.setState("info.connection", true, true);
                    this.currentMsg = char;
                    this.openParentCount = 1;
                }
            }
            else if (this.readState = stdInReadState.IN_JSON) {
                this.currentMsg += char;
                if (char === "{") {
                    this.openParentCount++;
                }
                else if (char === "}") {
                    this.openParentCount--;
                }
                if (this.openParentCount === 0) {
                    this.readState = stdInReadState.INBETWEEN_JSON;
                    try {
                        const msg = JSON.parse(this.currentMsg);
                        this.handleData(msg);
                    }
                    catch (e) {
                        console.log("parser error", e);
                    }
                    finally {
                        this.currentMsg = "";
                    }
                }
            }
        }
        if (this.readState === stdInReadState.START) {
            console.log(data.toString());
        }
    }
    handleData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const interpretedData = yield interpreteData_1.interpretData("devices.", data, this);
            const path = interpretedData.path;
            for (const key in interpretedData.data) {
                if (key === "model") {
                    continue;
                }
                const fullPath = path + key;
                yield this.setObjectAsync(fullPath, {
                    type: "state",
                    common: {
                        name: "name",
                        type: "string",
                        role: "info",
                        read: true,
                        write: true,
                    },
                    native: {},
                });
                this.setStateAsync(fullPath, { val: interpretedData.data[key].toString(), ack: true });
            }
            yield this.setObjectAsync("lastUpdate", {
                type: "state",
                common: {
                    name: "name",
                    type: "string",
                    role: "info",
                    read: true,
                    write: true,
                },
                native: {},
            });
            this.setStateAsync("lastUpdate", { val: interpretedData.data.time.toString(), ack: true });
        });
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            this.log.info("cleaned everything up...");
            callback();
        }
        catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed object changes
     */
    onObjectChange(id, obj) {
        if (!obj) {
            // The object was deleted
            this.log.info(`object ${id} deleted`);
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        //this.log.info(`state ${id} changed: ${state}`);
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Misol(options);
}
else {
    // otherwise start the instance directly
    (() => new Misol())();
}
//# sourceMappingURL=main.js.map