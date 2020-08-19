import {DataInterpretorAbs, InterpretedData} from "../DataInterpretorAbs"

export class GenericDataInterpretor extends DataInterpretorAbs {

	public async getInterpretedData(): Promise<InterpretedData> {
		const outData = {
			name: this.model,
			id: this.data.id,
			data: this.data
		} as InterpretedData;
		
		outData.path = this.pathPrefix + outData.name + (outData.data.id !== undefined ? "." + outData.data.id : "") + ".";
		delete outData.data.id;

		return outData;
	}
}
