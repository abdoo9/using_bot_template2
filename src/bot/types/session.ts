import { Bot } from "@prisma/client";

export interface SessionData {
  botsOwned?: Array<Bot>;
  languageCode?: string;
}
