import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Coin } from "@/types";
import { getAbbreviatedAddress } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export const CoinTable = ({ coins }: { coins: Coin[] }) => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState([]);
  const [formattedCoins, setFormattedCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (coins.length > 0) {
      setFormattedCoins(
        coins
          .map((coin) => {
            return {
              ...coin,
            };
          })
          .filter((coin) => coin.name?.length)
      );
    }
  }, [coins]);

  const columns = useMemo<ColumnDef<Coin>[]>(
    () => [
      {
        header: () => <div className="uppercase py-2 mr-4 px-4"></div>,
        size: 8,
        accessorKey: "logoURI",
        cell: (info) => (
          <>
            {!!info?.getValue() && (
              <Image
                className="h-8 w-8 ml-4"
                width={24}
                height={24}
                src={info?.getValue() as string}
                alt={info?.getValue() as string}
              />
            )}
          </>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">Name</div>,
        size: 50,
        accessorKey: "name",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${info?.getValue()}`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">Liquidity</div>,
        size: 30,
        accessorKey: "liquidity",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`$${Number(info?.getValue()).toFixed(2) ?? 0
              }`}</div>
          </div>
        ),
      },
      {
        header: () => (
          <div className="uppercase py-2 mr-4 px-4">Market Cap</div>
        ),
        size: 40,
        accessorKey: "mc",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div>{`$${Number(info?.getValue()).toFixed(2)}`}</div>
          </div>
        ),
      },
      {
        header: () => (
          <div className="uppercase py-2 mr-4 px-4">24h Change</div>
        ),
        size: 60,
        accessorKey: "v24hChangePercent",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div>{`${Number(info?.getValue()).toFixed(2)}%`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">24h Vol</div>,
        size: 30,
        accessorKey: "v24hUSD",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div>{`$${Number(info?.getValue()).toFixed(2)}`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase px-4">Address</div>,
        id: "address",
        size: 30,
        accessorKey: "address",
        cell: (info: any) => (
          <div className="flex flex-col px-4">
            <div>{getAbbreviatedAddress(info?.getValue())}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase px-4"></div>,
        id: "links",
        accessorKey: "address",

        size: 30,
        cell: (info: any) => (
          <div className="flex flex-col px-4">
            <a
              href={`https://birdeye.so/token/${info?.getValue()}?chain=solana`}
              target="_blank"
              rel="noreferrer"
            >
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    setData(formattedCoins);
  }, [coins, formattedCoins]);

  const [data, setData] = useState(coins);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    // @ts-ignore
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <div className="w-full" style={{ padding: "0.5rem" }}>
      <div style={{ height: "0.5rem" }} />

      <TableVirtuoso
        style={{ height: "85vh", border: "1px solid lightgray" }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => {
            return (
              <table
                {...props}
                style={{
                  ...style,
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  borderSpacing: 0,
                }}
              />
            );
          },
          TableRow: (props) => {
            const index = props["data-index"];
            const row = rows[index];

            const address = row.getVisibleCells()[6].getValue();

            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "6px" }}>
                    <Link href={`/coin/${address}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </td>
                ))}
              </tr>
            );
          },
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="text-xs"
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      padding: "2px 4px",
                      textAlign: "left",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                      <div
                        className="flex items-center"
                        {...{
                          style: header.column.getCanSort()
                            ? { cursor: "pointer", userSelect: "none" }
                            : {},
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
                          desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ));
        }}
      />
    </div>
  );
};
