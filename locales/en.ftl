start_command = 
    .description = Start the bot
language_command = 
    .description = Change language

welcome = 👋🏻  Welcome!
language = 
    .select = Please, select your language
    .changed = Language successfully changed!

token_received = 
    .new_bot = New bot added your bot {$firstName} which is @{$username}!
    .updated_bot = Bot updated your bot {$firstName} which is @{$username}!
    .invalid = Invalid token

my_bots = 
    .bots_count = { NUMBER($botsCount) ->
      [0] it seems that you have no bots yet. \n to add a new bot, use the /addBot command
      [1] you have one bot.
      [2] you have {$botsCount} bots.
      *[other] you have {$botsCount} bots.
    }

message_delivery = 
    .success = Message successfully sent!
    .failed = Message failed to send!
    .message_forwarded = Message forwarded by {$firstName}!
    