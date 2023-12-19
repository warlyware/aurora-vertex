export type HolderFromSolscan = {
  address: string;
  amount: number;
  decimals: number;
  owner: string;
  rank: number;
  withheldAmount: number;
};

export type SolscanTokenHoldersResponse = {
  success: boolean;
  data: {
    total: number;
    result: HolderFromSolscan[];
  };
};
