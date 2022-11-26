import "module-alias/register";

import { server } from "~/server";
import { prisma } from "~/prisma";
import { config } from "~/config";
import { logger } from "~/logger";
import { Bot, Context } from "grammy";

const bot = new Bot<Context>(config.BOT_TOKEN);
// Graceful shutdown
prisma.$on("beforeExit", async () => {
  logger.info("shutdown");

  await bot.stop();
  await server.close();
});

const run = async () => {
  server.listen(
    {
      host: config.BOT_SERVER_HOST,
      port: config.BOT_SERVER_PORT,
    },
    (serverError) => {
      if (serverError) {
        logger.error(serverError);
      } else {
        bot.api
          .setWebhook(config.BOT_WEBHOOK, {
            allowed_updates: config.BOT_ALLOWED_UPDATES,
          })
          .catch((err) => logger.error(err));
      }
    }
  );
};
run();
