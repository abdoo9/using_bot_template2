import { Bot } from "grammy";
import { limit as rateLimit } from "@grammyjs/ratelimiter";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { hydrate } from "@grammyjs/hydrate";
//import { ignoreOld } from "grammy-middlewares";
import { Context } from "~/bot/types";
import { config } from "~/config";

import {
  updatesLogger,
  setupSession,
  setupLocalContext,
  setupLogger,
  setUser,
  setupI18n,
  collectMetrics,
  ignoreOld,
} from "~/bot/middlewares";
import { apiCallsLogger } from "~/bot/transformers";
import {
  botAdminFeature,
  languageSelectFeature,
  myBotsFeature,
  messagedeliveryFeature,
  reciveTokenFeature,
  welcomeFeature,
  banFeature,
  unbanFeature,
  unbanAllFeature,
} from "~/bot/features";
import { isMultipleLocales } from "~/bot/helpers/i18n";
import { handleError } from "~/bot/helpers/error-handler";
import { botsService } from "~/services/index";

export async function getBot(botToken: string): Promise<Bot<Context>> {
  const dbBot = await botsService.findByBotId(Number(botToken.split(":")[0]));

  // if the bot is in the DB, we can avoid an impliset call to the getMe API
  const bot = dbBot
    ? new Bot<Context>(botToken, {
        botInfo: {
          id: Number(dbBot.botId),
          is_bot: true,
          first_name: dbBot.firstName,
          username: dbBot.username,
          can_join_groups: true,
          can_read_all_group_messages: true,
          supports_inline_queries: true,
        },
      })
    : new Bot<Context>(botToken);

  // Middlewares

  bot.api.config.use(apiThrottler());
  bot.api.config.use(parseMode("HTML"));

  if (config.isDev) {
    bot.api.config.use(apiCallsLogger);
    bot.use(updatesLogger());
  }
  bot.use(collectMetrics());
  bot.use(rateLimit());
  bot.use(hydrateReply);
  bot.use(hydrate());
  bot.use(setupSession());
  bot.use(setupLocalContext());
  bot.use(setupLogger());
  bot.use(setupI18n());
  bot.use(setUser(botToken));
  bot.use(ignoreOld());

  // Handlers

  bot.use(botAdminFeature);
  bot.use(welcomeFeature);
  bot.use(languageSelectFeature);
  bot.use(reciveTokenFeature);
  bot.use(myBotsFeature);
  bot.use(banFeature);
  bot.use(unbanFeature);
  bot.use(unbanAllFeature);

  bot.use(messagedeliveryFeature);
  if (isMultipleLocales) {
    bot.use(languageSelectFeature);
  }

  if (config.isDev) {
    bot.catch(handleError);
  }

  return bot;
}
