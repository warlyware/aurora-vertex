"use client";

import CenterContentWrapper from "@/components/UI/center-content-wrapper";
import { findProgramFunctionCalls } from "@/utils/solana";
import { useCallback, useEffect, useState } from "react";

export default function Jupiter() {
  const [isFetched, setIsFetched] = useState(false);

  const getCreatePoolCalls = useCallback(async () => {
    setIsFetched(true);
    const calls = await findProgramFunctionCalls(
      "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
      "createPool"
    );
    console.log(calls);
  }, []);

  return (
    <>
      <CenterContentWrapper>
        <button onClick={getCreatePoolCalls}>get pools</button>
      </CenterContentWrapper>
    </>
  );
}
