import { Composer } from "grammy";
import { Context } from "~/bot/types";
import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";

export const composer = new Composer<Context>();
const feature = composer.chatType("private");
// TODO:make botmaker only capable of doing this
// .filter(
//   (ctx) =>
//     ctx.local.bot?.type === "USER_OWNED_MAKER" ||
//     ctx.local.bot?.type === "OWNER_OWNED_MAKER"
// );

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
botMenu.url(
  (ctx) => ctx.t("keyboard.set_reply"),
  (ctx) =>
    `https://t.me/${
      ctx.local.user?.botsOwned.filter(
        (bot) => ctx.match && bot.botId.toString() === ctx.match[1]
      )[0].username
    }?start=set_reply`
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
