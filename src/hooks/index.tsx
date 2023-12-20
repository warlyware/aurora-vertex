import { BASE_URL } from "@/constants";
import { GET_WALLETS_BY_USER_ID } from "@/graphql/queries/get-wallets-by-user-id";
import { Wallet } from "@/types";
import { getAbbreviatedAddress } from "@/utils";
import { useQuery } from "@apollo/client";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import React, { ReactNode, useContext, useState } from "react";

type EnhancedWallet = Wallet & {
  shortAddress: string | null;
};

type AuroraContextType = {
  activeWallet: EnhancedWallet | null;
  setActiveWallet: (wallet: Wallet | EnhancedWallet | null) => void;
  createWallet: () => void;
  userWallets: EnhancedWallet[];
  isLoadingActiveWallet: boolean;
  isCreatingWallet: boolean;
  isLoadingWallets: boolean;
};

const AuroraContext = React.createContext<AuroraContextType>({
  activeWallet: null,
  setActiveWallet: () => {},
  createWallet: () => {},
  userWallets: [],
  isLoadingActiveWallet: false,
  isCreatingWallet: false,
  isLoadingWallets: false,
});
const { Provider } = AuroraContext;

export const AuroraProvider = ({ children }: { children: ReactNode }) => {
  const [userWallets, setUserWallets] = useState<EnhancedWallet[]>([]);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);
  const [isLoadingActiveWallet, setIsLoadingActiveWallet] = useState(false);
  const user = useUserData();

  const { loading } = useQuery(GET_WALLETS_BY_USER_ID, {
    variables: {
      userId: user?.id,
    },
    skip: !user?.id,
    onCompleted: ({ wallets }: { wallets: Wallet[] }) => {
      setUserWallets(wallets.map(createEnhancedWallet));
      setIsLoadingWallets(false);
    },
  });

  const createEnhancedWallet = (wallet: Wallet): EnhancedWallet => {
    return {
      ...wallet,
      shortAddress: getAbbreviatedAddress(wallet.address),
    };
  };

  const handleSetActiveWallet = async (
    wallet: EnhancedWallet | Wallet | null
  ) => {
    if (!user || !wallet) return;

    setIsLoadingActiveWallet(true);

    const { data } = await axios.post(`${BASE_URL}/api/set-active-wallet`, {
      address: wallet?.address,
      userId: user?.id,
    });
    if (data?.wallet) {
      const enhancedWallet = createEnhancedWallet(data.wallet);
      setUserWallets((wallets) =>
        wallets.map((wallet) => ({
          ...wallet,
          isActiveWallet: wallet.id === enhancedWallet.id,
        }))
      );
    }

    setIsLoadingActiveWallet(false);
  };

  const createWallet = async () => {
    if (!user) return;

    setIsCreatingWallet(true);

    const { data } = await axios.post(`${BASE_URL}/api/create-wallet`, {
      userId: user.id,
    });

    const wallet = data.wallet;

    setUserWallets((wallets) => [...wallets, createEnhancedWallet(wallet)]);
    setIsCreatingWallet(false);
  };

  return (
    <Provider
      value={{
        activeWallet:
          userWallets.find((wallet) => wallet.isActiveWallet) || null,
        setActiveWallet: handleSetActiveWallet,
        createWallet,
        userWallets,
        isLoadingActiveWallet,
        isCreatingWallet,
        isLoadingWallets,
      }}
    >
      {children}
    </Provider>
  );
};

export const useAurora = () => {
  const {
    activeWallet,
    setActiveWallet,
    createWallet,
    userWallets,
    isLoadingActiveWallet,
    isLoadingWallets,
    isCreatingWallet,
  } = useContext(AuroraContext);

  return {
    activeWallet,
    setActiveWallet,
    createWallet,
    userWallets,
    isLoadingActiveWallet,
    isLoadingWallets,
    isCreatingWallet,
  };
};
