import {spawn, ChildProcessWithoutNullStreams} from "child_process";

enum stdInReadState {
	START,
	IN_JSON,
	INBETWEEN_JSON,
	KILL,
}

const procRestartTimeoutSeconds = 10;

/*
 * Created with @iobroker/create-adapter v1.24.2
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";


// Load your modules here, e.g.:
// import * as fs from "fs";

// Augment the adapter.config object with the actual types
// TODO: delete this in the next version
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ioBroker {
		interface AdapterConfig {
			// Define the shape of your options here (recommended)
			// Or use a catch-all approach
			[key: string]: any;
		}
	}
}

class Misol extends utils.Adapter {
	private readState: stdInReadState;
	private openParentCount: number;
	private currentMsg: string;
	private proc: ChildProcessWithoutNullStreams | null;
	
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "rtl433",
		});
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
	private async onReady(): Promise<void> {

		this.setState("info.connection", false, true);

		this.init();

		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates("*");
	}

	private init(): void {
		this.readState = stdInReadState.START;
		this.openParentCount = 0;
		this.currentMsg = "";
	
		this.proc = spawn("rtl_433", ["-F", "json",  "-M", "utc", "-M", "level", "-M", "protocol"]);

		this.proc.stdout.on("data", (data: Buffer) => {
			this.evalStdInData(data);
		});

		this.proc.stderr.on("data", (data: Buffer) => {
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
			
		this.proc.on("close", (code: any, signal: any) => {
			this.log.info(`rtl_433 closed with code ${code}, signal ${signal}, restarting in ${procRestartTimeoutSeconds} seconds`);
			this.setState("info.connection", false, true);
			
			setTimeout(() => {
				this.init();
				console.log("restarting process")
			}, procRestartTimeoutSeconds)
		});
	}
	
	private evalStdInData(data: Buffer): void {
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
	
				if (this.openParentCount ===  0) {
					this.readState = stdInReadState.INBETWEEN_JSON;
					try {
						const msg = JSON.parse (this.currentMsg);
						this.handleData(msg);
					}
					catch (e) {
						console.log ("parser error", e);
					}
					finally {
						this.currentMsg = "";
					}
				}
			}
		}
	
		if (this.readState === stdInReadState.START) {
			console.log (data.toString());
		}
	}
	
	private async handleData(data: any): Promise<void> {

		const path = "devices." + data.model + ".";
		for (const key in data) {
			if (key === "model") {
				continue;
			}

			const fullPath = path + key;
			await this.setObjectAsync(fullPath, {
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
			this.setStateAsync(fullPath, { val: data[key], ack: true });
		}

		await this.setObjectAsync("lastUpdate", {
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
		this.setStateAsync("lastUpdate", { val: data.time, ack: true });
	}
	
	

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			this.log.info("cleaned everything up...");
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 */
	private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
		if (!obj) {
			// The object was deleted
			this.log.info(`object ${id} deleted`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		this.log.info(`state ${id} changed: ${state}`);
	}
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Misol(options);
} else {
	// otherwise start the instance directly
	(() => new Misol())();
}