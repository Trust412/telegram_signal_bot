import {
  strPlzEnterCA,
  strInvalidTokenCA,
  strNoPermition,
  OWNER,
  REPLY_MODE,
  ADMIN,
} from "../config/config";

// this is the function for add contract address
export const AddAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);
  // check chat member is owner or admin
  if (chatMember.status === OWNER || chatMember.status === ADMIN) {
    await bot.sendMessage(chatId, strPlzEnterCA, REPLY_MODE);
  } else {
    // no permission
    await bot.sendMessage(channelId, strNoPermition);
  }
};
