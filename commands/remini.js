import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export default async (bot) => {
	/** remini */
	bot.command("remini", async (ctx) => {
		const m = await msg(ctx);
		const { message_id } = await m.reply("Send the image now.", {
			reply_to_message_id: m.message_id,
		});
		state[m.sender_id] = {
			action: "remini",
			url: "/image/unblur",
			parameter: {},
			message_id,
		};
	});
};
