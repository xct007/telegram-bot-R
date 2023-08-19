import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "./database.js";

export const messageHandler = async (bot) => {
	/** /start command */
	bot.start(async (ctx) => {
		const m = await msg(ctx);

		m.reply(`Hi ${m.name}, Welcome.`);
	});

	/** bot state single */
	bot.command("turnme", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		/** Change the state same as command */
		const styles = [
			"anime",
			"cyberpunk",
			"pixel",
			"zombie",
			"onepiece"
		]
		const inline_turnme = [];
		for (const style of styles.sort()) {
			inline_turnme.push(
				Markup.button.callback(style.toUpperCase(), "turnme_" + style)
			)
		}
		const replyOptions = Markup.inlineKeyboard([
			inline_turnme
		])
		
		/** send message to user */
		m.reply(`What style you want to. Each of style can generate different 4 images variation.`,
			replyOptions
		);

		/** then put your code in @link {./states.js} or something below */
	});
	bot.action("turnme_anime", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "anime",
				image_num: 4
			}
		};
		await m.deleteMessage()
		return m.reply("Send the image now.");
	})
	bot.action("turnme_cyberpunk", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "cyberpunk",
				image_num: 4
			}
		};
		await m.deleteMessage()
		return m.reply("Send the image now.");
	})
	bot.action("turnme_pixel", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "pixel",
				image_num: 4
			}
		};
		await m.deleteMessage()
		return m.reply("Send the image now.");
	})
	bot.action("turnme_zombie", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "zombie",
				image_num: 4
			}
		};
		await m.deleteMessage()
		return m.reply("Send the image now.");
	})
	bot.action("turnme_onepiece", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "turnme",
			url: "/image/turnMe",
			parameter: {
				style: "onepiece",
				image_num: 4
			}
		};
		await m.deleteMessage()
		return m.reply("Send the image now.");
	})

	/** remini */
	bot.command("remini", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "remini",
			url: "/image/unblur",
			parameter: {}
		};
		return await m.reply("Send the image now.")
	});

	/** deep_fake */
	bot.command("deep_fake", async(ctx) => {
		const m = await msg(ctx);
		state[m.chat.id] = {
			action: "deep_fake",
			url: "/deep_fake/video",
			parameter: {
				style: "random",
			}
		};
		return m.reply("Send the image now.");
	})


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
		state[m.chat.id] = {
			action: "chatgpt",
			parameter: {}
		};
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
