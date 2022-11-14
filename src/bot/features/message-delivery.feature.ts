// https://grammy.dev/plugins/hydrate.html for the delete after 5 seconds feature
import { Composer } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, messagesService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.on("message", logHandle("handle message"), async (ctx) => {
  const dest = await botsService.findByBotId(ctx.me.id, {
    select: {
      ownerId: true,
      groupId: true,
    },
  });
  if (!dest) {
    await ctx.reply("something went wrong");
    throw new Error("fatal: Bot not found");
  }

  const forwardedMessage = await ctx.forwardMessage(
    (dest.groupId ? dest.groupId : dest.ownerId).toString()
  );
  if (!forwardedMessage) {
    await ctx.reply("something went wrong");
    throw new Error("fatal: Message not forwarded");
  } else {
    const messageId = forwardedMessage.message_id;
    const sourceId = ctx.from.id;
    const destId = forwardedMessage.chat.id;
    const botId = ctx.me.id;
    await messagesService.createMessage(messageId, sourceId, destId, botId, {});
    const statusMessage = await ctx.reply("message forwarded");
    if (ctx.message?.forward_date) {
      ctx.api.sendMessage(
        (dest.groupId ? dest.groupId : dest.ownerId).toString(),
        ctx.t(`message_delivery.message_forwarded`, {
          firstName: ctx.from?.first_name,
        }),
        {
          reply_to_message_id: messageId,
        }
      );
    }
    setTimeout(() => statusMessage.delete(), 3000);
  }

  // .then((message) => {
  //

  // });
});
