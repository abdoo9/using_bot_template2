import { Menu, MenuRange } from "@grammyjs/menu";

import { Context } from "~/bot/types";

export const keyboard = new Menu<Context>("mybots");
keyboard
  // .url("About", "https://grammy.dev/plugins/menu")
  // .row()
  .dynamic((ctx) => {
    // Generate a part of the menu dynamically!
    const range = new MenuRange<Context>();
    ctx.local.user?.botsOwned?.forEach((bot, i) => {
      range.submenu(
        { text: `@${bot.username}`, payload: String(bot.botId) }, // payload will be availboe through ctx.match
        "bot-settings"
      );
      if (i % 2) range.row();
    });
    return range;
  })
  .row()
  .text("Cancel", (ctx) => ctx.deleteMessage());

const botSettingsKeyboard = new Menu<Context>("bot-settings");
botSettingsKeyboard

  .text((ctx) => ctx.t(`keyboard.status`))
  .text((ctx) => ctx.t(`keyboard.broadcast`))
  .row()
  .submenu((ctx) => ctx.t(`keyboard.replys`), "bot-replys");

keyboard.register(botSettingsKeyboard);
