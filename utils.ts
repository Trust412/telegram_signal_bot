import { Metaplex } from "@metaplex-foundation/js";
import { connection, SOL_URL, WSOL } from "./src/config/config";
import { PublicKey } from "@solana/web3.js";

export const isSPL_CA = (address: string): boolean => {
  const CA_Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return CA_Regex.test(address);
};

// export const setMapLastSignature = (
//   mapLastSignature: Map<any, any>,
//   CA: string,
//   value: string
// ) => {
//   mapLastSignature.set(CA, value);
// };

export const getDeltaAmount = (
  preData: any[],
  postData: any[],
  ca: string
): any => {
  let delta: any = 0,
    position: any = 0;
  for (const item of preData) {
    const _mint1 = item.mint;
    const _owner1 = item.owner;

    for (const item2 of postData) {
      const _mint2 = item2.mint;
      const _owner2 = item2.owner;

      if (_mint1 === _mint2 && _owner1 === _owner2 && _mint1 === ca) {
        delta =
          Number(item2.uiTokenAmount.uiAmount) -
          Number(item.uiTokenAmount.uiAmount);
        position =
          100.0 -
          (Math.abs(delta) / Number(item.uiTokenAmount.uiAmount)) * 100.0;
        position = Math.max(0, position);
        // console.log("position", delta, position);
        return { delta, position };
      }
    }
  }
  return { delta, position };
};

export const txnLink = (txn: string) => {
  return `<a href="https://solscan.io/tx/${txn}">Txn</a>`;
};

export const signerLink = (signer: string) => {
  return `<a href="https://solscan.io/account/${signer}">${reduceTransactionHash(
    signer
  )}</a>`;
};

export const contractLink = (mint: string) => {
  return `<a href="https://solscan.io/token/${mint}">Contract</a>`;
};
export const symbolLink = (mint: string, symbol: string) => {
  return `<a href="https://solscan.io/token/${mint}">${symbol}</a>`;
};
export const birdeyeLink = (mint: string) => {
  return `<a href="https://birdeye.so/token/${mint}?chain=solana">Birdeye</a>`;
};

export const dextoolLink = (mint: string) => {
  return `<a href="https://www.dextools.io/app/en/solana/pair-explorer/${mint}">Dextools</a>`;
};

// export const changeStyle = (input: number): string => {
//   if (input >= 1000000) {
//     return `${(input / 1000000).toFixed(1)}M`;
//   } else if (input >= 1000) {
//     return `${(input / 1000).toFixed(1)}K`;
//   } else {
//     return input.toFixed(2);
//   }
// };
export const changeStyle = (input: number): string => {
  return input.toLocaleString();
};

export const getCurTime = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = now.getUTCDate().toString().padStart(2, "0");
  const time = now.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format as HH:mm:ss MM/DD/YYYY
  return `${time} ${month}/${day}/${year} UTC`;
};

export const getTokenInf = async (ca: string) => {
  try {
    const metaPlex = new Metaplex(connection as any);
    const metadata = await metaPlex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(ca) });
    const decimal = metadata.mint.decimals;
    const symbol = metadata.symbol;
    const supply = Number(metadata.mint.supply.basisPoints) / 10 ** decimal;
    return { supply, symbol };
  } catch (error) {
    const supply = 0;
    const symbol = "symbol";
    return { supply, symbol };
  }
};

export const getTokenPrice = async (ca: string) => {
  try {
    const BaseURL = `https://api.jup.ag/price/v2?ids=${ca}`;

    const response = await fetch(BaseURL);
    const data = await response.json();
    // console.log("data", data);
    const price = data.data[ca]?.price;
    return price;
  } catch (error) {
    return 0;
  }
};

export const getSolPrice = async () => {
  try {
    const BaseURL = SOL_URL;
    const response = await fetch(BaseURL);
    const data = await response.json();
    const price = data.data[WSOL]?.price;
    return price;
  } catch (error) {
    return 1;
  }
};

export const checkIsNumber = (item: any) => {
  const num = Number(item);
  return !isNaN(num);
};

export function isEmoji(text: string) {
  const emojiRegex =
    /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}\u{1F0CF}\u{1F9C0}\u{1F9D0}\u{1F9D1}\u{1F9D2}\u{1F9D3}\u{1F9D4}\u{1F9D5}\u{1F9D6}\u{1F9D7}\u{1F9D8}\u{1F9D9}\u{1F9DA}\u{1F9DB}\u{1F9DC}\u{1F9DD}\u{1F9DE}\u{1F9DF}\u{1F9E0}\u{1F9E1}\u{1F9E2}\u{1F9E3}\u{1F9E4}\u{1F9E5}\u{1F9E6}\u{1F9E7}\u{1F9E8}\u{1F9E9}\u{1F9EA}\u{1F9EB}\u{1F9EC}\u{1F9ED}\u{1F9EE}\u{1F9EF}\u{1F9F0}\u{1F9F1}\u{1F9F2}\u{1F9F3}\u{1F9F4}\u{1F9F5}\u{1F9F6}\u{1F9F7}\u{1F9F8}\u{1F9F9}\u{1F9FA}\u{1F9FB}\u{1F9FC}\u{1F9FD}\u{1F9FE}\u{1F9FF}\u{1FA00}-\u{1FA6F}]+$/u;

  return emojiRegex.test(text);
}

export function reduceTransactionHash(hash: string) {
  // Ensure the hash is valid
  if (typeof hash !== "string" || hash.length < 10) {
    throw new Error("Invalid transaction hash");
  }

  return hash.substring(0, 5) + "..." + hash.substring(hash.length - 3);
}
