import { prisma } from "~/prisma";
import { createService as createUsersService } from "./users.service";
import { createService as createBotsService } from "./bots.service";
import { createService as createMessagesService } from "./messages.service";
import { createService as createSubscriptionsService } from "./subscriptions.service";
import { createService as createRepliesService } from "./replies.service";
import { createService as createChatsService } from "./chats.service";

export const usersService = createUsersService(prisma);
export const botsService = createBotsService(prisma);
export const messagesService = createMessagesService(prisma);
export const subscriptionsService = createSubscriptionsService(prisma);
export const repliesService = createRepliesService(prisma);
export const chatsService = createChatsService(prisma);
