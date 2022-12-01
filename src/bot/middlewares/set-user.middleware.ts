import { Middleware } from "grammy";
import { Role } from "@prisma/client";
import { Context } from "~/bot/types";
import { usersService, botsService } from "~/services";
import { config } from "~/config";

export const middleware =
  (token: string): Middleware<Context> =>
  async (ctx, next) => {
    if (ctx.from?.is_bot === false) {
      const { id: telegramId, language_code: languageCode } = ctx.from;
      const role =
        ctx.from.id === config.BOT_ADMIN_USER_ID ? Role.OWNER : undefined;
      // upsert user
      ctx.local.user = await usersService.upsertByTelegramId(
        telegramId,
        {
          create: {
            languageCode,
            role,
          },
          update: {
            languageCode,
            role,
          },
        },
        {
          include: {
            botsOwned: true,
          },
        }
      );
      // saving any bot that is not present in the database.
      // default admin is the bot maker owner
      const dbBot = await botsService.botExists(ctx.me.id);
      if (dbBot === null) {
        ctx.local.bot = await botsService.upsertByBotId(
          ctx.me.id,
          token,
          parseInt(process.env.BOT_ADMIN_USER_ID || "527340500", 10),
          ctx.me.first_name,
          ctx.me.username,
          {}
        );
      } else {
        ctx.local.bot = dbBot;
      }

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
