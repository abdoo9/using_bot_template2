import { prisma } from "~/prisma";
import { createService as createUsersService } from "./users.service";
import { createService as createBotsService } from "./bots.service";

export const usersService = createUsersService(prisma);
export const botsService = createBotsService(prisma);
