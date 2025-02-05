"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import type { Trader } from '@/types/index';
import { EditIcon } from '@/icons/edit-icon'

export default function TradersList() {
  const [ traders, setTraders ] = useState([])
  const [ editId, setEditId ] = useState('')
  const [ traderName, setTraderName ] = useState('')

  const fetchTraders = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/api/get-traders`);
    const data = await response.json();
    setTraders(data.body.traders);
  }, []);

  const setTraderToEdit = (trader: Trader) => {
    setEditId(trader.id)
    setTraderName(trader.name)
  }

  useEffect(() => {
    fetchTraders();
  }, [fetchTraders]);

  if (!traders.length) {
    return <div>Loading...</div>
  }

  const traderNameInput = (trader: Trader) => {
    if(editId === trader.id) {
      return (
        <div className="flex items-center justify-end h-8 space-x-1 mt-3">
          <button 
            className="w-7 text-center rounded-lg text-red-500 hover:bg-slate-50 cursor-pointer"
            onClick={(() => setEditId(''))}
          >
            &#10005;
          </button>
          <div className="w-7 text-center rounded-lg text-green-500 hover:bg-slate-50 cursor-pointer">
            &#10003;
          </div>
          <input
            type="text"
            value={traderName}
            className="w-24 px-2 text-black rounded"
            onChange={(e) => setTraderName(e.target.value)}
          />
        </div>
      )
    }
    return (
      <div className="flex items-center h-8 justify-end ml-8 mt-3">
        <button 
          className="w-8 hover:bg-slate-50 p-2 cursor-pointer rounded-lg"
          onClick={(() => setTraderToEdit(trader))}
        >
          <EditIcon />
        </button>
        <span className="w-24 px-2">{trader.name}</span>
      </div>
    )
  }
  return (
    <>
    <PageWrapper>
      <div>
        <h2 className="my-8 text-xl">
          Traders We Follow
        </h2>
        {
          traders.map((trader: Trader) => {
            return (
              <div 
                key={trader.id}
                className="flex space-y-4"
              >
                
                {traderNameInput(trader)}
                <a 
                  href={`https://gmgn.ai/sol/address/${trader.wallet?.id}`}
                  target="_blank"
                  className="hover:text-green-500 hover:underline px-4"
                >
                  {trader.wallet?.id}
                </a>
              </div>
            )
          })
        }
      </div>
    </PageWrapper>
    </>
  )
}