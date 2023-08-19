import axios from "axios";
import msg from "../lib/simple.js";
import { state } from "./database.js";

import configs from "../config.js";

export const statesHandler = async (bot) => {
	/** photo state */
	bot.on("photo", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		/** Be carefull, the state name in @file {./message.js} */
		switch (state[m.chat.id]?.action) {
			case "turnme": {
                /** delete the state */
				const backup_state = state[m.chat.id]
				delete state[m.chat.id];

				await m.deleteMessage();
				await m.reply(`Turning you, using ${backup_state["parameter"]["style"]} style`);
				/** getting image buffer that send by user in state */
				const init_image = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/turnMe",
						method: "POST",
						params: {
							apikey: configs["itrose_apikey"],
						},
						data: {
							init_image,
							...backup_state["parameter"]
						},
					})
					.catch((e) => e?.response);
				const { status, result, message } = data;
				if (!status) {
                    /** if api error, restore state */
                    state[m.chat.id] = backup_state;
					return ctx.reply(message);
				}
				const media = [];
				const { images } = result;
				for (const url of images) {
					media.push({
						media: { url },
						type: "photo",
						caption: "Powered by ITSROSE LIFE",
					})
				}
				/** send the image url */
				await m.replyWithMediaGroup(media);

				break;
			}
			case "remini": {

				await m.deleteMessage();
				await m.reply("Processing the image, using GFPGAN.")
				/** delete the state */
				const backup_state = state[m.chat.id]
				delete state[m.chat.id];

				const url = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/unblur",
						method: "GET",
						params: {
							apikey: configs["itrose_apikey"],
							json: true,
							url
						},
					})
					.catch((e) => e?.response);
				
				const { status, result, message } = data;
				if (!status) {
                    /** if api error, restore state */
                    state[m.chat.id] = backup_state;
					return ctx.reply("Process fail, try again.");
				}
				const source = Buffer.from(result["base64Image"], "base64");

				await m.replyWithPhoto({
					source,
				}, {
					caption: "Powered by ITSROSE LIFE"
				});
				delete state[m.chat.id]
			}
			case "deep_fake": {

				await m.deleteMessage();
				await m.reply("Processing the image, random style template.")
				/** delete the state */
				const backup_state = state[m.chat.id]
				delete state[m.chat.id];

				const init_image = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: backup_state.url,
						method: "POST",
						params: {
							apikey: configs["itrose_apikey"],
						},
						data: {
							init_image,
							...backup_state.parameter
						}
					})
					.catch((e) => e?.response);
				
				const { status, result, message } = data;
				if (!status) {
                    /** if api error, restore state */
                    state[m.chat.id] = backup_state;
					return ctx.reply("Process fail, try again.");
				}

				await m.replyWithVideo({
					url: result["video"],
				}, {
					caption: "Powered by ITSROSE LIFE"
				});
				delete state[m.chat.id]
			}
		}
	});

	/** text state */
	bot.on("text", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		switch (state[m.chat.id]?.action) {
			case "chatgpt": {

                /** delete state */
				const backup_state = state[m.chat.id]
                delete state[m.chat.id];

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/chatGPT/completions",
						method: "POST",
						params: {
							apikey: configs["itrose_apikey"],
						},
						data: {
							prompt: m.text
						},
					})
					.catch((e) => e?.response);
				const { message } = data;
				await m.reply(message);

                /** restore state */
                state[m.chat.id] = backup_state;
				break;
			}
		}
	});
};
