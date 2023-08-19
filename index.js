import { bot } from "./lib/connection.js";
import { commands } from "./commands.js";

commands("./commands", bot)

bot.launch();

console.log({
	running: true,
});

bot.catch((error, ctx) => {
	ctx.reply(error);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
