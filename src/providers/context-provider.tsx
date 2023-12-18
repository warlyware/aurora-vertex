"use client";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { deepPurple, pink } from "@mui/material/colors";

import { WalletModalProvider as AntDesignWalletModalProvider } from "@solana/wallet-adapter-ant-design";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { WalletDialogProvider as MaterialUIWalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SnackbarProvider, useSnackbar } from "notistack";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { NhostClient, NhostProvider } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { RPC_ENDPOINT } from "@/constants";
import { nhost } from "@/client";
require("@solana/wallet-adapter-react-ui/styles.css");

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: deepPurple[700],
    },
    secondary: {
      main: pink[700],
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          justifyContent: "flex-start",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px 16px",
        },
        startIcon: {
          marginRight: 8,
        },
        endIcon: {
          marginLeft: 8,
        },
      },
    },
  },
});

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint
  const endpoint = RPC_ENDPOINT;

  if (!endpoint) {
    throw new Error("RPC endpoint is required");
  }

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  const { enqueueSnackbar } = useSnackbar();
  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(
        error.message ? `${error.name}: ${error.message}` : error.name,
        { variant: "error" }
      );

      console.error({ error });
    },
    [enqueueSnackbar]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <MaterialUIWalletDialogProvider>
          <AntDesignWalletModalProvider>
            <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
          </AntDesignWalletModalProvider>
        </MaterialUIWalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    // <NhostProvider nhost={nhost} initial={pageProps.nhostSession}>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <WalletContextProvider>{children}</WalletContextProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </NhostApolloProvider>
    </NhostProvider>
  );
};
