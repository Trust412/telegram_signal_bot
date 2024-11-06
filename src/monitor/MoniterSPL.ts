import { PublicKey } from "@solana/web3.js";
import {
  COMMITMENT_LEVEL,
  connection,
  DEFAULT_USD,
  LIMIT_TXNS,
  UNIT_DOLLAR,
} from "../config/config";
import {
  birdeyeLink,
  changeStyle,
  contractLink,
  dextoolLink,
  getDeltaAmount,
  getSolPrice,
  getTokenInf,
  getTokenPrice,
  signerLink,
  symbolLink,
  txnLink,
} from "../../utils";
import {
  CreateAlarm,
  getChannelsfromCA,
  getEmojifromCid,
  getMinSolfromCid,
  setMapLastSignature,
} from "../..";
import { logger } from "../utils/logger";

/*
export async function moniterSPL(ca: string, lastSignature: string) {
  let signatureInfo;

  signatureInfo = await connection.getSignaturesForAddress(
    new PublicKey(ca),
    {
      limit: 3,
    },
    COMMITMENT_LEVEL
  );

  console.log("getLastSignature pre", getLastSignature(ca));
  console.log("signatureInfo       ", signatureInfo[0].signature);

  if (lastSignature !== signatureInfo[0].signature) {
    let _last = signatureInfo[0].signature;
    setMapLastSignature(ca, _last);
    console.log("getLastSignature updated... _last", _last);

    let txn: any;
    try {
      txn = await connection.getParsedTransaction(_last, {
        maxSupportedTransactionVersion: 0,
      });
      if (!txn) {
        console.log("Transaction not found or not yet confirmed.");
      }
    } catch (error) {
      console.log(
        "Error occurred while processing transaction: MonitorSPL 50",
        error
      );
    }
    console.log("txn " + txn);

    const { supply, symbol } = await getTokenInf(ca);
    const price = await getTokenPrice(ca);
    const mc = changeStyle(supply * price);

    let txData: any;
    console.log("1");
    try {
      console.log("2");

      if (txn && txn.meta) {
        console.log("3");

        const solAmount = txn.meta.postBalances[0] - txn.meta.preBalances[0];

        // only add txn if sol amount is greater than default SOL
        if (Math.abs(solAmount) >= DEFAULT_SOL * 10 ** 9) {
          console.log("4");

          const TokenDelta =
            getDeltaAmount(
              txn.meta.preTokenBalances,
              txn.meta.postTokenBalances,
              ca
            ) || 0;
          const txhash = txn.transaction.signatures[0];
          let message = "";
          message = makeMessage(message, solAmount, TokenDelta, symbol, txhash);
          txData = {
            message: message,
            solDelta: Math.abs(solAmount),
          };
          console.log("5");
        }
      }
    } catch (error) {
      console.log("Error occurred while processing transaction: MonitorSPL 82");
    }
    console.log("6");

    const channels = getChannelsfromCA(ca);

    // better performance
    let _message = initMessage(symbol, ca, mc) + txData.message; // Reset message
    console.log("7");

    for (const channel of channels) {
      console.log("8");

      const minSol = getMinSolfromCid(channel) || DEFAULT_SOL; // 0.5~100
      if (minSol * 10 ** 9 <= txData.solDelta) {
        CreateAlarm(ca, _message, channel);
      }
    }
  }
}
*/

const initMessage = (symbol: string, ca: string, marketcap: string) => {
  let message = "";
  message += contractLink(ca) + " • ";
  message += birdeyeLink(ca) + " • ";
  message += dextoolLink(ca) + "\n\n";
  return message;
};

