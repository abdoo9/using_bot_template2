import { AsyncLocalStorage } from "async_hooks";
import { User, Bot, Reply } from "@prisma/client";
import { Logger } from "pino";

export interface LocalContext {
  bot?: Bot & { replies: Reply[] };
  user?: User & { botsOwned: Bot[] };
  logger?: Logger;
}

export const context = new AsyncLocalStorage<LocalContext>();
