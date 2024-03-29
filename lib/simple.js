import axios from "axios";
import prefix from "./prefix.js";
import configs from "../config.js";

/**
 * @param {import("telegraf").Context} ctx
 * @returns {Promise<import("telegraf").Context>}
 */
export default async (ctx) => {
	const m = ctx.update.message || ctx.update.callback_query;
	ctx.text = m?.text || "";
	ctx.is_command = prefix(ctx.text).is_command;
	ctx.text = prefix(ctx.text).text;
	ctx.name = ctx?.chat?.first_name || "";
	ctx.timestamp = ctx?.date || Math.floor(new Date() / 1000);
	ctx.message_id = m?.message_id || "";
	ctx.sender_id = m?.from?.id || "";
	ctx.chat_id = m?.chat?.id || "";

	ctx.photo = m?.photo?.[m?.photo?.length - 1]?.file_id
		? await (async () => {
				const { file_path } = await ctx.telegram.getFile(
					m?.photo?.[m?.photo?.length - 1]?.file_id
				);
				const url = `https://api.telegram.org/file/bot${configs.telegram_bot_token}/${file_path}`;
				return {
					download: async () => {
						const { url } = ctx.photo;
						const { data } = await axios
							.request({
								url,
								method: "GET",
								responseType: "arraybuffer",
							})
							.catch((e) => e?.response);
						return Buffer.from(data);
					},
					url,
				};
		  })()
		: null;
	return ctx;
};
