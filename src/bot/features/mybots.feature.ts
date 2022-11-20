import { Composer, InlineKeyboard } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("mybots", logHandle("handle /mybots"), async (ctx) => {
  await ctx.replyWithChatAction("typing");

  const bots = await botsService.findUserBots(ctx.from.id, {
    select: {
      firstName: true,
      username: true,
      botId: true,
    },
  });
  const botsTable = bots.reduce(
    (acc, bot) => `${acc}\n@${bot.username} ➖ I${bot.firstName}`,
    ""
  );
  // TODO: fix this mess
  function myBotsKeyboard(botsArray: string | any[]): InlineKeyboard {
    let botsKeyboard = new InlineKeyboard();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < botsArray.length; i++) {
      botsKeyboard = botsKeyboard.text(
        `• @${botsArray[i].username} •`,
        `info_${botsArray[i].botId}`
      );
      if (i % 2 === 0) {
        botsKeyboard.row();
      }
    }
    return botsKeyboard;
  }
  await ctx.reply(
    `${ctx.t("my_bots.bots_count", {
      botsCount: bots.length,
    })} \n\n ${botsTable}`,
    { reply_markup: myBotsKeyboard(bots) }
  );
});
