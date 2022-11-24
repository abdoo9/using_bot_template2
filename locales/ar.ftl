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
    
    