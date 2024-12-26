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
import Link from "next/link";
import { TokenFromJupiter } from "@/app/dashboard/page";

export const RawCoinTable = ({ coins }: { coins: TokenFromJupiter[] }) => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState([]);
  const [formattedCoins, setFormattedCoins] = useState<TokenFromJupiter[]>([]);

  useEffect(() => {
    if (coins.length > 0) {
      setFormattedCoins(
        coins.map((coin) => {
          return {
            ...coin,
          };
        })
      );
    }
  }, [coins]);

  const columns = useMemo<ColumnDef<TokenFromJupiter>[]>(
    () => [
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">PubKey</div>,
        size: 50,
        accessorKey: "pubkey",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${info?.getValue()}`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">Owner</div>,
        size: 30,
        accessorKey: "owner",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${info?.getValue()}`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">Token A</div>,
        size: 40,
        accessorKey: "mintA",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${info?.getValue()}`}</div>
          </div>
        ),
      },
      {
        header: () => <div className="uppercase py-2 mr-4 px-4">Token B</div>,
        size: 40,
        accessorKey: "mintB",
        cell: (info) => (
          <div className="flex flex-col px-4">
            <div className="truncate">{`${info?.getValue()}`}</div>
          </div>
        ),
      },
      // {
      //   header: () => <div className="uppercase py-2 mr-4 px-4">Found at</div>,
      //   size: 40,
      //   accessorKey: "timestamp",
      //   cell: (info) => (
      //     <div className="flex flex-col px-4">
      //       <div className="truncate">{`${info?.getValue()}`}</div>
      //     </div>
      //   ),
      // },
      {
        header: () => <div className="uppercase px-4"></div>,
        id: "links",
        accessorKey: "pubkey",

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

            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "6px" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          },
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-700">
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
