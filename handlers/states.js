import msg from "../lib/simple.js";
import { state } from "./database.js";

export const statesHandler = async (bot) => {
    /** Below is to handle photo */
    bot.on("photo", async (ctx) => {

        /** This is aliase for ctx */
        const m = await msg(ctx);

        /** Be carefull, the state name in @file {./message.js} */
        switch (state[m.chat.id]) {
            case "image": {

                /** getting image buffer that send by user in state */
                const source = await m.photo.download();
                
                /** sending back the image */
                await m.replyWithPhoto({ source });

                /** Always delete the state if not used anymore */
                delete state[m.chat.id];

                break;
            }
        }
    });

    /** handling text message */
    bot.on("text", async(ctx) => {

        /** This is aliase for ctx */
        const m = await msg(ctx);

        switch (state[m.chat.id]) {
            case "chat": {

                /** say hi */
                ctx.reply("Hi");

                /** Always delete the state if not used anymore */
                delete state[m.chat.id];
                break;
            }
        }
    })
};
