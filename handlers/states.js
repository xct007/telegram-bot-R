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
		switch (state[m.chat.id]) {
			case "turnme": {

                /** delete the state */
				delete state[m.chat.id];

				await m.reply("Turning you, using anime style");
				/** getting image buffer that send by user in state */
				const init_image = await m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/turnMe",
						method: "POST",
						params: {
							apikey: configs["itrose_apikey"],
						},
						data: {
							style: "anime",
							init_image,
						},
					})
					.catch((e) => e?.response);
				const { status, result, message } = data;
				if (!status) {
                    /** if api error, restore state */
                    state[m.chat.id] = "turnme";
					return ctx.reply(message);
				}
				/** send the image url */
				await m.replyWithPhoto(
					{
						url: result["images"][0],
					},
					{
						caption: "Powered by https://api.itsrose.life",
					}
				);

				break;
			}
		}
	});

	/** text state */
	bot.on("text", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		switch (state[m.chat.id]) {
			case "chatgpt": {

                /** delete state */
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
                state[m.chat.id] = "chatgpt"
				break;
			}
		}
	});
};
