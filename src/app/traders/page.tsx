"use client";
import { PageWrapper } from "@/components/UI/page-wrapper";
import { BASE_URL } from "@/constants";
import { useCallback, useEffect, useState } from "react";

export default function TradersList() {
  const [ traders, setTraders ] = useState([]);

  const fetchTraders = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/api/get-traders`);
    const data = await response.json();
    setTraders(data);
    console.log({ data });
  }, []);

  useEffect(() => {
    fetchTraders();
  }, [fetchTraders]);

  return (
    <>
    <PageWrapper>
      <div>
        this is a div
      </div>
    </PageWrapper>
    </>
  )
}