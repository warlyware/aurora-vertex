import { client } from "@/client/backend-client";
import { GET_TRADERS } from "@/graphql/queries/get-traders"
import { NextResponse } from "next/server";

export async function GET() {
  // const { traders }: {
  //   traders: {
  //     id: string;
  //     name: string;
  //     createdAt: string;
  //     wallet: {
  //       id: string;
  //     };
  //   }[];
  // } = await client.request({
  //   document: GET_TRADERS,
  // });

  const data = await client.request({
    document: GET_TRADERS,
  });

  console.log({ data });

  return NextResponse.json({
    status: 200,
    body: data,
  });
}