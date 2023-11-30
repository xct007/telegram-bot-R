import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import configs from "../config.js";

const bot = new Telegraf(configs.telegram_bot_token);
/** use log */
// bot.use(Telegraf.log())

bot.catch((error, ctx) => {
	console.log(error);
});
export { message, bot };
