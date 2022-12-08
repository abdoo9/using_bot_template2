import { Composer, Middleware } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { Context } from "~/bot/types";
import { greeting } from "~/bot/conversations/greeting.conversation";

const composer = new Composer<Context>();
composer.use(conversations());

// Conversations

composer.use(createConversation(greeting));

export const middleware = (): Middleware<Context> => composer;
