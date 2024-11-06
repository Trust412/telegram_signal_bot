import {
  ADMIN,
  OWNER,
  REPLY_MODE,
  strNoPermition,
  strPlzUploadEmoji,
  strPlzUploadImg,
} from "../config/config";

export const UploadAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);
  if (chatMember.status === OWNER || chatMember.status === ADMIN) {
    await bot.sendMessage(chatId, strPlzUploadImg, REPLY_MODE);
  } else {
    await bot.sendMessage(channelId, strNoPermition);
  }
};

export const UploadEmojiAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);
  if (chatMember.status === OWNER || chatMember.status === ADMIN) {
    await bot.sendMessage(chatId, strPlzUploadEmoji, REPLY_MODE);
  } else {
    await bot.sendMessage(channelId, strNoPermition);
  }
};
