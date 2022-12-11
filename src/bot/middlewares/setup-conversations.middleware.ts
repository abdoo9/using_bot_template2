import { Composer, Middleware } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { Context } from "~/bot/types";
import { greeting } from "~/bot/conversations/greeting.conversation";
import { setReply } from "~/bot/conversations/set-reply.conversation";

const composer = new Composer<Context>();
composer.use(conversations());

// Conversations

composer.use(createConversation(greeting));
composer.use(createConversation(setReply));

export const middleware = (): Middleware<Context> => composer;
