// https://grammy.dev/plugins/hydrate.html for the delete after 5 seconds feature
import {
  BotError,
  Composer,
  GrammyError,
  matchFilter,
  NextFunction,
} from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import {
  botsService,
  chatsService,
  messagesService,
  usersService,
} from "~/services/index";
import { messageEditedBySenderKeyboard } from "~/bot/keyboards";
import { escapeHTML } from "~/bot/helpers/escape-html";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function errorHandler(err: BotError<Context>, next: NextFunction) {
  const error = err.error as GrammyError;
  const { ctx } = err;
  if (
    error.description === "Bad Request: replied message not found" &&
    error.method === "forwardMessage" &&
    Number(ctx.local.bot?.groupId) === error.payload.chat_id
  ) {
    await chatsService.disconnectAdminsGroup(
      Number(ctx.local.bot?.groupId),
      ctx.me.id
    ); // TODO: when this error happen the message will be lost and will not be forwarded to the admin
    await ctx.api.sendMessage(
      Number(ctx.local.bot?.ownerId),
      ctx.t("set_group.something_went_wrong")
    );
  } else if (error.description === "Forbidden: bot was blocked by the user") {
    const userId = error.payload.chat_id as number;
    await usersService.userBlockedBot(userId, ctx.me.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const errMsg =
      Number(ctx.local.bot?.ownerId) === userId
        ? await ctx.reply(ctx.t("message_delivery.owner_blocked_bot"))
        : await ctx.reply(ctx.t("message_delivery.user_blocked_bot"));
  }
}

export const composer = new Composer<Context>();

const feature = composer
  .errorBoundary(errorHandler)
  .drop(matchFilter("message:pinned_message"));

feature.use(messageEditedBySenderKeyboard);

feature.on(
  "edited_message",
  logHandle("handle edited_message"),
  async (ctx) => {
    ctx.replyWithChatAction("typing");
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
          reply_markup: messageEditedBySenderKeyboard,
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
          ctx.update.edited_message.text
        );
      }
    }
  }
);

feature
  .chatType("private")
  .on(
    "message",
    logHandle("handle user message sent to admin"),
    async function handleUserMessage(ctx) {
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

      if (!dest) {
        await ctx.reply("something went wrong");
        throw new Error("fatal: Bot not found");
      }
      if (dest.subscribers[0]?.userIsBanned) {
        await ctx.reply(ctx.t("message_delivery.you_are_banned"));
        return;
      }
      if (
        ctx.chat.id === (Number(dest.ownerId) || Number(dest.groupId)) &&
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
          const { groupId } = replyToMessage[0];
          const { text } = ctx.message;
          await ctx
            .copyMessage(Number(sourceId), {
              reply_to_message_id: sourceMessageId,
            })
            // .catch((err) => {
            //   throw new Error(err);
            // })
            .then(async (msg) => {
              await messagesService.createMessage(
                ctx.message.message_id,
                msg.message_id,
                ctx.chat.id,
                Number(replyToMessage[0].sourceId),
                botId,
                text,
                Number(groupId) || undefined
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
          ctx.update.message.text
        );
        const statusMessage = await ctx.reply(
          ctx.t("message_delivery.success")
        );
        if (ctx.message?.forward_date) {
          ctx.api.sendMessage(
            (dest.groupId ? dest.groupId : dest.ownerId).toString(),
            ctx.t(`message_delivery.message_forwarded`, {
              firstName: escapeHTML(ctx.from.first_name),
            }),
            {
              reply_to_message_id: destMessageId,
            }
          );
        }
        setTimeout(() => statusMessage.delete(), 3000);
      }
    }
  );

feature
  .chatType(["group", "supergroup"])
  .filter(
    (ctx) =>
      ctx.chat.id === Number(ctx.local.bot?.groupId) &&
      !!ctx.message?.reply_to_message
  )
  .on(
    "message",
    logHandle("handle admin reply to user in adminsGroup"),
    async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const destMessageId = ctx.message!.reply_to_message!.message_id;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const destId = ctx.message!.reply_to_message!.chat.id;
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
              ctx.message.from.id,
              Number(replyToMessage[0].sourceId),
              botId,
              text,
              ctx.chat.id
            );
          });
      }
    }
  );
