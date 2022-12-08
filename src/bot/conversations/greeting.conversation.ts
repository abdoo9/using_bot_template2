/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

import { Context } from "~/bot/types";
import { Conversation } from "@grammyjs/conversations";

export const greeting = async (
  conversation: Conversation<Context>,
  ctx: Context
) => {
  await ctx.reply("Please send me your name");
  ctx = await conversation.waitFor(":text");
  await ctx.reply(`Hello, ${ctx.message?.text}!`);
};
