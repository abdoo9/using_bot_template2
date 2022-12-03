import { Composer, InlineKeyboard } from "grammy";
import { selectBotKeyboard } from "~/bot/keyboards";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, usersService } from "~/services/index";
import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";

export const composer = new Composer<Context>();
const feature = composer.chatType("private");

const myBotsMenu = new MenuTemplate<Context>(
  (ctx) => `Hey ${ctx.from?.first_name}!`
);

const botMenu = new MenuTemplate<Context>(
  (ctx) => `You chose city ${ctx.match}`
);

const broadcastOptionsMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`broadcast_menu.messageText`)
);

myBotsMenu.chooseIntoSubmenu(
  "bot",
  async (ctx) => {
    return (
      ctx.local.user?.botsOwned.reduce((acc, bot) => {
        return { ...acc, [String(bot.botId)]: `@${bot.username}` };
      }, {}) || []
    );
  },
  botMenu,
  {
    columns: 2,
  }
);

// broadcastOptionsMenu.chooseIntoSubmenu(
//   "broadcast",
//   (ctx) => {
//     return {
//       s2a: ctx.t(`keyboard.broadcast.send-to-all`),
//       f2a: ctx.t(`keyboard.broadcast.forward-to-all`),
//     };
//   },
//   botMenu
// );

// bot menu start
botMenu.interact((ctx) => ctx.t("keyboard.stats"), "stats", {
  do: async (ctx) => {
    await ctx.answerCallbackQuery("not implemented yet");
    return false;
  },
});

botMenu.submenu(
  (ctx) => ctx.t("broadcast_menu.broadcast"),
  "broadcast",
  broadcastOptionsMenu,
  {
    joinLastRow: true,
  }
);

botMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`keyboard.back`),
    (ctx) => ctx.t(`keyboard.mainMenu`)
  )
);
// bot menu end

// broadcast options menu start
broadcastOptionsMenu.interact(
  (ctx) => ctx.t("broadcast_menu.send_to_all"),
  "s2a",
  {
    do: async (ctx) => {
      await ctx.answerCallbackQuery("not implemented yet");
      return false;
    },
  }
);

broadcastOptionsMenu.interact(
  (ctx) => ctx.t("broadcast_menu.forward_to_all"),
  "f2a",
  {
    do: async (ctx) => {
      await ctx.answerCallbackQuery("not implemented yet");
      return false;
    },
  }
);

broadcastOptionsMenu.toggle(
  (ctx) => ctx.t(`broadcast_menu.notify_users`),
  "notifyUsers",
  {
    isSet: (ctx) => ctx.session.broadcastNotifyUsers,
    set: (ctx, newState) => {
      ctx.session.broadcastNotifyUsers = newState;
      return true;
    },
  }
);
broadcastOptionsMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`keyboard.back`),
    (ctx) => ctx.t(`keyboard.mainMenu`)
  )
);
// // broadcast options menu end

const menuMiddleware = new MenuMiddleware("/", myBotsMenu);
feature.command("mybots", (ctx) => menuMiddleware.replyToContext(ctx));
feature.use(menuMiddleware);
console.log(menuMiddleware.tree());
// feature.use(selectBotKeyboard);

// feature.command("mybots", logHandle("handle /mybots"), async (ctx) => {
//   await ctx.replyWithChatAction("typing");

//   const bots = await botsService.findUserBots(ctx.from.id, {
//     select: {
//       firstName: true,
//       username: true,
//       botId: true,
//     },
//   });
//   const botsTable = bots.reduce(
//     (acc, bot) => `${acc}\n@${bot.username} ➖ ‎${bot.firstName}`,
//     ""
//   );

//   await ctx.reply(
//     `${ctx.t("my_bots.bots_count", {
//       botsCount: bots.length,
//     })} \n\n ${botsTable}`,
//     { reply_markup: selectBotKeyboard }
//   );
// });
