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
  const trigger = ctx.message?.text;
  await ctx.reply(ctx.t("set_reply.send_context"));
  ctx = await conversation.waitFor("message");
  const { message } = ctx;

  if (trigger && message) {
    await repliesService
      .upsertReply(ctx.me.id, trigger, message.message_id, message.chat.id, {})
      .then((reply) => {
        ctx.reply(ctx.t("set_reply.success"));
      });
  }
};
