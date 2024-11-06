const strHelpContent =
  "⏰ Token Signal Bot ⏰\n\nThe Token Signal Bot is a powerful Telegram tool for group admins to monitor token contract addresses and set sell amounts effortlessly.\n\nKey Features:\n✅ Admin-Only Commands\n✅ Token Monitoring\n✅ Image Customization\n✅ Emoji Customization\n✅ Instant Notifications\n\nHow to use:\n1. Add this bot in your group\n2. Add CA to the bot  by /add\n3. Upload image for message logo by /upload_img\n4. Upload emoji for message emoji by /upload_emoji\n5. Set min sold USD value to limit messages by /set_min_usd\n6. Remove CA by /remove\n\nAdd this bot to your group now! 🌟";

export const HelpAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);

  await bot.sendMessage(chatId, strHelpContent);
};
