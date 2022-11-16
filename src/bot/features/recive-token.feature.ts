import { Composer, Bot } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService } from "~/services/index";
import { isNewBot } from "~/bot/helpers/compare-dateime";

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
    await bot
      .init()
      .catch(() => {
        return ctx.reply(ctx.t("token_received.invalid"));
      })
      .then(async () => {
        await bot.api.deleteWebhook();
        await bot.api.setWebhook(`${process.env.WEBHOOK_URL}/${token}`);
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
          createdAt: true,
          updatedAt: true,
        },
      }
    );
    const isNew: boolean = isNewBot(newBot.updatedAt, newBot.createdAt); // https://github.com/prisma/prisma/discussions/3432#discussioncomment-3099451
    ctx.reply(
      `${
        isNew
          ? ctx.t("token_received.new_bot", { firstName, username })
          : ctx.t("token_received.updated_bot", { firstName, username })
      }`
    );
  }
);
