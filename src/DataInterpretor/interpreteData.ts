
import { InterpretedData } from "./DataInterpretorAbs";
import { GenericDataInterpretor } from "./impl/GenericInterpretor"
import { FineoffsetWHx080terpretor } from "./impl/FineoffsetWHx080terpretor"

import * as utils from "@iobroker/adapter-core";

export async function interpretData(pathPrefix: string, data: any, adapter: utils.AdapterInstance): Promise<InterpretedData> {

	if (data.model === "Fineoffset-WHx080") {
		adapter.log.info("FineoffsetWHx080terpretor interpretor");
		return new FineoffsetWHx080terpretor(pathPrefix, data, adapter).getInterpretedData();
	}

	adapter.log.info("Generic interpretor");
	return new GenericDataInterpretor(pathPrefix, data, adapter).getInterpretedData();
}