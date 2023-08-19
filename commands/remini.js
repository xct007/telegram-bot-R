import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

export default async (bot) => {
	/** remini */
	bot.command("remini", async(ctx) => {
		const m = await msg(ctx);
        const { message_id } = await m.reply("Send the image now.")
		state[m.chat.id] = {
			action: "remini",
			url: "/image/unblur",
			parameter: {},
            message_id
		};
	});
};
