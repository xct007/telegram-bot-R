import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export default async (bot) => {
	/** here */
	bot.command("custom", async (ctx) => {
		const m = await msg(ctx);
		console.log(m);
		return m.sendMessage("This is custom command");
	});
	// bot.command("edit", async (ctx) => {
	// 	const m = await msg(ctx);
	// 	const context = await m.sendMessage("This is edit command", {
	// 		reply_to_message_id: m.message_id,
	// 	});
	// 	console.log(context);
	// 	const {
	// 		reply_to_message: { message_id },
	// 		from: { id },
	// 	} = context;
	// 	setTimeout(async () => {
	// 		await m.editMessageText({
	// 			chat_id: id,
	// 			message_id,
	// 			text: "This is edited message",
	// 		});
	// 	}, 2000);
	// });
};
