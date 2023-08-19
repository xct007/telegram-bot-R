import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "../lib/database.js";

export default async (bot) => {
	bot.command("turnme", async (ctx) => {
		const m = await msg(ctx);
		const styles = ["anime", "cyberpunk", "pixel", "zombie", "onepiece"];
		const inline_turnme = [];
		for (const style of styles.sort()) {
			inline_turnme.push(
				Markup.button.callback(style.toUpperCase(), "turnme_" + style)
			);
		}
		const replyOptions = Markup.inlineKeyboard([inline_turnme]);
		m.reply(
			`What style you want to. Each of style can generate different 4 images variation.`,
			{ reply_to_message_id: m.message_id, ...replyOptions }
		);
	});

	bot.action("turnme_anime", async (ctx) => {
		const m = await msg(ctx);
		await m.deleteMessage();
		const { message_id } = await m.reply("Send the image now.");

		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "anime",
				image_num: 4,
			},
			message_id,
		};
	});
	bot.action("turnme_cyberpunk", async (ctx) => {
		const m = await msg(ctx);
		await m.deleteMessage();
		const { message_id } = await m.reply("Send the image now.");

		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "cyberpunk",
				image_num: 4,
			},
			message_id,
		};
	});
	bot.action("turnme_pixel", async (ctx) => {
		const m = await msg(ctx);
		await m.deleteMessage();
		const { message_id } = await m.reply("Send the image now.");

		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "pixel",
				image_num: 4,
			},
			message_id,
		};
	});
	bot.action("turnme_zombie", async (ctx) => {
		const m = await msg(ctx);
		await m.deleteMessage();
		const { message_id } = await m.reply("Send the image now.");

		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "zombie",
				image_num: 4,
			},
			message_id,
		};
	});
	bot.action("turnme_onepiece", async (ctx) => {
		const m = await msg(ctx);
		await m.deleteMessage();
		const { message_id } = await m.reply("Send the image now.");

		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "onepiece",
				image_num: 4,
			},
			message_id,
		};
	});
};
