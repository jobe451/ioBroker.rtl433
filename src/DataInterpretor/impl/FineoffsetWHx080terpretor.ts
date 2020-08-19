import { DataInterpretorAbs, InterpretedData } from "../DataInterpretorAbs"

export class FineoffsetWHx080terpretor extends DataInterpretorAbs {

	public async getInterpretedData(): Promise<InterpretedData> {
		const outData = {
			data: this.data
		} as InterpretedData;

		if (this.data.uv_sensor_id !== undefined) {
			outData.id = outData.data.uv_sensor_id;
			outData.name = "Fineoffset-uv-data"
			delete outData.data.uv_sensor_id;
		}
		else {
			outData.id = outData.data.id;
			outData.name = "Fineoffset-weather-data"
			delete outData.data.id;
		}

		outData.path = this.pathPrefix + outData.name + (outData.id !== undefined ? "." + outData.id : "") + ".";

		if (this.data.uv_sensor_id !== undefined) {
			const rain_mm_per_hour = await this.getLProMMProHour(outData.path);
			if (rain_mm_per_hour !== undefined) {
				outData.data.rain_mm_per_hour = rain_mm_per_hour;
			}
		}

		return outData;
	}

	private async getLProMMProHour(path: string): Promise<number | undefined> {
		const rain_mm_state = await this.adapter.getStateAsync(path + "rain_mm");
		const rain_mm_str = this.getValueFromStateObj(rain_mm_state);
		if (rain_mm_str === undefined) {
			return undefined
		}

		const rain_mm_previous = parseFloat(rain_mm_str);
		const rain_mm_now = parseFloat(this.data.rain_mm);
		if (rain_mm_previous === NaN || rain_mm_now === NaN || rain_mm_now < rain_mm_previous) {
			return undefined;
		}

		const time_state = await this.adapter.getObjectAsync(path + "time");
		const time_str = this.getValueFromStateObj(time_state);
		if (time_str === undefined) {
			return undefined
		}

		const currentTime = new Date(this.data.time + " UTC");
		const previousTime = new Date(time_str + " UTC");

		const hourDelta = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60 * 60);
		const rainDelta = rain_mm_now - rain_mm_previous;

		if (hourDelta <= 0) {
			return undefined;
		}

		const rain_per_hour = rainDelta / hourDelta;

		return rain_per_hour;
	}

	private getValueFromStateObj(obj: any): string | undefined {
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
