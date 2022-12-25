import { Context } from "../types/context";

export const extractGroupId = async (ctx: Context) => {
  return ctx.local.user?.botsOwned.filter(
    (bot) => Number(bot.botId) === Number(ctx.match?.[1])
  )[0].groupId;
};
