start_command = 
    .description = بدء استخدام البوت
language_command = 
    .description = تغيير اللغة
welcome = 👋🏻  اهلا!
language = 
    .select = 🌐 الرجاء اختيار اللغة
    .changed = ✅ تم تغيير اللغة الى العربية بنجاح!
token_received = 
    .new_bot = تم إضافة بوت جديد، بوت <b>{ $firstName }</b> وهو @{ $username }!
    .updated_bot = تم تحديث البوت <b>{ $firstName }</b> وهو @{ $username }!
    .invalid = توكن غير صالح!
my_bots = 
    .bots_count =
        { NUMBER($botsCount) ->
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
           *[other] لدبك  <b>{ $botsCount }</b> بوت.
        }
message = 
    .edited = رسالة معدلة
message_delivery = 
    .success = تم ارسال الرسالة بنجاح!
    .failed = فشل ارسال الرسالة!
    .message_forwarded = تم توجيه الرسالة بواسطة <b>{ $firstName }</b>!
    .you_are_banned = :( صاحب هذا البوت قام بحظرك
    .user_blocked_bot = فشل في إرسال الرسالة! قام هذا المستخدم بحظر البوت.
    .owner_blocked_bot = قام مالك البوت بحظر البوت الخاص به! 🤦🏻‍♂️
# message_edited_by_sender limited to 0-200 characters
keyboard = 
    .message_edited_by_sender = الرسالة الأصلية هي الرسالة التي تم الرد عليها بهذه الرسالة، هذه هي النسخة الجديدة من الرسالة
    .message_edited_by_sender_buttonText = تم تعديل الرسالة
ban = 
    .how_to_use = قم بالرد على رسالة الشخص الذي تريد حظره باستخدام هذا الامر
    .user_banned_successfully = تم حظر المستخدم بنجاح
unban = 
    .how_to_use = قم بالرد على رسالة الشخص الذي تريد رفع الحظر عنه باستخدام هذا الامر
    .user_unbanned_successfully = تم رفع الحظر عن المستخدم بنجاح
unbanAll = 
    .all_users_unbanned = <b>{ $count }</b> مستخدم تم إلغاء الحظر عنهم!
bot_menu = 
    .broadcast = الاذاعة
    .stats = الاحصائيات
    .replies = الردود
    .group_settings = إعدادات المجموعة
    .delete_bot = 🗑️ حذف بوت
    .back = رجوع🔙
    .mainMenu = 🔝الرئيسية
broadcast_menu = 
    .messageText = خيارات الاذاعة
    .send_to_all = ارسال لجميع المشتركين
    .forward_to_all = توجيه لجميع المشتركين
    .notify_users = ارسال اشعار
replies = 
    .messageText = هنا يمكنك اعدادات الردود
    .set_reply = ➕ اضافة رد جديد
set_reply = 
    .send_trigger =
        ارسل النص الذي تريد انشاء رد تلقائي له
        مثال: السلام عليكم
    .err_set_reply_cant_be_used_as_trigge = /set_reply لا يمكن وضعها ك رد
    .send_context =
        الان ارسل الرد عندما يكتب الشخص ( { $trigger } )
        يمكن ان يكون الرد نص او صورة او فيديو . . . الخ
    .success = ✅ تم انشاء الرد على ( { $trigger } ) بنجاح!
set_group = 
    .messageText = هنا يمكنك تغيير إعدادات مجموعة المشرفين
    .bot_restricted_from_adminsGroup =
        😤 لقد غادرت المجموعة لأن <b>{ $firstName }</b> منعني من إرسال الرسالة في <b>{ $title }</b>
        يرجى عدم منعي من ارستل رسائل في مجموعة التحكم كي اتمكن من ايصال الرسائل.
    .messageTextWithGroupInfo =
        مجموعتك الحالية التي تقوم بإعادة توجيه الرسائل إليها هي
        
        الاسم = <b>{ $title }</b>
        { $inviteLink ->
            [not-provided] ​
           *[other] الرابط = { $inviteLink }
        }
        { $username ->
            [not-provided] ​
           *[other] المعرف = @{ $username }
        }
    .group_set_successfully = <b>{ $title }</b> تم تعيين المجموعة كـ مجموعة ادارة للبوت لرفع اكثر من ادمن في البوت قم باضافة الادمن الجديد الى هذه المجموعة وسيتمكن من الرد على الرسائل.
    .how_to_set = 💬 كيفية تعيين مجموعة
    .how_to_set_url = https://t.me/+bJSfGztNJiU4NWU5
    .how_to_change = 🔃 كيفية تغيير المجموعة
    .how_to_change_url = https://t.me/+bJSfGztNJiU4NWU5
    .delete = 🗑️ حذف
    .confirm_delete_messageText = ❗ تأكيد الحذف!
    .confirm_delete_group_yes = نعم
    .confirm_delete_group_no = لا!
    .group_deleted_successfully_messageText = تم حذف المجموعة بنجاح، من الآن فصاعدا سوف ارسل الرسائل الى محادثتك الخاصة.
delete_bot = 
    .confirm_delete_messageText = هل أنت متأكد من انك تريد حذف هذا البوت!
    .confirm_delete_bot_no = لا!
    .confirm_delete_bot_yes = نعم
    .bot_deleted_successfully_messageText = ✅ تم حذف البوت بنجاح.
