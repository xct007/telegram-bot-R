import { renameSync, writeFileSync } from "fs";
import { readFileSync } from "fs";
import { dirname, basename } from "path";

function TextFile(filename) {
	this.filename = filename;
	this.tempFilename = path.join(
		dirname(filename),
		`.${basename(filename)}.tmp`,
	);
}

TextFile.prototype.read = function () {
	try {
		const data = readFileSync(this.filename, "utf-8");
		return data;
	} catch (e) {
		if (e.code === "ENOENT") {
			return null;
		}
		throw e;
	}
};

TextFile.prototype.write = function (str) {
	writeFileSync(this.tempFilename, str);
	renameSync(this.tempFilename, this.filename);
};
export default TextFile;
