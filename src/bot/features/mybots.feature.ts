import { Composer } from "grammy";
import { Context } from "~/bot/types";
import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";
import { botsService, chatsService } from "~/services/index";
import { extractGroupId } from "~/bot/helpers/extract-group-id";
import { ChatFromGetChat } from "grammy/types";
import { escapeHTML } from "~/bot/helpers/escape-html";

// TODO: seperate these menus into files in /menus

export const composer = new Composer<Context>();
const feature = composer.chatType("private");
// TODO:make botmaker only capable of doing this
// .filter(
//   (ctx) =>
//     ctx.local.bot?.type === "USER_OWNED_MAKER" ||
//     ctx.local.bot?.type === "OWNER_OWNED_MAKER"
// );

const startMenu = new MenuTemplate<Context>(
  (ctx) => `Hey ${ctx.from?.first_name}!`
);

const addBotMenu = new MenuTemplate<Context>((ctx) => {
  return { text: `Hey ${ctx.from?.first_name}!`, parse_mode: "HTML" };
});

const myBotsMenu = new MenuTemplate<Context>((ctx) => {
  return {
    text: ctx.t(`my_bots.bots_count`, {
      botsCount: ctx.local.user?.botsOwned.length || 0,
    }),
    parse_mode: "HTML",
  };
});

const botMenu = new MenuTemplate<Context>(
  (ctx) => `You chose city ${ctx.match}`
);

const broadcastOptionsMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`broadcast_menu.messageText`)
);

const groupSettingsMenu = new MenuTemplate<Context>(async (ctx) => {
  const groupId = await extractGroupId(ctx);
  try {
    if (groupId) {
      const adminsGroup = (await ctx.api.getChat(Number(groupId))) as Extract<
        ChatFromGetChat,
        { type: "supergroup" }
      >;
      if (adminsGroup) {
        const { title, invite_link: inviteLink, username } = adminsGroup;
        return {
          text: ctx.t(`set_group.messageTextWithGroupInfo`, {
            title: escapeHTML(title),
            username: username || "not-provided",
            inviteLink: inviteLink || "not-provided",
          }),
          parse_mode: "HTML",
        };
      }
    }
    return ctx.t(`set_group.messageText`);
  } catch (e: any) {
    if (e.description === "Bad Request: chat not found") {
      await chatsService.disconnectAdminsGroup(
        Number(ctx.local.bot?.groupId),
        Number(ctx.match?.[1])
      );
    }
    return ctx.t(`set_group.messageText`);
  }
});

const confirmDeleteGroupMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`set_group.confirm_delete_messageText`)
);

const confirmDeleteBotMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`delete_bot.confirm_delete_messageText`)
);

const groupDeletedSuccessfullyMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`set_group.group_deleted_successfully_messageText`)
);

const botDeletedSuccessfullyMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`delete_bot.bot_deleted_successfully_messageText`)
);

const repliesMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`replies.messageText`)
);

const forceSubMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`forceSubMenu.messageText`)
);

const forceSubGroupMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`forceSubGroupMenu.messageText`)
);

const forceSubChannelMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`forceSubGroupMenu.messageText`)
);

const forceSubChannelsMenu = new MenuTemplate<Context>((ctx) =>
  ctx.t(`forceSubGroupMenu.messageText`)
);
// start menu start
startMenu.submenu((ctx) => ctx.t(`start_menu.add_bot`), "addbot", addBotMenu);

startMenu.submenu((ctx) => ctx.t(`start_menu.my_bots`), "mybots", myBotsMenu, {
  joinLastRow: true,
});

// start menu end

// my botsMenu start
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

myBotsMenu.submenu((ctx) => ctx.t(`start_menu.add_bot`), "addbot", addBotMenu, {
  hide: (ctx) => ctx.local.user?.botsOwned.length !== 0,
});
// mybotsmenu end

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

botMenu.submenu((ctx) => ctx.t(`bot_menu.replies`), "replies", repliesMenu, {
  joinLastRow: true,
});

botMenu.submenu(
  (ctx) => ctx.t(`bot_menu.force_subscribe`),
  "force_sub",
  forceSubMenu
);
botMenu.submenu(
  (ctx) => ctx.t("bot_menu.delete_bot"),
  "delete",
  confirmDeleteBotMenu
);

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
  confirmDeleteGroupMenu,
  {
    hide: async (ctx) => !(await extractGroupId(ctx)),
  }
);

groupSettingsMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);
// group Settings menu end
// force sub menu start

forceSubMenu.submenu(
  (ctx) => ctx.t("force_sub_channel.add_channel"),
  "addChannel",
  forceSubChannelMenu
);

forceSubMenu.submenu(
  (ctx) => ctx.t("force_sub_group.add_group"),
  "addGroup",
  forceSubGroupMenu
);

forceSubMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.t(`bot_menu.back`),
    (ctx) => ctx.t(`bot_menu.mainMenu`)
  )
);

// force sub menu end

// forceSubChannelMenu start

forceSubChannelMenu.chooseIntoSubmenu(
  "ch",
  async (ctx) => {
    const bot = await botsService.findBotChannels(Number(ctx.match?.[1]));
    return (
      bot?.botChats.reduce((acc, botChat) => {
        return { ...acc, [String(botChat.chatId)]: `@${botChat.chat.title}` };
      }, {}) || []
    );
  },
  forceSubChannelsMenu
);

// forceSubChannelMenu end

// confirm delete group menu start

confirmDeleteGroupMenu.submenu(
  (ctx) => ctx.t(`set_group.confirm_delete_group_yes`),
  "yes",
  groupDeletedSuccessfullyMenu
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

// groupDeletedSuccessfullyMenu start

groupDeletedSuccessfullyMenu.interact(
  async (ctx) => {
    const groupId = await extractGroupId(ctx);
    if (Number(groupId) < -100)
      // cause Number(null) = 0 and group id is always -bigNumber
      await chatsService.disconnectAdminsGroup(
        Number(ctx.local.bot?.groupId),
        Number(ctx.match?.[1])
      );
    return ctx.t(`bot_menu.mainMenu`);
  },
  "back",
  {
    do: () => {
      return "/";
    },
  }
);

// groupDeletedSuccessfullyMenu end

// botDeletedSuccessfullyMenu start

botDeletedSuccessfullyMenu.interact(
  async (ctx) => {
    await botsService.makeBotNotActive(Number(ctx.match?.[1])); // TODO: when bot is not active make it not answer any updates, when token is sent make it active again
    return ctx.t(`bot_menu.mainMenu`);
  },
  "back",
  {
    do: () => {
      return "/";
    },
  }
);
// botDeletedSuccessfullyMenu end

confirmDeleteBotMenu.submenu(
  (ctx) => {
    return ctx.t(`delete_bot.confirm_delete_bot_yes`);
  },
  "yes",
  botDeletedSuccessfullyMenu
);

confirmDeleteBotMenu.interact(
  (ctx) => ctx.t(`delete_bot.confirm_delete_bot_no`),
  "no",
  {
    do: async (ctx) => {
      await ctx.answerCallbackQuery("not implemented yet");
      return "..";
    },
  }
);

const menuMiddleware = new MenuMiddleware("/", startMenu);
feature.command("start", (ctx) => menuMiddleware.replyToContext(ctx));
feature.use(menuMiddleware);
// eslint-disable-next-line no-console
console.log(menuMiddleware.tree());
