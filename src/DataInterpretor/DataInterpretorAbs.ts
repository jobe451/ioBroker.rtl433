import * as utils from "@iobroker/adapter-core";

export abstract class DataInterpretorAbs {
	protected data: any;
	protected model: string;
	protected pathPrefix: string;
	protected adapter: utils.AdapterInstance;

	constructor(pathPrefix: string, data: any, adapter: utils.AdapterInstance) {
		this.model = data.model || "unkown";
		this.pathPrefix = pathPrefix;

		delete data.model;
		this.data = data;
		this.adapter = adapter;
	}

	public abstract async getInterpretedData():  Promise<InterpretedData>;
}

export interface InterpretedData {
	path: string;
	name: string;
	id: string;
	data: any;
}
