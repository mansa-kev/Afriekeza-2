"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadDocument } from "@/lib/actions/portal";
import { Button } from "@/components/ui/button";

type Props = {
  ownerType: "investor" | "company";
  ownerId: string;
  category: string;
  onUploaded?: () => void;
};

export function DocumentUpload({ ownerType, ownerId, category, onUploaded }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Sign in required");
        return;
      }

      const path = `${user.id}/${ownerType}/${ownerId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const result = await uploadDocument({
        ownerType,
        ownerId,
        category,
        fileName: file.name,
        storagePath: path,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      onUploaded?.();
      event.target.value = "";
    });
  }

  return (
    <div className="rounded-xl border border-dashed border-header-border bg-white p-4">
      <label className="block text-sm font-medium text-dark">{category}</label>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls"
        className="mt-2 block w-full text-sm text-muted"
        disabled={pending}
        onChange={handleFileChange}
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {pending ? <p className="mt-2 text-sm text-muted">Uploading…</p> : null}
    </div>
  );
}
