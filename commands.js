import { Context } from "telegraf";
import { readdirSync } from "fs";

/**
 * @param {string} PATH_FOLDER
 * @param {Context} bot
 * @returns {Promise<Context>}
 */
export const commands = async (PATH_FOLDER, bot) => {
	const _PATH = readdirSync(PATH_FOLDER);
	for (const file of _PATH) {
		await (await import(`${PATH_FOLDER}/${file}`)).default(bot);
		console.log("command:", file);
	}
	return bot;
};