const makeMessage = (
  msg: string,
  solAmount: number,
  solPrice: number,
  tokenAmount: number,
  Position: number,
  symbol: any,
  txHash: string,
  txSigner: string,
  supply: number,
  price: number
) => {
  msg += `🔀 ${changeStyle(solAmount)} SOL ($${changeStyle(
    solAmount * solPrice
  )})\n`;
  msg += `🔼 ${changeStyle(tokenAmount)} <b>${symbol}</b>\n`;
  msg += `👤 ${signerLink(txSigner)} | ${txnLink(txHash)}\n`;
  // msg += `⬇️ Position: ${changeStyle(Position)}%\n`;
  msg += `💲 ${symbol} Price: $${price}\n`;
  msg += `🏦 Market Cap $${changeStyle(supply * price)}\n\n`;
  return msg;
};

export async function moniterSPL(ca: string, lastSignature: string) {
  try {
    let signatureInfo;

    if (!lastSignature) {
      signatureInfo = await connection.getSignaturesForAddress(
        new PublicKey(ca),
        {
          limit: 1,
        },
        COMMITMENT_LEVEL
      );
    } else {
      signatureInfo = await connection.getSignaturesForAddress(
        new PublicKey(ca),
        {
          limit: LIMIT_TXNS,
          until: lastSignature,
        },
        COMMITMENT_LEVEL
      );
    }
    if (
      signatureInfo.length > 0 &&
      lastSignature !== signatureInfo[0].signature
    ) {
      // console.log("signatureInfo.length", signatureInfo.length);
      let _lastSignature = signatureInfo[0].signature;
      setMapLastSignature(ca, _lastSignature);

      const sigArray = signatureInfo
        .filter((sig) => !sig.err)
        .map((sig) => sig?.signature);
      let txns: any[] = [];
      try {
        txns = await connection.getParsedTransactions(sigArray, {
          maxSupportedTransactionVersion: 0,
        });
      } catch (error) {
        console.log(
          "Error occurred while processing transaction: MonitorSPL 50"
        );
      }

      const txs = txns.filter((trx) => trx?.transaction);
      const { supply, symbol } = await getTokenInf(ca);
      const price = await getTokenPrice(ca);
      const mc = changeStyle(supply * price);
      const SOL_price = await getSolPrice();

      let txData = [];
      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];
        try {
          if (tx && tx.meta) {
            const solAmount = tx.meta.postBalances[0] - tx.meta.preBalances[0];

            // only add txn if sol amount is greater than default SOL
            if (
              Math.abs(solAmount) * SOL_price >= DEFAULT_USD &&
              solAmount > 0
            ) {
              const { delta, position } = getDeltaAmount(
                tx.meta.preTokenBalances,
                tx.meta.postTokenBalances,
                ca
              );
              if (delta === 0) continue;
              // console.log("tx.transaction", tx.transaction);
              const txSigner = tx.transaction.message.accountKeys
                .find((item: any) => item.signer === true)
                ?.pubkey.toString();
              const txHash = tx.transaction.signatures[0];
              // console.log("txSigner", txSigner);
              // console.log("txHash", txHash);
              let message = "";
              message = makeMessage(
                message,
                Math.abs(solAmount / 10 ** 9),
                SOL_price,
                Math.abs(delta),
                position,
                symbol,
                txHash,
                txSigner,
                supply,
                price
              );
              txData.push({
                message: message,
                solDelta: Math.abs(solAmount),
                tokenDelta: Math.abs(delta),
              });
            }
          }
        } catch (error) {
          console.log(
            "Error occurred while processing transaction: MonitorSPL 248"
          );
        }
      }
      const channels = getChannelsfromCA(ca);
      // console.log("send ", txData.length, " messages to channels");
      // better performance
      try {
        for (const channel of channels) {
          const minSol = getMinSolfromCid(channel) || DEFAULT_USD; // $100 over
          // console.log("minSol", minSol);
          let _init = initMessage(symbol, ca, mc);

          const emoji = getEmojifromCid(channel) || "😀";

          for (const item of txData) {
            if (minSol * 10 ** 9 <= item.solDelta * SOL_price) {
              let _sendMsg = `${symbolLink(ca, symbol)} Sell!\n`;

              const emojiNum = Math.min(
                (item.solDelta * SOL_price) / 10 ** 9 / UNIT_DOLLAR,
                69
              ); // 1 emoji per $50
              for (let i = 0; i <= emojiNum; i++) _sendMsg += `${emoji}`;
              _sendMsg += `\n\n`;
              _sendMsg += item.message + _init;
              CreateAlarm(ca, _sendMsg, channel);
            }
          }
        }
      } catch (error) {
        console.log("Error occurred while: SPL 297");
      }
    }
  } catch (error) {
    logger.info("[ ERR ] in Monitor SPL");
  }
}

