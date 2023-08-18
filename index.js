import { bot } from "./lib/connection.js";
import { messageHandler, statesHandler, custom } from "./handlers/index.js";

/** @see in @link {./handlers} */
messageHandler(bot);
statesHandler(bot);
custom(bot);


bot.launch();

console.log({
	running: true,
});

bot.catch((error, ctx) => {
	console.error({
		error,
		ctx
	})
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

