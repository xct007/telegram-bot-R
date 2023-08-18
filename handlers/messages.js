import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "./database.js";


export const messageHandler = async (bot) => {
	/** /start command */
	bot.start(async (ctx) => {
		const m = await msg(ctx);

		m.reply(`Hi ${m.name}, do customize and make me better Xd`);
	});

	/** bot state single */
	bot.command("turnme", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		/** Change the state same as command */
		state[m.chat.id] = "turnme";

		/** send message to user */
		await m.reply("Send the image now.");

		/** then put your code in @link {./states.js} or something below */
	});

	/** bot state with button */
	bot.command("chatgpt", async (ctx) => {
		const m = await msg(ctx);

		const is_active_state = state[m.chat.id]
		const replyOptions = Markup.inlineKeyboard([
			Markup.button.callback("Enable", "enable_chatgpt"),
			Markup.button.callback("Disable", "disable_chatgpt"),
		])
		
		m.reply(`ChatGPT is ${is_active_state ? "ON" : "OFF"}`,
			replyOptions
		);
	});
	bot.action("enable_chatgpt", async (ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = "chatgpt";
		await m.deleteMessage()
		return m.reply("ChatGPT has been enable, you can ask question now!");
	});
	bot.action("disable_chatgpt", async (ctx) => {
		const m = await msg(ctx);
		delete state[m.chat.id];
		await m.deleteMessage()
		return m.reply("ChatGPT has been disable");
	});


	/** reply default message */
	bot.hears("hi", async (ctx) => {
		const m = await msg(ctx);

		m.reply(`Hello there ${m.name}`);
	});

};
