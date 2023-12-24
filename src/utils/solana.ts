import { RPC_ENDPOINT, SOL_TOKEN_ADDRESS } from "@/constants";
import {
  CompiledInstruction,
  Connection,
  PublicKey,
  VersionedMessage,
} from "@solana/web3.js";
import { BorshInstructionCoder, Instruction } from "@project-serum/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ProgramId } from "@raydium-io/raydium-sdk";
import fs from "fs";

export const MAINNET_PROGRAM_ID: ProgramId = {
  SERUM_MARKET: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
  OPENBOOK_MARKET: new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"),

  UTIL1216: new PublicKey("CLaimxFqjHzgTJtAGHU47NPhg6qrc5sCnpC4tBLyABQS"),

  FarmV3: new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
  FarmV5: new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
  FarmV6: new PublicKey("FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG"),

  AmmV4: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
  AmmStable: new PublicKey("5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h"),

  CLMM: new PublicKey("CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"),

  Router: new PublicKey("routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS"),
};

const { CLMM } = MAINNET_PROGRAM_ID;

export async function findProgramFunctionCalls(
  programId: string,
  functionName: string
) {
  const connection = new Connection(RPC_ENDPOINT, "confirmed");

  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(programId),
    {
      limit: 10,
    }
  );

  let signatureInfos: {
    signature: string;
    slot: number;
    programId: string;
    decodedInstruction: Instruction;
  }[] = [];

  const idl = await import("@/idls/amm_v3.json");

  for (const signatureInfo of signatures) {
    try {
      // Fetch the transaction details
      const transaction = await connection.getTransaction(
        signatureInfo.signature,
        {
          maxSupportedTransactionVersion: 1,
        }
      );

      console.log({ transaction });

      if (transaction?.transaction.message?.compiledInstructions) {
        const { compiledInstructions, staticAccountKeys } =
          transaction.transaction.message;

        console.log({ compiledInstructions, staticAccountKeys });

        for (const instruction of compiledInstructions) {
          const programId =
            staticAccountKeys[instruction.programIdIndex].toString();
          console.log({ programId });

          // @ts-ignore
          const coder = new BorshInstructionCoder(idl);
          const decodedInstruction = coder.decode(
            Buffer.from(instruction.data)
          );

          console.log({ decodedInstruction });
          signatureInfos.push({
            signature: signatureInfo.signature,
            slot: signatureInfo.slot,
            programId,
            decodedInstruction: decodedInstruction
              ? decodedInstruction
              : { name: "null", data: {} },
          });
          if (programId === CLMM.toString()) {
          }
        }
      }

      // if (transaction) {
      //   const { message } = transaction.transaction;
      //   if ("instructions" in message) {
      //     const accountKeys = message.accountKeys;

      //     message.instructions.forEach(async (instruction) => {
      //       console.log({ instruction });
      //       const programId =
      //         accountKeys[instruction.programIdIndex].toString();
      //       if (programId === CLMM.toString()) {
      //         // @ts-ignore
      //         const coder = new BorshInstructionCoder(idl);
      //         const decodedInstruction = coder.decode(instruction.data);

      //         signatureInfos.push({
      //           signature: signatureInfo.signature,
      //           slot: signatureInfo.slot,
      //           programId,
      //           instruction,
      //           decodedInstruction: decodedInstruction
      //             ? decodedInstruction
      //             : { name: "null", data: {} },
      //         });
      //       }
      //     });
      //   } else {
      //     console.log("is MessageV0");

      //   }
      // }
    } catch (error) {
      console.error(
        `Error processing signature ${signatureInfo.signature}:`,
        error
      );
    }
  }

  return signatureInfos;
  // return signatureInfos.filter(
  //   (signatureInfo) => signatureInfo.decodedInstruction.name === functionName
  // );
}

export const isSol = (mint: string) => {
  return mint === SOL_TOKEN_ADDRESS;
};
