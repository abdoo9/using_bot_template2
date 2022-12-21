start_command = 
    .description = Start the bot
language_command = 
    .description = Change language

welcome = 👋🏻  Welcome!
language = 
    .select = Please, select your language
    .changed = Language successfully changed!

token_received = 
    .new_bot = New bot added, your bot {$firstName} which is @{$username}!
    .updated_bot = Bot updated your bot {$firstName} which is @{$username}!
    .invalid = Invalid token

my_bots = 
    .bots_count = { NUMBER($botsCount) ->
      [0] it seems that you have no bots yet. \n to add a new bot, use the /addBot command
      [1] you have one bot.
      [2] you have {$botsCount} bots.
      *[other] you have {$botsCount} bots.
    }

message =
    .edited = message edited
    
message_delivery = 
    .success = Message successfully sent!
    .failed = Message failed to send!
    .message_forwarded = Message forwarded by {$firstName}!
    .you_are_banned = :( the bot owner have banned you from sending messages to him.
    
ban = 
    .how_to_use = reply to the message of the user that you want to ban with this command
    .user_banned_successfully = user have been banned successfully
    
unban = 
    .how_to_use = reply to the message of the user that you want to unban with this command
    .user_unbanned_successfully = user have been unbanned successfully

unbanAll = 
    .all_users_unbanned = { $count } users have been unbanned!

bot_menu =
    .broadcast = broadcast
    .stats = stats
    .replies = replies
    .group_settings = group settings
    .delete_bot = delete bot
    .back = 🔙back
    .mainMenu = 🔝main menu

broadcast_menu =
    .messageText = broadcast options
    .send_to_all = send message to all users
    .forward_to_all = forward message to all users
    .notify_users = notify users

replies =
    .messageText = replies explained
    .set_reply = add new reply

set_reply=
    .send_trigger = please send the text that the user will send to trigger the reply 
                    for example: /start or hello
    .err_set_reply_cant_be_used_as_trigge = /set_reply can be used as trigger
    .send_context = please send the reply message that you want the user to see when he send ( { $trigger } )
    .success = reply for ( { $trigger } ) has been set successfully!

set_group=
    .messageText = here you can change the settings of the admins group
    .group_set_successfully = { $title } have been set successfully from now on I'll forward all messages to here.
    .how_to_set = how to set group
    .how_to_set_url = https://t.me/+bJSfGztNJiU4NWU5
    .how_to_change = how to chage group
    .how_to_change_url = https://t.me/+bJSfGztNJiU4NWU5
    .delete = delete
    .confirm_delete_messageText = confirm delete!
    .confirm_delete_group_yes = yes
    .confirm_delete_group_no = No!
    .group_deleted_successfully_messageText = the group have been deleted successfully, from now on I'll forward messages to your private chat

delete_bot =
    .confirm_delete_messageText = are you sure about deleting this bot!
    .confirm_delete_bot_no = NO!
    .confirm_delete_bot_yes = yes
    .bot_deleted_successfully_messageText = the bot have been deleted successfully.
