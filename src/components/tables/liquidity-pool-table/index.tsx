import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { getAbbreviatedAddress } from "@/utils";

import { RaydiumLiquidityPool } from "@/types/raydium";
import { LiquidityPoolTableTokenLinks } from "@/components/tokens/liquidity-pool-table-token-links";
import {
  PriceInfoFromDexscreener,
  TokenPairFromDexscreener,
} from "@/app/api/get-token-price-info-from-dexscreener/route";

export type RaydiumLiquidityPoolWithMeta = RaydiumLiquidityPool & {
  meta: any;
};

export const LiquidityPoolTable = ({
  pools,
}: {
  pools: RaydiumLiquidityPoolWithMeta[];
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo<ColumnDef<RaydiumLiquidityPoolWithMeta>[]>(
    () => [
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">$</div>,
        size: 16,
        accessorKey: "baseMint",
        cell: (info) => {
          const rowData = info.row.original;
          const metaValue: TokenPairFromDexscreener = rowData.meta;
          return (
            <div className="relative overflow-visible">
              <div className="absolute"></div>
              <div className="flex flex-col px-4">
                <div className="truncate">${metaValue?.priceUsd}</div>
                <LiquidityPoolTableTokenLinks
                  address={info.getValue() as string}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">quoteMint</div>,
        size: 16,
        accessorKey: "quoteMint",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => (
          <div className="uppercase py-2 mr-4 px-4">openOrders</div>
        ),
        size: 16,
        accessorKey: "openOrders",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => (
          <div className="uppercase py-2 mr-4 px-4">targetOrders</div>
        ),
        size: 16,
        accessorKey: "targetOrders",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">baseVault</div>,
        size: 16,
        accessorKey: "baseVault",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">marketId</div>,
        size: 16,
        accessorKey: "marketId",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => (
          <div className="uppercase py-2 mr-4 px-4">marketBids</div>
        ),
        size: 16,
        accessorKey: "marketBids",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${getAbbreviatedAddress(
              info.getValue() as string
            )}`}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => <div className="uppercase px-4">marketAsks</div>,
        size: 16,
        accessorKey: "marketAsks",
        cell: (info: any) => (
          <div className="flex flex-col px-4">
            <div>{getAbbreviatedAddress(info?.getValue())}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
      {
        header: () => <div className="uppercase px-4">marketEventQueue</div>,
        size: 16,
        accessorKey: "marketEventQueue",
        cell: (info: any) => (
          <div className="flex flex-col px-4">
            <div>{getAbbreviatedAddress(info?.getValue())}</div>
            <LiquidityPoolTableTokenLinks address={info.getValue() as string} />
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = useState(pools);

  const table = useReactTable({
    data: pools,
    columns,
    state: {
      sorting,
    },
    // @ts-ignore
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table?.getRowModel();

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
                  <td key={cell.id} className="py-2 mx-4 overflow-auto">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          },
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-700 overflow-auto">
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
                        className="flex items-center shrink-0"
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
