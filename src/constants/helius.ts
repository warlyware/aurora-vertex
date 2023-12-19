export type AccountInfoFromHelius = {
  key: string;
  isSigner: boolean;
  isWritable: boolean;
  lamports: number;
  data: {
    parsed: {
      info: {
        decimals: number;
        freezeAuthority: string;
        isInitialized: boolean;
        mintAuthority: string;
        supply: string;
      };
      type: string;
    };
    program: string;
    space: number;
  };
  owner: string;
  executable: boolean;
  rentEpoch: number;
};

export type MetadataFromHelius = {
  tokenStandard: string;
  key: string;
  updateAuthority: string;
  mint: string;
  data: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators?: {
      address: string;
      verified: boolean;
      share: number;
    }[];
  };
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  uses: { useMethod: string; remaining: number; total: number };
  collection?: any;
  collectionDetails?: any;
};

export type HeliusTokenMetadataResponse = {
  account: string;
  onChainAccountInfo: { accountInfo: AccountInfoFromHelius; error: string };
  onChainMetadata: { metadata: MetadataFromHelius; error: string };
  offChainMetadata: {
    metadata: MetadataFromHelius;
    uri: string;
    error: string;
  };
  legacyMetadata?: any;
};
