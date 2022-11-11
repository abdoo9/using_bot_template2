import { Composer, Bot } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  /\d{5,15}:[A-Za-z0-9-_]{30,40}/,
  logHandle("handle token"),
  async (ctx) => {
    ctx.replyWithChatAction("typing");

    const token = ctx.match[0];
    const botId = parseInt(token.split(":")[0], 10);
    const bot = new Bot(token);
    await bot.init().catch((err) => {
      return ctx.reply(`Invalid token ${err.message}`);
    });
    const { first_name: firstName, username } = bot.botInfo;

    const newBot = await botsService.upsertByBotId(
      botId,
      token,
      ctx.from.id,
      firstName,
      username,
      {
        select: {
          botId: true,
        },
      }
    );
    ctx.reply(ctx.t("token.received") + newBot.botId);
  }
);
