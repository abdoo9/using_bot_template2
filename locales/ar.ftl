start_command = 
    .description = بدء استخدام البوت
language_command = 
    .description = تغيير اللغة

welcome = 👋🏻  اهلا!
language = 
    .select = الرجاء اختيار اللغة
    .changed = تم تغيير اللغة الى العربية

token_received = 
    .new_bot = تم اضافة بوت جديد {$firstName}
     وهو @{$username}!
    .updated_bot = تم تحديث بيانات البوت {$firstName} 
    الذي هو @{$username}!
    .invalid = توكن غير صالح!

my_bots = 
    .bots_count = { NUMBER($botsCount) ->
      [0] لا يوجد لديت بوت! لاضافة بوت جديد استخدم امر /addBot
      [1] لديك بوت واحد.
      [2] لديك بوتان اثنان.
      *[other] لدبك {$botsCount} بوت.
    }

message_delivery = 
    .success = تم ارسال الرسالة بنجاح!
    .failed = فشل ارسال الرسالة!
    .message_forwarded = رسالة محولة بواسطة {$firstName}!
    .you_are_banned = :( صاحب هذا البوت قام بحظرك
    
ban = 
    .how_to_use = قم بالرد على رسالة الشخص الذي تريد حظره باستخدام هذا الامر
    .user_banned_successfully = تم حظر المستخدم بنجاح
    
unban = 
    .how_to_use =  قم بالرد على رسالة الشخص الذي تريد رفع الحظر عنه باستخدام هذا الامر
    .user_unbanned_successfully = تم رفع الحظر عن المستخدم بنجاح

unbanAll = 
    .all_users_unbanned = { $count } مستخدم تم رفع الحظر عنهم!   
    
keyboard =
    .stats = الاحصائيات
    .replies = الردود
    .back = رجوع🔙
    .mainMenu = 🔝الرئيسية

broadcast_menu =
    .broadcast = الاذاعة
    .messageText = خيارات الاذاعة
    .send_to_all = send message to all users
    .forward_to_all = forward message to all users
    .notify_users = ارسال اشعار