import { bot } from "./lib/connection.js";
import { messageHandler, statesHandler } from "./handlers/index.js";

/** @see in @link {./handlers} */
/** You also use your function */
messageHandler(bot);
statesHandler(bot);

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

