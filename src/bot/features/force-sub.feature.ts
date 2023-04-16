import { Composer, matchFilter } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, chatsService, usersService } from "~/services/index";
import { escapeHTML } from "~/bot/helpers/escape-html";

export const composer = new Composer<Context>();
const feature = composer.chatType("private");

feature.command("start", async (ctx, next) => {
  const forceSubChat = await botsService.findBotFsubChats(
    ctx.me.id,
    ctx.from.id
  );
  if (forceSubChat?.botChats[0]) {
    const link = await ctx.api.createChatInviteLink(
      Number(forceSubChat?.botChats[0].chat.chatId)
    );
    console.log(link);
  }
  // TODO: fix forcesub
  //   if (forceSubChat?.botChats[0]) {
  //   } else {
  //     next();
  //   }
});
