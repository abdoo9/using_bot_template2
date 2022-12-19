import { Composer } from "grammy";
import { Context } from "~/bot/types";
import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";
import { botsService } from "~/services/index";

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

const groupSettingsMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`group_menu.messageText`)
);

const confirmDeleteGroupMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`set_group.confirm_delete_messageText`)
);

const groupDeletedSuccessfullyMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`set_group.group_deleted_successfully_menu`)
);

const repliesMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`replies.messageText`)
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
botMenu.interact((ctx) => ctx.t("bot_menu.stats"), "stats", {
  do: async (ctx) => {
    await ctx.answerCallbackQuery("not implemented yet");
    return false;
  },
});

botMenu.submenu(
  (ctx) => ctx.t("bot_menu.broadcast"),
  "broadcast",
  broadcastOptionsMenu,
  {
    joinLastRow: true,
  }
);

botMenu.submenu(
  (ctx) => ctx.t("bot_menu.group_settings"),
  "group",
  groupSettingsMenu
);

botMenu.submenu((ctx) => ctx.t(`bot_menu.replies`), "replies", repliesMenu);

botMenu.interact((ctx) => ctx.t("bot_menu.delete_bot"), "delete", {
  do: async (ctx) => {
    await ctx.answerCallbackQuery("not implemented yet");
    return false;
  },
});

botMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);
// bot menu end

// repliesMenu start
repliesMenu.url(
  (ctx) => ctx.t("replies.set_reply"),
  (ctx) =>
    `https://t.me/${
      ctx.local.user?.botsOwned.filter(
        (bot) => ctx.match && bot.botId.toString() === ctx.match[1]
      )[0].username
    }?start=set_reply`
);

repliesMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);
// replies menu end

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
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);
// // broadcast options menu end

// group Settings menu  start

groupSettingsMenu.url(
  (ctx) => ctx.t(`set_group.how_to_set`),
  (ctx) => ctx.t(`set_group.how_to_set_url`)
);

groupSettingsMenu.url(
  (ctx) => ctx.t(`set_group.how_to_change`),
  (ctx) => ctx.t(`set_group.how_to_change_url`),
  {
    joinLastRow: true,
  }
);

groupSettingsMenu.submenu(
  (ctx) => ctx.t(`set_group.delete`),
  "delete",
  confirmDeleteGroupMenu
);

groupSettingsMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);
// group Settings menu end

// confirm delete group menu start

confirmDeleteGroupMenu.submenu(
  (ctx) => ctx.t(`set_group.confirm_delete_group_yes`),
  "yes",
  groupDeletedSuccessfullyMenu,
  {
    hide: (ctx) => {
      botsService.updateGroupId(Number(ctx.match?.[1]), null);
      return false;
    },
  }
);

confirmDeleteGroupMenu.interact(
  (ctx) => ctx.t(`set_group.confirm_delete_group_no`),
  "no",
  {
    do: async (ctx) => {
      await ctx.answerCallbackQuery("not implemented yet");
      return "..";
    },
  }
);
// confirm delete group menu end

// confirmDeleteGroupMenu start

groupDeletedSuccessfullyMenu.interact(
  (ctx) => ctx.t(`bot_menu.mainMenu`),
  "back",
  {
    do: () => {
      return "/";
    },
  }
);

// confirmDeleteGroupMenu end

const menuMiddleware = new MenuMiddleware("/", myBotsMenu);
feature.command("mybots", (ctx) => menuMiddleware.replyToContext(ctx));
feature.use(menuMiddleware);
console.log(menuMiddleware.tree());
