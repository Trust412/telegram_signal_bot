import { Connection } from "@solana/web3.js";

import * as dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL || "";
const WSS_URL = process.env.WSS_URL || "";

export const connection = new Connection(RPC_URL, { wsEndpoint: WSS_URL });

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "";

// default sol of channel
export const DEFAULT_SOL = 0.001;
export const DEFAULT_USD = 100;

// limit of txns
export const LIMIT_TXNS = 3;

// unit dolar of emoji
export const UNIT_DOLLAR = 50;

//cycle of monitor
export const CYCLE = 3000;

// size of tnx hashes
export const MESSAGE_SIZE = 6;

// size of ca that every channel can add
export const CA_SIZE = 3;

// pemission of channel
export const OWNER = "creator";
export const ADMIN = "administrator";

export const strBotRunning = "🚀 Bot is running...\nPlease add your CA.";
export const strBotDM = "👋 Hello!\n🤖 Please add this bot in your group.";

export const strPlzEnterCA = "📝 Please enter the CA:";
export const strAddedSuccessfully = "✨ CA added successfully!";
export const strRemovedSuccessfully = "🎉 CA removed successfully!";
export const strInvalidTokenCA = "❗️ Invalid Token Address.";
export const strExceedCANumber = "❗️ Exceed the maximum number of CAs.";
export const strAlreadyExistCA =
  "❗️ This CA has already been entered. Please enter a different CA.";

export const strPlzUploadImg = "🖼️ Please upload image(jpg, png, gif).";
export const strSuccessImageUpload = "✅ Successfully uploaded image!";
export const strPlzUploadValidImage = "❗️ Please upload a valid image.";
export const strExceedImageSize =
  "📏 The image size exceeds 3 MB. Please upload a smaller image.";

export const strPlzUploadEmoji = "😄 Please upload Emoji.";
export const strSuccessEmojiUpload = "✅ Successfully uploaded Emoji!";
export const strPlzUploadValidEmoji = "❗️ Please upload a valid Emoji.";
export const strPlzUploadShortEmoji = "❗️ Please upload less than 2 Emojis.";

export const strPlzInputRemoveCA = "🗑️ Please input remove CA.";
export const strNotokenFound = "🔎 No tokens found.";
export const strNotassociateCA =
  "🔎 This CA is not associated with your channel ID.";
export const strCAnotExist = "❌ This CA does not exist.";

export const strPlzSetMiniSol = `⚙️ Please enter the USD value(min: $${DEFAULT_USD}):`;
export const strLargerThan1 = `❗️ Must be larger than $${DEFAULT_USD}.`;
export const strSuccessSetMinSol = "✅ Successfully set minimum USD value!";
export const strInvalidMinSol = "❗️ Invalid Number.";

export const strNoPermition = "🚫 You do not have permission.";

// signature mode
export const COMMITMENT_LEVEL = "finalized";
// export const COMMITMENT_LEVEL = "confirmed";

// upload image size
export const IMAGESIZE = 3 * 1024 * 1024;

// Define the constant for the image path
// export const defaultIMGURL =
//   "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049607.jpg?ga=GA1.1.1740168943.1729893706&semt=ais_hybrid";

// animation image
export const defaultIMGURL = {
  file_name: "telegram.gif.mp4",
  mime_type: "video/mp4",
  duration: 1,
  width: 320,
  height: 240,
  thumbnail: {
    file_id:
      "AAMCAQADIQUABJLY6_EAAggFZyJ02Nhmq4IYtMqyYWN9Q9UpFp4AAr0FAAKd4RhFNTJ_DDaZsugBAAdtAAM2BA",
    file_unique_id: "AQADvQUAAp3hGEVy",
    file_size: 8784,
    width: 320,
    height: 240,
  },
  thumb: {
    file_id:
      "AAMCAQADIQUABJLY6_EAAggFZyJ02Nhmq4IYtMqyYWN9Q9UpFp4AAr0FAAKd4RhFNTJ_DDaZsugBAAdtAAM2BA",
    file_unique_id: "AQADvQUAAp3hGEVy",
    file_size: 8784,
    width: 320,
    height: 240,
  },
  file_id:
    "CgACAgEAAyEFAASS2OvxAAIIBWcidNjYZquCGLTKsmFjfUPVKRaeAAK9BQACneEYRTUyfww2mbLoNgQ",
  file_unique_id: "AgADvQUAAp3hGEU",
  file_size: 8203,
};

// Reply mode
export const REPLY_MODE = {
  parse_mode: "HTML",
  reply_markup: {
    force_reply: true,
  },
};

export const SOL_URL =
  "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112";
export const WSOL = "So11111111111111111111111111111111111111112";

// Image type
export const IMAGE = "IMAGE";
export const STICKER = "STICKER";
export const GIF = "GIF";
