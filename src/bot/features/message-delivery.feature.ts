// https://grammy.dev/plugins/hydrate.html for the delete after 5 seconds feature
import { Composer } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, messagesService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.on(
  "edited_message",
  logHandle("handle edited_message"),
  async (ctx) => {
    await ctx.replyWithChatAction("typing");
    const sourceMessageId = ctx.update.edited_message.message_id;
    const sourceId = ctx.update.edited_message.chat.id;
    const botId = ctx.me.id;
    const message =
      await messagesService.findBySourceMessageIdAndSourceIdAndBotId(
        sourceMessageId,
        sourceId,
        botId,
        {
          where: {
            sourceMessageId,
            sourceId,
            botId,
          },
        }
      );
    if (message.length === 1) {
      const updatedMessage = ctx.copyMessage(message[0].destId.toString(), {
        reply_to_message_id: message[0].destMessageId,
      });
    }
  }
);

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
    const sourceMessageId = ctx.message.message_id;
    const destMessageId = forwardedMessage.message_id;
    const sourceId = ctx.from.id;
    const destId = forwardedMessage.chat.id;
    const botId = ctx.me.id;
    await messagesService.createMessage(
      sourceMessageId,
      destMessageId,
      sourceId,
      destId,
      botId,
      {}
    );
    const statusMessage = await ctx.reply("message forwarded");
    if (ctx.message?.forward_date) {
      ctx.api.sendMessage(
        (dest.groupId ? dest.groupId : dest.ownerId).toString(),
        ctx.t(`message_delivery.message_forwarded`, {
          firstName: ctx.from?.first_name,
        }),
        {
          reply_to_message_id: destMessageId,
        }
      );
    }
    setTimeout(() => statusMessage.delete(), 3000);
  }
});
