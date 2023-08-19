import axios from "axios";
import msg from "../lib/simple.js";
import { state } from "../lib/database.js";
import configs from "../config.js";

export default async (bot) => {
	bot.on("photo", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		switch (state[m.chat.id]?.action) {
			case "turnme": {
				/** delete the state */
				const backup_state = state[m.chat.id];
				delete state[m.chat.id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply(
					`Turning you, using ${backup_state["parameter"]["style"]} style`,
					{
						reply_to_message_id: m.message_id,
					},
				);
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
							...backup_state["parameter"],
						},
					})
					.catch((e) => e?.response);
				const { status, result, message } = data;
				if (!status) {
					/** if api error, restore state */
					state[m.chat.id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}

				await m.deleteMessage(message_id);

				const media = [];
				const { images } = result;
				for (const url of images) {
					media.push({
						media: { url },
						type: "photo",
						caption: "Powered by ITSROSE LIFE",
					});
				}
				/** send the image url */
				await m.replyWithMediaGroup(media);
				break;
			}
			case "remini": {
				/** delete the state */
				const backup_state = state[m.chat.id];
				delete state[m.chat.id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply(
					"Processing the image, using GFPGAN.",
					{
						reply_to_message_id: m.message_id,
					},
				);

				const url = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/unblur",
						method: "GET",
						params: {
							apikey: configs["itrose_apikey"],
							json: true,
							url,
						},
					})
					.catch((e) => e?.response);

				const { status, result, message } = data;
				if (!status) {
					/** if api error, restore state */
					state[m.chat.id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}

				await m.deleteMessage(message_id);

				const source = Buffer.from(result["base64Image"], "base64");

				await m.replyWithPhoto(
					{
						source,
					},
					{
						caption: "Powered by ITSROSE LIFE",
					},
				);
				delete state[m.chat.id];
				break;
			}
			case "deep_fake": {
				/** delete the state */
				const backup_state = state[m.chat.id];
				delete state[m.chat.id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply(
					"Processing the image, random style template.",
					{
						reply_to_message_id: m.message_id,
					},
				);

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
							...backup_state.parameter,
						},
					})
					.catch((e) => e?.response);

				const { status, result, message } = data;
				if (!status) {
					/** if api error, restore state */
					state[m.chat.id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}

				await m.deleteMessage(message_id);

				await m.replyWithVideo(
					{
						url: result["video"],
					},
					{
						caption: "Powered by ITSROSE LIFE",
					},
				);
				delete state[m.chat.id];
				break;
			}
		}
	});
};
