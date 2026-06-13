"use client";

import { useRouter } from "next/navigation";
import { DocumentUpload } from "@/components/portal/document-upload";

type Doc = {
  id: string;
  category: string;
  file_name: string;
  status: string;
  created_at: string;
};

export function DocumentUploadPanel({
  companyId,
  categories,
  documents,
}: {
  companyId: string;
  categories: string[];
  documents: Doc[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <DocumentUpload
            ownerType="company"
            ownerId={companyId}
            category={category}
            onUploaded={() => router.refresh()}
          />
          <ul className="mt-3 space-y-2">
            {documents
              .filter((d) => d.category === category)
              .map((d) => (
                <li key={d.id} className="text-sm text-muted">
                  {d.file_name} · {d.status.replaceAll("_", " ")}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
