import { Menu, MenuRange } from "@grammyjs/menu";
import { Context } from "~/bot/types";
import { subscriptionsService } from "~/services/index";
import {
  MenuTemplate,
  MenuMiddleware,
  createBackMainMenuButtons,
} from "grammy-inline-menu";

const menuTemplate = new MenuTemplate<Context>(() => `Hey !`);

menuTemplate.interact("I am excited!", "unique", {
  do: async (ctx) => {
    await ctx.reply("As am I!");
    return false;
  },
});

let mediaOption = "photo1";
const mediaMenu = new MenuTemplate<Context>(() => {
  if (mediaOption === "video") {
    return {
      type: "video",
      media: "https://telegram.org/img/t_main_Android_demo.mp4",
      text: "Just a caption for a video",
    };
  }

  if (mediaOption === "animation") {
    return {
      type: "animation",
      media: "https://telegram.org/img/t_main_Android_demo.mp4",
      text: "Just a caption for an animation",
    };
  }

  if (mediaOption === "photo2") {
    return {
      type: "photo",
      media: "https://telegram.org/img/SiteAndroid.jpg",
      text: "Just a caption for a *photo*",
      parse_mode: "Markdown",
    };
  }

  if (mediaOption === "document") {
    return {
      type: "document",
      media:
        "https://telegram.org/file/464001088/1/bI7AJLo7oX4.287931.zip/374fe3b0a59dc60005",
      text: "Just a caption for a <b>document</b>",
      parse_mode: "HTML",
    };
  }

  if (mediaOption === "location") {
    return {
      // Some point with simple coordinates in Hamburg, Germany
      location: {
        latitude: 53.5,
        longitude: 10,
      },
      live_period: 60,
    };
  }

  if (mediaOption === "venue") {
    return {
      venue: {
        location: {
          latitude: 53.5,
          longitude: 10,
        },
        title: "simple coordinates point",
        address: "Hamburg, Germany",
      },
    };
  }

  if (mediaOption === "just text") {
    return {
      text: "Just some text",
    };
  }

  return {
    type: "photo",
    media: "https://telegram.org/img/SiteiOs.jpg",
  };
});
mediaMenu.interact("Just a button", "randomButton", {
  async do(ctx) {
    await ctx.answerCallbackQuery({ text: "Just a callback query answer" });
    return false;
  },
});
mediaMenu.select(
  "type",
  [
    "animation",
    "document",
    "photo1",
    "photo2",
    "video",
    "location",
    "venue",
    "just text",
  ],
  {
    columns: 2,
    isSet: (_, key) => mediaOption === key,
    set(_, key) {
      mediaOption = key;
      return true;
    },
  }
);
mediaMenu.manualRow(createBackMainMenuButtons());

menuTemplate.submenu("Media Menu", "media", mediaMenu);

export const keyboard = new MenuMiddleware("/", menuTemplate);
//console.log(keyboard.tree());
// new Menu<Context>("mybots")
//   .dynamic((ctx) => {
//     // Generate a part of the menu dynamically!
//     const range = new MenuRange<Context>();
//     ctx.local.user?.botsOwned?.forEach((bot, i) => {
//       range.submenu(
//         { text: `@${bot.username}`, payload: String(bot.botId) }, // payload will be availboe through ctx.match
//         "bot-settings"
//       );
//       if (i % 2) range.row();
//     });
//     return range;
//   })
//   .row()
//   .text("Cancel", (ctx) => ctx.deleteMessage());

// const botSettingsKeyboard = new Menu<Context>("bot-settings")
//   .submenu(
//     (ctx) => ctx.t(`keyboard.status`),
//     "bot-status",
//     async (ctx) =>
//       ctx.editMessageText(
//         `this bot has ${await subscriptionsService.botStats(ctx.me.id)} users`
//       )
//   )
//   .submenu((ctx) => ctx.t(`keyboard.broadcast`), "bot-broadcast")
//   .row()
//   .submenu((ctx) => ctx.t(`keyboard.replies`), "bot-replies")
//   .row()
//   .back((ctx) => ctx.t(`keyboard.back`));

// keyboard.register(botSettingsKeyboard);

// const botStatusKeyboard = new Menu<Context>("bot-status").back((ctx) =>
//   ctx.t(`keyboard.back`)
// );

// botSettingsKeyboard.register(botStatusKeyboard);

// const botBroadcastKeyboard = new Menu<Context>("bot-broadcast").back((ctx) =>
//   ctx.t(`keyboard.back`)
// );

// botSettingsKeyboard.register(botBroadcastKeyboard);

// const botRepliesKeyboard = new Menu<Context>("bot-replies").back((ctx) =>
//   ctx.t(`keyboard.back`)
// );

// botSettingsKeyboard.register(botRepliesKeyboard);
