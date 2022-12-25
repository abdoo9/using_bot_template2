import { Menu } from "@grammyjs/menu";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";

export const keyboard = new Menu<Context>("messageEditedBySenderKeyboard");

keyboard.text(
  (ctx) => ctx.t(`keyboard.message_edited_by_sender_buttonText`),
  logHandle("handle message_edited_by_sender button press"),
  (ctx) =>
    ctx.answerCallbackQuery({
      text: ctx.t(`keyboard.message_edited_by_sender`),
      show_alert: true,
    })
);
