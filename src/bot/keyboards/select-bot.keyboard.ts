import { Menu, MenuRange } from "@grammyjs/menu";

import { Context } from "~/bot/types";

export const keyboard = new Menu("mybots");
keyboard
  .url("About", "https://grammy.dev/plugins/menu")
  .row()
  .dynamic(() => {
    // Generate a part of the menu dynamically!
    const range = new MenuRange();
    for (let i = 0; i < 3; i += 1) {
      range.text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`)).row();
    }
    return range;
  })
  .text("Cancel", (ctx) => ctx.deleteMessage());
