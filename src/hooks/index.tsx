import { BASE_URL } from "@/constants";
import { GET_WALLETS_BY_USER_ID } from "@/graphql/queries/get-wallets-by-user-id";
import { usePrevious } from "@/hooks/use-previous";
import { EnhancedWallet, Wallet } from "@/types";
import { createEnhancedWallet, getAbbreviatedAddress } from "@/utils";
import { useQuery } from "@apollo/client";
import { useUserData } from "@nhost/nextjs";
import axios from "axios";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isEqual from "lodash.isequal";
import showToast from "@/utils/show-toast";

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
  setActiveWallet: () => { },
  createWallet: () => { },
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
  const prevUserWallets = usePrevious(userWallets);

  const user = useUserData();

  const { loading } = useQuery(GET_WALLETS_BY_USER_ID, {
    variables: {
      userId: user?.id,
    },
    skip: !user?.id,
    onCompleted: (data) => {
      const enhancedWallets = data.wallets.map(createEnhancedWallet);
      setUserWallets(enhancedWallets);
      setIsLoadingWallets(false);
    },
    onError: (error) => {
      console.error("Error loading wallets", error);
      setIsLoadingWallets(false);
    },
  });

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
    showToast({
      primaryMessage: "Wallet created!",
    });
  };

  const fetchWalletBalances = async (activeWallet?: EnhancedWallet) => {
    if (!activeWallet) return;

    const { data } = await axios.post(`${BASE_URL}/api/get-wallet-balances`, {
      address: activeWallet.address,
    });

    const { balances } = data;

    return balances;
  };

  // const updateActiveWalletBalances = useCallback(async () => {
  //   if (!user || !userWallets.length) return;

  //   const activeWallet = userWallets.find((wallet) => wallet.isActiveWallet);
  //   if (!activeWallet) return;

  //   const balances = await fetchWalletBalances(activeWallet);
  //   if (!isEqual(activeWallet.balances, balances)) {
  //     setUserWallets((wallets) =>
  //       wallets.map((wallet) =>
  //         wallet.id === activeWallet.id ? { ...wallet, balances } : wallet
  //       )
  //     );
  //   }
  // }, [user, userWallets]);

  // useEffect(() => {
  //   const activeWallet = userWallets.find((wallet) => wallet.isActiveWallet);
  //   if (!activeWallet) return;
  //   updateActiveWalletBalances();
  // }, [userWallets, updateActiveWalletBalances]);

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
