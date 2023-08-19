import "dotenv/config";

const configs = {
	telegram_bot_token: process.env.BOT_TOKEN || "YOUR:BOT_TOKEN",
	itrose_apikey: process.env.ITSROSE_APIKEY || "",
};

export default configs;
