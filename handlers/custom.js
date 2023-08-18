import { Markup } from "telegraf";
import msg from "../lib/simple.js";
import { state } from "./database.js";

export const custom = async (bot) => {
	/** here */
	bot.command("custom", (ctx) => {
		return ctx.replyWithPhoto(
			{ url: "https://picsum.photos/200/300/?random" },
			{
				caption: "Caption",
				parse_mode: "Markdown",
				...Markup.inlineKeyboard([
					Markup.button.callback("Plain", "plain"),
					Markup.button.callback("Italic", "italic"),
				]),
			}
		);
	});
};
