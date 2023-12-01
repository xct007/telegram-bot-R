import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export default async (bot) => {
	bot.command("turnme", async (ctx) => {
		const m = await msg(ctx);
		const styles = ["anime", "cyberpunk", "pixel", "zombie", "onepiece"];
		const inline_turnme = styles
			.sort()
			.map((style) => Markup.button.callback(style.toUpperCase(), "turnme_" + style));
		const replyOptions = Markup.inlineKeyboard([inline_turnme]);
		m.reply(
			`What style you want to. Each of style can generate different 4 images variation.`,
			{ reply_to_message_id: m.message_id, ...replyOptions }
		);

		/** it can be like this */
		const handleTurnMeAction = async (style) => {
			await m.deleteMessage();
			const { message_id } = await m.reply("Send the image now.", {
				reply_to_message_id: m.message_id,
			});

			state[m.sender_id] = {
				action: "turnme",
				url: "/image/turnMe",
				parameter: {
					style,
					image_num: 4,
				},
				message_id,
			};
		};

		bot.action("turnme_anime", () => handleTurnMeAction("anime"));
		bot.action("turnme_cyberpunk", () => handleTurnMeAction("cyberpunk"));
		bot.action("turnme_pixel", () => handleTurnMeAction("pixel"));
		bot.action("turnme_zombie", () => handleTurnMeAction("zombie"));
		bot.action("turnme_onepiece", () => handleTurnMeAction("onepiece"));
	});
};
