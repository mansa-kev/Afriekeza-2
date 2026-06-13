"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSecondaryListing(data: {
  positionId: string;
  askingAmountKes: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!investor) return { error: "Investor profile required" };

  const { error } = await supabase.from("secondary_market_listings").insert({
    position_id: data.positionId,
    seller_investor_id: investor.id,
    asking_amount_kes: data.askingAmountKes,
    status: "open",
    notes: data.notes,
    window_opens_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };
  revalidatePath("/investor/secondary-market");
  return { success: true };
}

export async function createInvestmentGroup(data: {
  name: string;
  targetAmountKes: number;
  opportunityId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: group, error } = await supabase
    .from("investment_groups")
    .insert({
      name: data.name,
      leader_user_id: user.id,
      target_amount_kes: data.targetAmountKes,
      opportunity_id: data.opportunityId ?? null,
      status: "forming",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.from("investment_group_members").insert({
    group_id: group.id,
    user_id: user.id,
    pledged_amount_kes: 0,
  });

  revalidatePath("/investor/groups");
  return { success: true, id: group.id };
}

export async function joinInvestmentGroup(groupId: string, pledgedAmountKes: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("investment_group_members").upsert(
    {
      group_id: groupId,
      user_id: user.id,
      pledged_amount_kes: pledgedAmountKes,
    },
    { onConflict: "group_id,user_id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/investor/groups");
  return { success: true };
}
