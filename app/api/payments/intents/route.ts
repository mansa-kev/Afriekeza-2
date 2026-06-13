import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initiatePayment } from "@/lib/actions/payments";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    purpose: "wallet_deposit" | "commitment_payment";
    provider: "mpesa" | "card" | "crypto" | "wallet";
    amountKes: number;
    phone?: string;
    commitmentId?: string;
    currency?: string;
  };

  const result = await initiatePayment(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
