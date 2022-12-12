// https://grammy.dev/plugins/hydrate.html for the delete after 5 seconds feature
import { Composer, matchFilter } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, messagesService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer
  .chatType("private")
  .drop(matchFilter("message:pinned_message"));

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
      const editNotificationMessage = await ctx.copyMessage(
        Number(message[0].destId),
        {
          reply_to_message_id: message[0].destMessageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: ctx.t(`message.edited`), callback_data: "edited" }],
            ],
          },
        }
      );
      if (editNotificationMessage) {
        const destMessageId = editNotificationMessage.message_id;
        const { destId } = message[0];
        await messagesService.createMessage(
          sourceMessageId,
          destMessageId,
          sourceId,
          Number(destId),
          botId,
          ctx.update.edited_message.text || "",
          {}
        );
      }
    }
  }
);

feature.on("message", logHandle("handle message"), async (ctx) => {
  const dest = await botsService.findByBotId(ctx.me.id, {
    select: {
      ownerId: true,
      groupId: true,
      subscribers: {
        where: {
          botId: ctx.me.id,
          userId: ctx.from.id,
        },
        select: {
          userIsBanned: true,
        },
      },
    },
  });
  // const dest = prisma.bot.findUnique({
  //   where: {
  //     botId: ctx.me.id,
  //   },
  //   select: {
  //     ownerId: true,
  //     groupId: true,
  //     subscribers: {
  //       where: {
  //         botId: ctx.me.id,
  //         userId: ctx.from.id,
  //       },
  //       select: {
  //         userIsBanned: true,
  //       },
  //     },
  //   },
  // });
  if (!dest) {
    await ctx.reply("something went wrong");
    throw new Error("fatal: Bot not found");
  }
  if (dest.subscribers[0]?.userIsBanned) {
    ctx.reply(ctx.t("message_delivery.you_are_banned"));
    return;
  }
  if (
    ctx.from.id === (Number(dest.ownerId) || Number(dest.groupId)) &&
    ctx.message.reply_to_message
  ) {
    const destMessageId = ctx.message.reply_to_message.message_id;
    const destId = ctx.message.reply_to_message.chat.id;
    const botId = ctx.me.id;
    const replyToMessage =
      await messagesService.findByDestMessageIdAndDestIdAndBotId(
        destMessageId,
        destId,
        botId,
        {
          where: {
            destMessageId,
            destId,
            botId,
          },
        }
      );
    if (replyToMessage.length === 1) {
      const { sourceMessageId } = replyToMessage[0];
      const { sourceId } = replyToMessage[0];
      const { text } = ctx.message;
      ctx
        .copyMessage(Number(sourceId), {
          reply_to_message_id: sourceMessageId,
        })
        .catch((err) => {
          throw new Error(err);
        })
        .then(async (msg) => {
          await messagesService.createMessage(
            ctx.message.message_id,
            msg.message_id,
            ctx.chat.id,
            Number(replyToMessage[0].sourceId),
            botId,
            text || " ",
            {}
          );
        });
    }
    return;
  }

  const forwardedMessage = await ctx.forwardMessage(
    Number(dest.groupId ? dest.groupId : dest.ownerId)
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
      ctx.update.message.text || "",
      {}
    );
    const statusMessage = await ctx.reply(ctx.t("message_delivery.success"));
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
