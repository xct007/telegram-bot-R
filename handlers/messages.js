import msg from "../lib/simple.js";
import { state } from "./database.js";

export const messageHandler = async (bot) => {
	/** /start command */
	bot.start(async (ctx) => {
		const m = await msg(ctx);

		m.reply(`Hi ${m.name}, do customize and make me better Xd`);
	});

	/** bot state logic */
	bot.command("image", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		/** Change the state same as command */
		state[m.chat.id] = "image";

		/** send message to user */
		await m.reply("Send the image now.");

		/** then put your code in @link {./states.js} */
	});

	/** bot simple reply command */
	bot.command("test", async (ctx) => {
		const m = await msg(ctx);

		m.reply("This is just a test");
	});

	/** reply default message */
	bot.hears("hi", async (ctx) => {
		const m = await msg(ctx);

		m.reply(`Hello there ${m.name}`);
	});
};
