import { client } from "@/client/backend-client"
import { UPDATE_TRADER_BY_PK } from "@/graphql/mutations/update-trader-by-pk"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
  const { id, trader } = await req.json()

  const data = await client.request({
    document: UPDATE_TRADER_BY_PK,
    variables: {
      id,
      trader,
    },
  })

  return NextResponse.json({
    status: 200,
    body: data,
  })
}