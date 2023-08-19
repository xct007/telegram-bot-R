import { readdirSync } from "fs";

export const commands = async (PATH_FOLDER, bot) => {
	const _PATH = readdirSync(PATH_FOLDER);
	for (const file of _PATH) {
		await (await import(`${PATH_FOLDER}/${file}`)).default(bot);
		console.log("command:", file);
	}
};
