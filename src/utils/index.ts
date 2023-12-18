import { isPublicKey } from "@metaplex-foundation/umi";

export const getAbbreviatedAddress = (
  address: string | PublicKeyCredential,
  identifierLength: number = 4
) => {
  if (!address) return "";
  // check if it's a solana public key
  if (typeof address !== "string") {
    address = address.toString();
  }

  if (!isPublicKey(address)) return "";

  if (!address) return "";
  return `${address.slice(0, identifierLength)}...${address.slice(
    address.length - identifierLength
  )}`;
};
