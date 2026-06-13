const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const bucket = "documents";

async function ensureBucket() {
  const listRes = await fetch(`${url}/storage/v1/bucket`, {
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
  });

  if (!listRes.ok) {
    throw new Error(`List buckets failed: ${await listRes.text()}`);
  }

  const buckets = await listRes.json();
  if (buckets.some((b) => b.name === bucket)) {
    console.log(`Bucket "${bucket}" already exists`);
    return;
  }

  const createRes = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: bucket,
      public: false,
      file_size_limit: 52428800,
      allowed_mime_types: [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Create bucket failed: ${await createRes.text()}`);
  }

  console.log(`Created bucket "${bucket}"`);
}

ensureBucket().catch((err) => {
  console.error(err);
  process.exit(1);
});
