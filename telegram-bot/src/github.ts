const API_BASE = "https://api.github.com";

interface FileContent {
  content: string;
  sha: string;
}

export async function getFileContent(
  token: string,
  repo: string,
  path: string,
  branch: string
): Promise<FileContent> {
  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "gold-price-bot",
    },
  });
  const data = (await res.json()) as { content: string; sha: string };
  return { content: data.content, sha: data.sha };
}

export async function updateFile(
  token: string,
  repo: string,
  path: string,
  content: string,
  sha: string,
  message: string,
  branch: string
) {
  const res = await fetch(`${API_BASE}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "gold-price-bot",
    },
    body: JSON.stringify({ message, content, sha, branch }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${err}`);
  }
}

export async function updateShopImage(
  token: string,
  repo: string,
  branch: string,
  shopFilename: string,
  imageData: ArrayBuffer
) {
  const path = `public/images/${shopFilename}`;

  // Get current file SHA
  const { sha } = await getFileContent(token, repo, path, branch);

  // Base64 encode the image
  const base64 = arrayBufferToBase64(imageData);

  await updateFile(token, repo, path, base64, sha, `Update ${shopFilename}`, branch);
}

export async function updateShopTimestamp(
  token: string,
  repo: string,
  branch: string,
  shopId: string,
  time: string
) {
  const path = "app/data/goldShops.ts";

  const { content: encodedContent, sha } = await getFileContent(token, repo, path, branch);

  // Decode base64 content
  const fileContent = atob(encodedContent.replace(/\n/g, ""));

  // Replace updatedAt for the specific shop
  const regex = new RegExp(
    `(id:\\s*"${shopId}"[\\s\\S]*?updatedAt:\\s*")([^"]*)(")`,
  );
  const updatedContent = fileContent.replace(regex, `$1${time}$3`);

  if (updatedContent === fileContent) {
    throw new Error(`Could not find shop "${shopId}" in goldShops.ts`);
  }

  // Base64 encode and commit
  const base64 = btoa(updatedContent);
  await updateFile(token, repo, path, base64, sha, `Update ${shopId} timestamp to ${time}`, branch);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
