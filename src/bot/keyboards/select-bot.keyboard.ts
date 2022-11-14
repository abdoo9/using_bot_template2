// import ISO6391, { LanguageCode } from "iso-639-1";
// import { Menu } from "@grammyjs/menu";

// import { Context } from "~/bot/types";
// import { usersService, botsService } from "~/services";
// import { locales } from "~/bot/helpers/i18n";
// import { logHandle } from "~/bot/helpers/logging";
// import { context } from "../context";

// export const keyboard = new Menu<Context>("bot");

// for (let index = 0; index < 98; index += 1) {
//   keyboard.text(
//     {
//       text: (ctx) => `${ ctx.session.bots.length == 0?  : ctx.session.bots[index].username}`,
//       payload: context.session.bots[index].botId,
//     },
//     logHandle("handle bot selection"),
//     async (ctx) => {
//       const newLanguageCode = ctx.match;

//       if (locales.includes(newLanguageCode)) {
//         await usersService.updateByTelegramId(ctx.from.id, {
//           data: {
//             languageCode: newLanguageCode,
//           },
//         });
//         ctx.session.languageCode = newLanguageCode;

//         await ctx.fluent.renegotiateLocale();

//         await ctx.editMessageText(ctx.t("language.changed"), {
//           reply_markup: keyboard,
//         });
//       }
//     }
//   );

//   if (index % 2 === 0) {
//     keyboard.row();
//   }
// }