/* multi msgs
export async function moniterSPL(ca: string, lastSignature: string) {
  let signatureInfo;

  if (!lastSignature) {
    signatureInfo = await connection.getSignaturesForAddress(
      new PublicKey(ca),
      {
        limit: 1,
      },
      COMMITMENT_LEVEL
    );
  } else {
    signatureInfo = await connection.getSignaturesForAddress(
      new PublicKey(ca),
      { until: lastSignature },
      COMMITMENT_LEVEL
    );
  }
  console.log("signatureInfo.length", signatureInfo.length);
  if (
    signatureInfo.length > 0 &&
    lastSignature !== signatureInfo[0].signature
  ) {
    let _lastSignature = signatureInfo[0].signature;
    // console.log("lastSignature 2", lastSignature);
    setMapLastSignature(ca, _lastSignature);

    const sigArray = signatureInfo
      .filter((sig) => !sig.err)
      .map((sig) => sig?.signature);
    // get txns
    let txns: any[] = [];
    try {
      txns = await connection.getParsedTransactions(sigArray, {
        maxSupportedTransactionVersion: 0,
      });
    } catch (error) {
      console.log("Error occurred while processing transaction: MonitorSPL 50");
    }

    const txs = txns.filter((trx) => trx?.transaction);

    const { supply, symbol } = await getTokenInf(ca);
    const price = await getTokenPrice(ca);
    const mc = changeStyle(supply * price);

    let txData = [];

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      try {
        if (tx && tx.meta) {
          const solAmount = tx.meta.postBalances[0] - tx.meta.preBalances[0];

          // only add txn if sol amount is greater than default SOL
          if (Math.abs(solAmount) >= DEFAULT_SOL * 10 ** 9) {
            const TokenDelta =
              getDeltaAmount(
                tx.meta.preTokenBalances,
                tx.meta.postTokenBalances,
                ca
              ) || 0;
            const txhash = tx.transaction.signatures[0];
            let message = "";
            message = makeMessage(
              message,
              solAmount,
              TokenDelta,
              symbol,
              txhash
            );
            txData.push({
              message: message,
              solDelta: Math.abs(solAmount),
            });
          }
        }
      } catch (error) {
        console.log(
          "Error occurred while processing transaction: MonitorSPL 82"
        );
      }
    }
    const channels = getChannelsfromCA(ca);
    console.log("txData", txData.length);
    // better performance
    for (const channel of channels) {
      let idx = 0;
      let _message = initMessage(symbol, ca, mc);
      const minSol = getMinSolfromCid(channel) || DEFAULT_SOL; // 0.5~100
      const messagesToSend = []; // Array to batch messages

      for (const item of txData) {
        if (minSol * 10 ** 9 <= item.solDelta) {
          idx++;
          if (idx > MESSAGE_SIZE - 1) {
            _message += getCurTime();
            messagesToSend.push(CreateAlarm(ca, _message, channel));
            _message = initMessage(symbol, ca, mc) + item.message; // Reset message
            idx = 1; // Reset index to 1 since we added a message
          } else {
            _message += item.message;
          }
        }
      }

      // Final message check
      if (_message !== initMessage(symbol, ca, mc)) {
        _message += getCurTime();
        messagesToSend.push(CreateAlarm(ca, _message, channel));
      }

      // Await all CreateAlarm calls in parallel
      await Promise.all(messagesToSend);
    }
  }
}


*/
