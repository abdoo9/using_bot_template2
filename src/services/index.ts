import { prisma } from "~/prisma";
import { createService as createUsersService } from "./users.service";
import { createService as createBotsService } from "./bots.service";
import { createService as createMessagesService } from "./messages.service";
import { createService as createSubscriptionsService } from "./subscriptions.service";

export const usersService = createUsersService(prisma);
export const botsService = createBotsService(prisma);
export const messagesService = createMessagesService(prisma);
export const subscriptionsService = createSubscriptionsService(prisma);
