import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

export default async (bot) => {
	bot.command("deep_fake", async (ctx) => {
		const m = await msg(ctx);
		const { message_id } = await m.reply("Send the image now.", {
			reply_to_message_id: m.message_id,
		});
		state[m.sender_id] = {
			action: "deep_fake",
			url: "/deep_fake/video",
			parameter: {
				style: "random",
			},
			message_id,
		};
	});
};
