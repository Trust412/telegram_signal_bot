import TelegramBot from "node-telegram-bot-api";
import {
  IMAGESIZE,
  strPlzEnterCA,
  strAlreadyExistCA,
  strExceedImageSize,
  strInvalidTokenCA,
  strPlzInputRemoveCA,
  strPlzUploadValidImage,
  strSuccessImageUpload,
  TELEGRAM_TOKEN,
  strPlzUploadImg,
  defaultIMGURL,
  strAddedSuccessfully,
  strRemovedSuccessfully,
  strCAnotExist,
  REPLY_MODE,
  CYCLE,
  strPlzSetMiniSol,
  strLargerThan1,
  strSuccessSetMinSol,
  strInvalidMinSol,
  strExceedCANumber,
  strNotassociateCA,
  CA_SIZE,
  strPlzUploadEmoji,
  strSuccessEmojiUpload,
  strPlzUploadValidEmoji,
  STICKER,
  IMAGE,
  GIF,
  DEFAULT_USD,
  WSOL,
  strPlzUploadShortEmoji,
  strBotRunning,
  strBotDM,
} from "./src/config/config";
import { AddAction } from "./src/BotActions/AddAction";
import { checkIsNumber, isEmoji, isSPL_CA } from "./utils";
import { UploadAction, UploadEmojiAction } from "./src/BotActions/UploadAction";
import { ListAction } from "./src/BotActions/ListAction";
import { RemoveAction } from "./src/BotActions/RemoveAction";
import { moniterSPL } from "./src/monitor/MoniterSPL";
import { SetAction } from "./src/BotActions/SetAction";
import { logger } from "./src/utils/logger";
import { HelpAction } from "./src/BotActions/HelpAction";

const defaultIMG = defaultIMGURL;
const token = TELEGRAM_TOKEN;

let bot: any;
//  (CA, [channelId, channelId, ...])
let mapData = new Map();

// (channelId, image)
let mapImage = new Map();

let mapImageType = new Map();

// (channelId, image)
let mapEmoji = new Map();

// (CA, last)
let mapLastSignature = new Map();

// (channelId, min-sol)
let mapMinSol = new Map();

// (channelId, number of CA)
let mapNumCA = new Map();

const BotMenu = [
  { command: "add", description: "➕ Add token" },
  { command: "upload_img", description: "📤 Upload Image(jpg, png, gif)" },
  { command: "upload_emoji", description: "😄 Upload Emoji" },
  { command: "list", description: "📋 List token" },
  {
    command: "set_min_usd",
    description: `⚙️ Set min USD(default $${DEFAULT_USD})`,
  },
  { command: "remove", description: "❌ Remove token" },
  { command: "help", description: "❔ Help" },
];

