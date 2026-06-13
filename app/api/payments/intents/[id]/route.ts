import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentIntent } from "@/lib/payments/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const intent = await getPaymentIntent(id, user.id);
  if (!intent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ intent });
}
