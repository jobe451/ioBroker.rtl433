
import { InterpretedData } from "./DataInterpretorAbs";
import { GenericDataInterpretor } from "./impl/GenericInterpretor"
import { FineoffsetWHx080terpretor } from "./impl/FineoffsetWHx080terpretor"

import * as utils from "@iobroker/adapter-core";

export async function interpretData(pathPrefix: string, data: any, adapter: utils.AdapterInstance): Promise<InterpretedData> {

	if (data.model === "Fineoffset-WHx080") {
		return new FineoffsetWHx080terpretor(pathPrefix, data, adapter).getInterpretedData();
	}

	return new GenericDataInterpretor(pathPrefix, data, adapter).getInterpretedData();
}