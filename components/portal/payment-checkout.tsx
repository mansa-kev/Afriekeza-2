"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { initiatePayment, payWithWallet } from "@/lib/actions/payments";
import type { PaymentAction, PaymentProviderId, PaymentPurpose } from "@/lib/payments/types";

type Props = {
  purpose: PaymentPurpose;
  amountKes: number;
  commitmentId?: string;
  walletBalanceKes?: number;
  enabledProviders: PaymentProviderId[];
  title: string;
  description: string;
};

export function PaymentCheckout({
  purpose,
  amountKes,
  commitmentId,
  walletBalanceKes = 0,
  enabledProviders,
  title,
  description,
}: Props) {
  const router = useRouter();
  const [provider, setProvider] = useState<PaymentProviderId>(
    enabledProviders.find((p) => p === "mpesa") ?? enabledProviders[0] ?? "mpesa",
  );
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(String(amountKes || ""));
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<PaymentAction | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setAmount(String(amountKes || ""));
  }, [amountKes]);

  function handlePay() {
    setError(null);
    setAction(null);
    startTransition(async () => {
      if (provider === "wallet" && commitmentId) {
        const result = await payWithWallet(commitmentId);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.refresh();
        return;
      }

      const result = await initiatePayment({
        purpose,
        provider,
        amountKes: Number(amount),
        phone: provider === "mpesa" ? phone : undefined,
        commitmentId,
        currency: provider === "card" || provider === "crypto" ? "USD" : "KES",
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.action) {
        setAction(result.action);
        if (result.action.type === "redirect") {
          window.location.href = result.action.url;
          return;
        }
      }

      if (result.status === "succeeded") {
        router.refresh();
      }
    });
  }

  const showWallet =
    purpose === "commitment_payment" &&
    commitmentId &&
    enabledProviders.includes("wallet");

  return (
    <div className="rounded-2xl border border-header-border bg-white p-6">
      <h2 className="font-semibold text-dark">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>

      {purpose === "wallet_deposit" && (
        <input
          type="number"
          min={1}
          className="mt-4 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {enabledProviders
          .filter((p) => p !== "wallet")
          .map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
                provider === p ? "border-blue bg-soft-blue text-blue" : "border-header-border text-muted"
              }`}
            >
              {p === "card" ? "Card (USD)" : p}
            </button>
          ))}
        {showWallet ? (
          <button
            type="button"
            onClick={() => setProvider("wallet")}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              provider === "wallet" ? "border-blue bg-soft-blue text-blue" : "border-header-border text-muted"
            }`}
          >
            Wallet
          </button>
        ) : null}
      </div>

      {provider === "mpesa" && (
        <input
          className="mt-4 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          placeholder="M-Pesa phone (2547XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      {provider === "crypto" && (
        <p className="mt-3 text-sm text-muted">
          USDC on Ethereum. You will receive a deposit address after initiating payment.
        </p>
      )}

      {provider === "card" && (
        <p className="mt-3 text-sm text-muted">
          Diaspora-friendly card checkout in USD. You will be redirected to a secure payment page.
        </p>
      )}

      {action?.type === "stk_push" && (
        <p className="mt-4 rounded-xl bg-soft-blue px-4 py-3 text-sm text-blue">{action.message}</p>
      )}

      {action?.type === "crypto" && (
        <div className="mt-4 rounded-xl border border-header-border bg-off-white p-4 text-sm">
          <p className="font-medium text-dark">Send {action.amount} {action.currency}</p>
          <p className="mt-2 break-all text-muted">{action.address}</p>
          <p className="mt-1 text-xs text-muted">Network: {action.network}</p>
        </div>
      )}

      {action?.type === "none" && action.message ? (
        <p className="mt-4 text-sm text-green-700">{action.message}</p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <Button
        variant="primary"
        className="mt-4"
        disabled={
          pending ||
          !amount ||
          (provider === "mpesa" && !phone) ||
          (provider === "wallet" && walletBalanceKes < Number(amount))
        }
        onClick={handlePay}
      >
        {pending
          ? "Processing…"
          : provider === "wallet"
            ? "Pay from wallet"
            : provider === "mpesa"
              ? "Pay with M-Pesa"
              : provider === "card"
                ? "Pay with card"
                : "Pay with crypto"}
      </Button>

      {provider === "wallet" && walletBalanceKes < Number(amount) ? (
        <p className="mt-2 text-xs text-muted">Top up your wallet first to pay from balance.</p>
      ) : null}
    </div>
  );
}
