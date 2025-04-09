"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import type { Trader } from '@/types/index';
import { EditIcon } from '@/icons/edit-icon'
import WsPageWrapper from "@/components/UI/ws-page-wrapper";
import WsPageContent from "@/components/UI/ws-content-wrapper";
import AddTraderForm from "@/components/traders/AddTraderForm";
import { getAbbreviatedAddress } from "@/utils";

export default function TradersList() {
  const [traders, setTraders] = useState([])
  const [editId, setEditId] = useState('')
  const [traderName, setTraderName] = useState('')
  const [traderDescription, setTraderDescription] = useState('')

  const fetchTraders = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/api/get-traders`);
    const data = await response.json();
    setTraders(data.body.traders?.sort((a: Trader, b: Trader) => a.id.localeCompare(b.id)));
  }, []);

  const updateTrader = async (id: string, name: string, description: string) => {
    const response = await fetch(`${BASE_URL}/api/update-trader`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        trader: {
          name: name,
          description: description,
        },
      }),
    });
    const data = await response.json();
    await fetchTraders()
    setEditId('')
  }

  const setTraderToEdit = (trader: Trader) => {
    setEditId(trader.id)
    setTraderName(trader.name)
  }

  useEffect(() => {
    fetchTraders();
  }, [fetchTraders]);

  const traderNameInput = (trader: Trader) => {
    if (editId === trader.id) {
      return (
        <div className="flex items-center justify-end">
          <button
            className="w-7 text-center rounded-lg text-red-500 hover:bg-slate-50 cursor-pointer"
            onClick={(() => setEditId(''))}
          >
            &#10005;
          </button>
          <div
            className="w-7 text-center rounded-lg text-green-500 hover:bg-slate-50 cursor-pointer"
            onClick={(() => updateTrader(trader.id, traderName, traderDescription))}
          >
            &#10003;
          </div>
          <input
            type="text"
            value={traderName}
            className="w-32 px-2 text-black rounded"
            onChange={(e) => setTraderName(e.target.value)}
          />
        </div>
      )
    }
    return (
      <div className="flex items-center">
        <button
          className="w-8 hover:bg-slate-50 p-2 cursor-pointer rounded-lg"
          onClick={(() => setTraderToEdit(trader))}
        >
          <EditIcon />
        </button>
        <span className="w-32 px-2">{trader.name}</span>
      </div>
    )
  }

  return (
    <WsPageWrapper>
      <WsPageContent className="max-w-4xl mx-auto mt-24 lg:flex  lg:space-x-4">
        <AddTraderForm refetch={fetchTraders} className="mb-8 h-[328px] min-w-[300px]" />
        <div className="flex flex-col space-y-4 max-h-[calc(100vh-330px)] lg:max-h-[calc(100vh-120px)] overflow-y-auto">
          {
            !!traders?.length && traders.map((trader: Trader) => {
              return (
                <div
                  key={trader.id}
                  className="flex flex-col items-start border border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-2 w-[500px] max-w-[90vw] p-2">
                    {traderNameInput(trader)}
                    <a
                      href={`https://gmgn.ai/sol/address/${trader.wallet?.address}`}
                      target="_blank"
                      className="hover:text-green-500 hover:underline"
                    >
                      {getAbbreviatedAddress(trader.wallet?.address)}
                    </a>
                  </div>
                  {trader.description && (
                    <div className="p-2 text-center w-full">
                      {trader.description}
                    </div>
                  )}
                </div>
              )
            })
          }
        </div>
      </WsPageContent>
    </WsPageWrapper>
  )
}