const start_bot = async () => {
  if (!token) return;
  try {
    bot = new TelegramBot(token, { polling: true });

    bot.setMyCommands(BotMenu);

    bot.on("message", async (msg: any) => {
      // add contract address

      // set username for log
      const username = msg.from.username || "Username";
      if (!msg.reply_to_message) return;
      if (
        msg.reply_to_message.text === strPlzEnterCA ||
        msg.reply_to_message.text === strInvalidTokenCA ||
        msg.reply_to_message.text === strAlreadyExistCA
      ) {
        const CA = msg.text; // CA is now the key
        const channelId = msg.chat.id;
        if (!CA) return;
        if (CA === WSOL)
          await bot.sendMessage(channelId, strInvalidTokenCA, REPLY_MODE);
        if (!isSPL_CA(CA)) {
          await bot.sendMessage(channelId, strInvalidTokenCA, REPLY_MODE);
        } else {
          // check if the added ca number is lager than CA_SIZE
          if (mapNumCA.get(channelId) >= CA_SIZE)
            return await bot.sendMessage(channelId, strExceedCANumber);

          // get the current number of CA for the channelId
          const curNumCA = mapNumCA.get(channelId) || 0;

          if (mapData.has(CA)) {
            // If CA already exists, check if the channelId is already in the array
            if (mapData.get(CA).includes(channelId)) {
              await bot.sendMessage(channelId, strAlreadyExistCA, REPLY_MODE);
            } else {
              // If channelId is not in the array, push it into the existing array
              mapData.get(CA).push(channelId);
              mapNumCA.set(channelId, curNumCA + 1);
              await bot.sendMessage(channelId, strAddedSuccessfully);

              logger.info(
                username +
                  " [ ADD ] CA:" +
                  CA +
                  " id:" +
                  channelId +
                  " Successed."
              );
            }
          } else {
            // If CA doesn't exist, create a new array with channelId
            mapData.set(CA, [channelId]);
            mapMinSol.set(CA, DEFAULT_USD);
            mapNumCA.set(channelId, curNumCA + 1);

            // set last signature as selected ca
            setMapLastSignature(CA, mapLastSignature.get(CA));

            //
            await bot.sendMessage(channelId, strAddedSuccessfully);
            logger.info(
              username +
                " [ ADD ] CA:" +
                CA +
                " id:" +
                channelId +
                " Successed."
            );
          }
        }
      }

      //--------------- image upload  ------------------
      if (msg.reply_to_message.text === strPlzUploadImg) {
        const channelId = msg.chat.id;
        if (msg.photo && msg.photo.length > 0) {
          const photoArray = msg.photo;
          const largestPhoto = photoArray[photoArray.length - 1]; // The last one is the largest
          try {
            // Get the file information
            const fileInfo = await bot.getFile(largestPhoto.file_id);
            const fileSize = fileInfo.file_size; // Size in bytes
            if (fileSize && fileSize < IMAGESIZE) {
              // Store the image in the map
              mapImage.set(channelId, largestPhoto); // Store the largest photo directly
              mapImageType.set(channelId, IMAGE);
              // Optionally, send back the image or a confirmation message
              await bot.sendMessage(channelId, strSuccessImageUpload);
              logger.info(
                username + " [ UPLOAD ] Photo id:" + channelId + " Successed."
              );
            } else {
              await bot.sendMessage(channelId, strExceedImageSize);
            }
          } catch (error) {
            await bot.sendMessage(
              channelId,
              "❗️ There was an error processing your image. Please try again."
            );
          }
        } else if (msg.animation) {
          const animationArray = msg.animation;
          // console.log("animation===", animationArray);
          try {
            // Get the file information
            const fileInfo = await bot.getFile(
              animationArray.thumbnail.file_id
            );
            // console.log("animation===", fileInfo);
            const fileSize = fileInfo.file_size; // Size in bytes
            if (fileSize && fileSize < IMAGESIZE) {
              // Store the image in the map
              mapImage.set(channelId, animationArray); // Store the largest photo directly
              mapImageType.set(channelId, GIF);
              // Optionally, send back the image or a confirmation message
              await bot.sendMessage(channelId, strSuccessImageUpload);
              logger.info(
                username + " [ UPLOAD ] gif id:" + channelId + " Successed."
              );
            } else {
              await bot.sendMessage(channelId, strExceedImageSize);
            }
          } catch (error) {
            await bot.sendMessage(
              channelId,
              "❗️ There was an error processing your image. Please try again."
            );
          }
        } else if (msg.sticker) {
          // Handle sticker uploads
          const stickerFileId = msg.sticker.file_id;

          try {
            const fileInfo = await bot.getFile(stickerFileId);
            const fileSize = fileInfo.file_size; // Size in bytes

            // Optionally, you can set a size limit for stickers as well
            if (fileSize && fileSize < IMAGESIZE) {
              let tmpImg = stickerFileId;
              mapImageType.set(channelId, STICKER);
              mapImage.set(channelId, tmpImg); // Store the sticker
              // console.log(mapImage.get(channelId));
              await bot.sendMessage(channelId, strSuccessImageUpload);
              logger.info(
                username + " [ UPLOAD ] Emoji id:" + channelId + " Successed."
              );
            } else {
              await bot.sendMessage(channelId, strExceedImageSize);
            }
          } catch (error) {
            await bot.sendMessage(
              channelId,
              "❗️ There was an error processing your sticker. Please try again."
            );
          }
        } else {
          await bot.sendMessage(channelId, strPlzUploadValidImage);
        }
      }

      //--------------- emoji upload  ------------------

      if (
        msg.reply_to_message.text === strPlzUploadEmoji ||
        msg.reply_to_message.text === strPlzUploadShortEmoji
      ) {
        const channelId = msg.chat.id;

        // Check if the message contains a sticker
        if (msg.text && isEmoji(msg.text)) {
          const _emoji = msg.text;
          if (_emoji.length > 4) {
            await bot.sendMessage(
              channelId,
              strPlzUploadShortEmoji,
              REPLY_MODE
            );
          } else
            try {
              mapEmoji.set(channelId, _emoji);
              // Optionally, send back the image or a confirmation message
              await bot.sendMessage(
                channelId,
                strSuccessEmojiUpload + " " + _emoji
              );
              logger.info(
                username + " [ UPLOAD ] id:" + channelId + " Successed."
              );
            } catch (error) {
              await bot.sendMessage(
                channelId,
                "❗️ There was an error processing your emoji. Please try again."
              );
            }
        } else {
          await bot.sendMessage(channelId, strPlzUploadValidEmoji);
        }
      }

      //--------------- set mini sol  ------------------
      if (msg.reply_to_message.text === strPlzSetMiniSol) {
        const channelId = msg.chat.id;
        const minSol = msg.text;
        if (checkIsNumber(minSol)) {
          // check if the min sol is larger than default 0.5
          if (minSol < DEFAULT_USD) {
            // must be lager than default
            await bot.sendMessage(channelId, strLargerThan1);
          } else {
            // set min Sol
            mapMinSol.set(channelId, minSol);
            await bot.sendMessage(channelId, strSuccessSetMinSol);
            logger.info(
              username +
                " [ SET ] SOL:" +
                minSol +
                " id: " +
                channelId +
                " Successed."
            );
          }
        } else {
          await bot.sendMessage(channelId, strInvalidMinSol);
        }
      }

      // ------------------ remove ------------------
      if (msg.reply_to_message.text === strPlzInputRemoveCA) {
        const CA = msg.text; // Assuming CA is provided in the message
        const channelId = msg.chat.id;

        if (mapData.has(CA)) {
          const channelIds = mapData.get(CA);
          const index = channelIds.indexOf(channelId);

          if (index !== -1) {
            // Remove the channelId from the array
            channelIds.splice(index, 1);
            await bot.sendMessage(channelId, strRemovedSuccessfully);
            logger.info(
              username +
                " [ DEL ] CA:" +
                CA +
                " id:" +
                channelId +
                " Successed."
            );
            mapNumCA.set(channelId, mapNumCA.get(channelId) - 1);
            // Optionally, remove CA if no channelId is left
            if (channelIds.length === 0) {
              mapData.delete(CA);
            }
          } else {
            await bot.sendMessage(channelId, strNotassociateCA);
          }
        } else {
          await bot.sendMessage(channelId, strCAnotExist);
        }
      }
    });

    bot.onText(/\/start/, async (msg: any) => {
      const chatId = msg.chat.id;
      console.log("start cmd");
      if (msg.chat.type === "private") {
        // bot.sendMessage(chatId, strBotDM);
        try {
          await bot.sendAnimation(chatId, defaultIMG.file_id, {
            duration: defaultIMG.duration || 2,
            width: defaultIMG.width || 640,
            height: defaultIMG.height || 640,
            thumb: defaultIMG.thumb.file_id,
            caption: strBotDM, // Add the caption here
            parse_mode: "HTML",
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        bot.sendMessage(chatId, strBotRunning);
      }
    });

    bot.onText(/\/help/, async (msg: any) => {
      HelpAction(msg, bot);
    });

    // add cmd for add CA
    bot.onText(/\/add/, async (msg: any) => {
      AddAction(msg, bot);
    });

    // upload cmd for image upload
    bot.onText(/\/upload_img/, async (msg: any) => {
      UploadAction(msg, bot);
    });

    // upload cmd for emoji upload
    bot.onText(/\/upload_emoji/, async (msg: any) => {
      UploadEmojiAction(msg, bot);
    });

    // list cmd for check list
    bot.onText(/\/list/, async (msg: any) => {
      ListAction(msg, bot, mapData);
    });

    // remove cmd for remove CA
    bot.onText(/\/remove/, async (msg: any) => {
      RemoveAction(msg, bot);
    });

    // set cmd for set min sol
    bot.onText(/\/set_min_usd/, async (msg: any) => {
      SetAction(msg, bot);
    });

    console.log("Bot is running...");
  } catch (error) {
    console.log("Bot is running error");
  }
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const start_monitor = async () => {
  if (Date.now() % (1000 * 3600) <= CYCLE)
    logger.info("Bot is running well..."); // hourly log for bot is running well
  try {
    // logger.info("start_monitor called...");
    for (const ca of mapData.keys()) {
      moniterSPL(ca, mapLastSignature.get(ca));
    }
    await delay(CYCLE);
    start_monitor();
  } catch (error) {
    // if bot is crashed, delay 3s and restart
    await delay(CYCLE * 3);
    logger.info("start_monitor restart");
    start_monitor();
  }
};

export const getChannelsfromCA = (CA: string) => {
  return mapData.get(CA);
};
export const getImagefromCid = (ChannelId: string) => {
  return mapImage.get(ChannelId);
};
export const getMinSolfromCid = (ChannelId: string) => {
  return mapMinSol.get(ChannelId);
};

export const getEmojifromCid = (channelId: string) => {
  return mapEmoji.get(channelId);
};

export const setMapLastSignature = (ca: string, value: string) => {
  mapLastSignature.set(ca, value);
};

export const getLastSignature = (ca: string) => mapLastSignature.get(ca);

// alarm for only one channel
export const CreateAlarm = async (CA: any, Content: any, channel: any) => {
  try {
    const channelImg = getImagefromCid(channel);

    if (mapImageType.get(channel) === STICKER) {
      await bot.sendSticker(channel, channelImg, {
        caption: Content,
        parse_mode: "HTML",
      });
    } else {
      let _img;
      if (mapImageType.get(channel) === IMAGE) {
        _img = channelImg?.file_id;
        // console.log("photo", _img);

        await bot.sendPhoto(channel, _img, {
          caption: Content,
          parse_mode: "HTML",
        });
      } else if (mapImageType.get(channel) === GIF) {
        _img = channelImg;
        // console.log("animation", _img);
        try {
          await bot.sendAnimation(channel, channelImg.file_id, {
            duration: channelImg.duration || 2,
            width: channelImg.width || 640,
            height: channelImg.height || 640,
            thumb: channelImg.thumb.file_id,
            caption: Content, // Add the caption here
            parse_mode: "HTML",
          });
        } catch (error) {
          console.log("send animation err");
        }
      } else {
        _img = defaultIMG;

        try {
          await bot.sendAnimation(channel, _img.file_id, {
            duration: _img.duration || 2,
            width: _img.width || 640,
            height: _img.height || 640,
            thumb: _img.thumb.file_id,
            caption: Content, // Add the caption here
            parse_mode: "HTML",
          });
        } catch (error) {
          console.log(error);
        }
        // static image
        // await bot.sendPhoto(channel, _img, {
        //   caption: Content,
        //   parse_mode: "HTML",
        // });
      }

      // console.log("alarm sendphoto", _img);
    }

    await delay(200);
  } catch (error) {
    logger.info("[ERR] alarm err index.ts 515");
  }
};

const main = () => {
  logger.info("\n ---------- start bot ---------- \n");
  start_bot();
  start_monitor();
};

main();
