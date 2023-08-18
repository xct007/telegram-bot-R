import axios from "axios";
import prefix from "./prefix.js";
import configs from "../config.js";

export default async (ctx) => {
	let m = ctx.update.message;
	ctx.text = m?.text || "";
	ctx.is_command = prefix(ctx.text).is_command;
	ctx.text = prefix(ctx.text).text;
	ctx.name = ctx?.chat?.first_name || "";
	ctx.timestamp = ctx?.date || Math.floor(new Date() / 1000);

	ctx.photo = m?.photo?.[m?.photo?.length - 1]?.file_id
		? await (async () => {
				const { file_path } = await ctx.telegram.getFile(
					m?.photo?.[m?.photo?.length - 1]?.file_id,
				);
                const url = `https://api.telegram.org/file/bot${configs.telegram_bot_token}/${file_path}`
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
			  }
		  })()
		: null;
	return ctx;
};
