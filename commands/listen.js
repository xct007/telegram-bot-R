import axios from "axios";
import msg from "../lib/simple.js";
import { state } from "../lib/database.js";
import configs from "../config.js";
import { getTiktokVideoFromText } from "../lib/tiktok.js";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export default async (bot) => {
	bot.on("photo", async (ctx) => {
		/** This is aliase for ctx */
		const m = await msg(ctx);

		switch (state[m.sender_id]?.action) {
			case "turnme": {
				/** delete the state */
				const backup_state = state[m.sender_id];
				delete state[m.sender_id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply(
					`Processing using ${backup_state["parameter"]["style"]} style`,
					{
						reply_to_message_id: m.message_id,
					}
				);
				/** getting image buffer that send by user in state */
				const init_image = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/turnMe",
						method: "POST",
						headers: {
							Authorization: "Bearer " + configs["itrose_apikey"],
						},
						data: {
							init_image,
							...backup_state["parameter"],
						},
					})
					.catch((e) => e?.response);
				const { status, result, message } = data;
				await m.deleteMessage(message_id);
				if (!status) {
					/** if api error, restore state */
					state[m.sender_id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}
				/** prepare the media group */
				await m.sendChatAction("upload_photo");
				const media = [];
				const { images } = result;
				for (const url of images) {
					media.push({
						media: { url },
						type: "photo",
						caption: "Powered by ITSROSE LIFE",
						has_spoiler: true,
					});
				}
				/** send the image url */
				await m.replyWithMediaGroup(media, {
					reply_to_message_id: m.message_id,
				});
				break;
			}
			case "remini": {
				/** delete the state */
				const backup_state = state[m.sender_id];
				delete state[m.sender_id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply("Processing the image.", {
					reply_to_message_id: m.message_id,
				});

				const url = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: "/image/unblur",
						method: "GET",
						headers: {
							Authorization: "Bearer " + configs["itrose_apikey"],
						},
						params: {
							json: true,
							url,
						},
					})
					.catch((e) => e?.response);

				const { status, result, message } = data;
				await m.deleteMessage(message_id);
				if (!status) {
					/** if api error, restore state */
					state[m.sender_id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}
				await m.sendChatAction("upload_photo");

				await m.replyWithPhoto(
					{
						url: result["images"][0],
					},
					{
						caption: "Powered by ITSROSE LIFE",
						reply_to_message_id: m.message_id,
						has_spoiler: true,
					}
				);
				delete state[m.sender_id];
				break;
			}
			case "deep_fake": {
				/** delete the state */
				const backup_state = state[m.sender_id];
				delete state[m.sender_id];

				await m.deleteMessage(backup_state.message_id);
				const { message_id } = await m.reply("Processing the image, random template.", {
					reply_to_message_id: m.message_id,
				});

				const init_image = m.photo.url;

				const { data } = await axios
					.request({
						baseURL: "https://api.itsrose.life",
						url: backup_state.url,
						method: "POST",
						headers: {
							Authorization: "Bearer " + configs["itrose_apikey"],
						},
						data: {
							init_image,
							...backup_state.parameter,
						},
					})
					.catch((e) => e?.response);

				const { status, result, message } = data;
				await m.deleteMessage(message_id);
				if (!status) {
					/** if api error, restore state */
					state[m.sender_id] = backup_state;
					return ctx.reply(message, {
						reply_to_message_id: m.message_id,
					});
				}
				await m.sendChatAction("upload_video");
				const {
					metadata: { style },
				} = result;
				await m.replyWithVideo(
					{
						url: result["video"],
					},
					{
						caption: `Template: ${style}`,
						reply_to_message_id: m.message_id,
						has_spoiler: true,
					}
				);
				delete state[m.sender_id];
				break;
			}
		}
	});
	bot.on("text", async (ctx) => {
		const m = await msg(ctx);
		getTiktokVideoFromText(m);
	});
};
