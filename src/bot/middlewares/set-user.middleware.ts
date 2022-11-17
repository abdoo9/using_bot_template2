import { Middleware } from "grammy";
import { Role } from "@prisma/client";

import { Context } from "~/bot/types";
import { usersService, botsService } from "~/services";
import { config } from "~/config";

export const middleware = (): Middleware<Context> => async (ctx, next) => {
  if (ctx.from?.is_bot === false) {
    const { id: telegramId, language_code: languageCode } = ctx.from;
    const role =
      ctx.from.id === config.BOT_ADMIN_USER_ID ? Role.OWNER : undefined;
    // upsert user
    ctx.local.user = await usersService.upsertByTelegramId(telegramId, {
      create: {
        languageCode,
        role,
      },
      update: {
        languageCode,
        role,
      },
    });

    // upsert subscription
    try {
      // it fails if the user is regestering a new bot
      await usersService.upsertByUserIdAndBotId(telegramId, ctx.me.id, {
        create: {
          languageCode,
          role,
          subscriptions: {
            create: {
              botId: ctx.me.id,
              userIsBanned: false,
              botIsBlocked: false,
            },
          },
        },
        update: {
          languageCode,
          role,
          subscriptions: {
            upsert: {
              create: {
                botId: ctx.me.id,
              },
              update: {
                botIsBlocked: false,
              },
              where: {
                subscription_pkey: {
                  botId: ctx.me.id,
                  userId: telegramId,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      throw new Error(
        `Failed to upsert subscription for user ${telegramId} and bot ${ctx.me.id}. Error: \`\`\`${err}\`\`\``
      );
    }
  }
  return next();
};
