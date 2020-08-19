import {DataInterpretorAbs, InterpretedData} from "../DataInterpretorAbs"

export class GenericDataInterpretor extends DataInterpretorAbs {

	public async getInterpretedData(): Promise<InterpretedData> {
		const outData = {
			name: this.model,
			id: this.id,
			data: this.data
		} as InterpretedData;
		
		outData.path = this.pathPrefix + outData.name + (outData.id !== undefined ? "." + outData.id : "") + ".";

		return outData;
	}
}
