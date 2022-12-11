import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("set_reply", logHandle("handle /set_reply"), async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.conversation.enter("setReply");
});
