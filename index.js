// TODO: FULLY REWRITE ENTIRE SOURCE CODE

import "dotenv/config";

import { bot } from "./lib/connection.js";
import { commands } from "./commands.js";

await commands("./commands", bot);

bot.launch();
bot.command("start", async (ctx) => {
	await ctx.sendMessage(
		`/start - Show this message
/remini - Make your photo looks better
/deep_fake - Make your photo looks like a video
/turnme - Make your photo looks like a cartoon
/custom - Custom command`,
		{
			reply_to_message_id: ctx.message.message_id,
		}
	);
});
console.log({
	running: true,
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
