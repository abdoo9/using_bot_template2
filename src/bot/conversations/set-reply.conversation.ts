/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

import { Context } from "~/bot/types";
import { Conversation } from "@grammyjs/conversations";
import { repliesService } from "~/services/index";

export const setReply = async (
  conversation: Conversation<Context>,
  ctx: Context
) => {
  await ctx.reply(ctx.t("set_reply.send_trigger"));
  ctx = await conversation.waitFor("message:text");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const trigger = ctx.message!.text;
  if (trigger === "/set_reply" || !trigger) {
    ctx.reply(ctx.t("set_reply.err_set_reply_cant_be_used_as_trigger"));
    return;
  }
  await ctx.reply(ctx.t("set_reply.send_context", { trigger }));
  ctx = await conversation.waitFor("message");
  const { message } = ctx;

  if (trigger && message) {
    await repliesService
      .upsertReply(ctx.me.id, trigger, message.message_id, message.chat.id, {})
      .then((reply) => {
        ctx.reply(ctx.t("set_reply.success", { trigger }));
      })
      .then(() => ctx.pinChatMessage(message.message_id));
  }
};
