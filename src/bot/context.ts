import { AsyncLocalStorage } from "async_hooks";
import { User, Bot } from "@prisma/client";
import { Logger } from "pino";

export interface LocalContext {
  bot?: Bot;
  user?: User;
  logger?: Logger;
}

export const context = new AsyncLocalStorage<LocalContext>();
