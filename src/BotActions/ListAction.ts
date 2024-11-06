import { ADMIN, OWNER, strNoPermition, strNotokenFound } from "../config/config";

export const ListAction = async (
  msg: any,
  bot: any,
  mapData: Map<string, number[]>
) => {
  const channelId = msg.chat.id;
  const chatMember = await bot.getChatMember(channelId, msg.from.id);

  if (chatMember.status === OWNER  || chatMember.status === ADMIN) {
    // Filter keys based on whether msg.chat.id is included in the values
    const tokenList = Array.from(mapData.entries())
      .filter(([key, values]: [string, number[]]) => values.includes(channelId))
      .map(([key]) => key);

    if (tokenList.length > 0) {
      // Create clickable links for each token with underlined formatting
      const tokenListString = tokenList
        .map((item) => `<code>${item}</code>`) // Use <code> for a monospace font
        .join(", ");
      const message = "🎫 List of tokens: \n";

      const response = message + tokenListString;

      await bot.sendMessage(channelId, response, { parse_mode: "HTML" });
    } else {
      await bot.sendMessage(channelId, strNotokenFound);
    }
  } else {
    await bot.sendMessage(channelId, strNoPermition);
  }
};
