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
      [3] لديك ثلاث بوتات.
      [4] لديك اربع بوتات.
      [5] لديك خمس بوتات.
      [6] لديك ست بوتات.
      [7] لديك سبع بوتات.
      [8] لديك ثمان بوتات.
      [9] لديك تسع بوتات.
      [10] لديك عشر بوتات.
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
    .send_to_all = ارسال لجميع المشتركين
    .forward_to_all = توجيه لجميع المشتركين
    .notify_users = ارسال اشعار

set_reply=
    .send_trigger = ارسل النص الذي تريد انشاء رد تلقائي له
                    مثال: السلام عليكم
    .err_set_reply_cant_be_used_as_trigge = /set_reply لا يمكن وضعها ك رد
    .send_context = الان ارسل الرد عندما يكتب الشخص ( { $trigger } )
                    يمكن ان يكون الرد نص او صورة او فيديو . . . الخ
    .success = تم انشاء الرد على ( { $trigger } ) بنجاح!

set_group=
    .group_set_successfully = { $title } have been set successfully from now on I'll forward all messages to here.