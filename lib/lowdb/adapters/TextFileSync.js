import { readFileSync, renameSync, writeFileSync } from "fs";
import { basename, dirname } from "path";
export class TextFileSync {
	constructor(filename) {
		this.filename = filename;
		this.tempFilename = path.join(dirname(filename), `.${basename(filename)}.tmp`);
	}
	read() {
		let data;
		try {
			data = readFileSync(this.filename, "utf-8");
		} catch (e) {
			if (e.code === "ENOENT") {
				return null;
			}
			throw e;
		}
		return data;
	}
	write(str) {
		writeFileSync(this.tempFilename, str);
		renameSync(this.tempFilename, this.filename);
	}
}
module.exports = { TextFileSync };
