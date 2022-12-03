import { Bot } from "@prisma/client";

export interface SessionData {
  broadcastNotifyUsers: boolean;
  botsOwned?: Array<Bot>;
  languageCode?: string;
}
