import { Composer, InlineKeyboard } from "grammy";
import { selectBotKeyboard } from "~/bot/keyboards";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.use(selectBotKeyboard);

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
    (acc, bot) => `${acc}\n@${bot.username} ➖ ‎${bot.firstName}`,
    ""
  );

  await ctx.reply(
    `${ctx.t("my_bots.bots_count", {
      botsCount: bots.length,
    })} \n\n ${botsTable}`,
    { reply_markup: selectBotKeyboard }
  );
});
