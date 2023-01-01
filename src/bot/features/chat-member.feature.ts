import { Composer, matchFilter } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { chatsService, usersService } from "~/services/index";
import { escapeHTML } from "~/bot/helpers/escape-html";

export const composer = new Composer<Context>();
const feature = composer.chatType(["group", "supergroup", "channel"]);

feature
  .on(["chat_member"])
  .use(logHandle("save new chat user status"), async (ctx) => {
    await usersService.upsertByTelegramId(
      ctx.chatMember.new_chat_member.user.id,
      {
        create: {
          firstName: escapeHTML(ctx.chatMember.new_chat_member.user.first_name),
          lastName: escapeHTML(
            ctx.chatMember.new_chat_member.user.last_name || " "
          ),
          languageCode: ctx.chatMember.new_chat_member.user.language_code,
          username: ctx.chatMember.new_chat_member.user.username,
        },
        update: {
          firstName: escapeHTML(ctx.chatMember.new_chat_member.user.first_name),
          lastName: escapeHTML(
            ctx.chatMember.new_chat_member.user.last_name || " "
          ),
          languageCode: ctx.chatMember.new_chat_member.user.language_code,
          username: ctx.chatMember.new_chat_member.user.username,
        },
      }
    );
    await chatsService.upsertChatMember(ctx.chatMember);
  });

feature
  .on([":new_chat_members"])
  .use(logHandle("save new chat member/s added"), async (ctx) => {
    ctx.msg.new_chat_members.forEach(async (member) => {
      if (member.is_bot) return;
      await usersService.upsertByTelegramId(member.id, {
        create: {
          firstName: escapeHTML(member.first_name),
          lastName: escapeHTML(member.last_name || " "),
          languageCode: member.language_code,
          username: member.username,
        },
        update: {
          firstName: escapeHTML(member.first_name),
          lastName: escapeHTML(member.last_name || " "),
          languageCode: member.language_code,
          username: member.username,
        },
      });
      await chatsService.upsertChatMemberMsg(ctx.msg.chat, member, "member");
    });
  });

feature
  .on([":left_chat_member"])
  .drop(matchFilter(":left_chat_member:is_bot"))
  .use(logHandle("save left chat member"), async (ctx) => {
    await usersService.upsertByTelegramId(ctx.msg.left_chat_member.id, {
      create: {
        firstName: ctx.msg.left_chat_member.first_name,
        lastName: ctx.msg.left_chat_member.last_name,
        languageCode: ctx.msg.left_chat_member.language_code,
        username: ctx.msg.left_chat_member.username,
      },
      update: {
        firstName: ctx.msg.left_chat_member.first_name,
        lastName: ctx.msg.left_chat_member.last_name,
        languageCode: ctx.msg.left_chat_member.language_code,
        username: ctx.msg.left_chat_member.username,
      },
    });
    await chatsService.upsertChatMemberMsg(
      ctx.msg.chat,
      ctx.msg.left_chat_member,
      "left"
    );
  });
