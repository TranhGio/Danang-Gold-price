const API_BASE = "https://api.github.com";

const HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
  "User-Agent": "gold-price-bot",
});

async function githubApi(token: string, url: string, method = "GET", body?: object) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: HEADERS(token),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${err}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

export async function updateShopImageAndTimestamp(
  token: string,
  repo: string,
  branch: string,
  shopId: string,
  shopFilename: string,
  imageData: ArrayBuffer,
  time: string
) {
  const ref = `refs/heads/${branch}`;

  // 1. Get the latest commit SHA on the branch
  const refData = await githubApi(token, `/repos/${repo}/git/${ref}`);
  const latestCommitSha = (refData.object as { sha: string }).sha;

  // 2. Get the tree SHA of the latest commit
  const commitData = await githubApi(token, `/repos/${repo}/git/commits/${latestCommitSha}`);
  const baseTreeSha = (commitData.tree as { sha: string }).sha;

  // 3. Create a blob for the image
  const imageBlob = await githubApi(token, `/repos/${repo}/git/blobs`, "POST", {
    content: arrayBufferToBase64(imageData),
    encoding: "base64",
  });

  // 4. Get current goldShops.ts content and update timestamp
  const fileRes = await githubApi(token, `/repos/${repo}/contents/app/data/goldShops.ts?ref=${branch}`);
  const fileContent = atob((fileRes.content as string).replace(/\n/g, ""));

  const regex = new RegExp(`(id:\\s*"${shopId}"[\\s\\S]*?updatedAt:\\s*")([^"]*)("`);
  const updatedContent = fileContent.replace(regex, `$1${time}$3`);
  if (updatedContent === fileContent) {
    throw new Error(`Could not find shop "${shopId}" in goldShops.ts`);
  }

  // 5. Create a blob for the updated goldShops.ts
  const tsBlob = await githubApi(token, `/repos/${repo}/git/blobs`, "POST", {
    content: btoa(updatedContent),
    encoding: "base64",
  });

  // 6. Create a new tree with both file changes
  const newTree = await githubApi(token, `/repos/${repo}/git/trees`, "POST", {
    base_tree: baseTreeSha,
    tree: [
      {
        path: `public/images/${shopFilename}`,
        mode: "100644",
        type: "blob",
        sha: imageBlob.sha,
      },
      {
        path: "app/data/goldShops.ts",
        mode: "100644",
        type: "blob",
        sha: tsBlob.sha,
      },
    ],
  });

  // 7. Create a new commit
  const newCommit = await githubApi(token, `/repos/${repo}/git/commits`, "POST", {
    message: `Update ${shopId} price image (${time})`,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 8. Update the branch ref to point to the new commit
  await githubApi(token, `/repos/${repo}/git/${ref}`, "PATCH", {
    sha: newCommit.sha,
  });
}

export async function updatePopupRedirectUrl(
  token: string,
  repo: string,
  branch: string,
  newUrl: string
) {
  const ref = `refs/heads/${branch}`;

  // 1. Get the latest commit SHA on the branch
  const refData = await githubApi(token, `/repos/${repo}/git/${ref}`);
  const latestCommitSha = (refData.object as { sha: string }).sha;

  // 2. Get the tree SHA of the latest commit
  const commitData = await githubApi(token, `/repos/${repo}/git/commits/${latestCommitSha}`);
  const baseTreeSha = (commitData.tree as { sha: string }).sha;

  // 3. Get current popup.ts and update redirectUrl
  const fileRes = await githubApi(token, `/repos/${repo}/contents/app/data/popup.ts?ref=${branch}`);
  const fileContent = atob((fileRes.content as string).replace(/\n/g, ""));

  const updatedContent = fileContent.replace(
    /(redirectUrl:\s*")([^"]*)(")/, `$1${newUrl}$3`
  );
  if (updatedContent === fileContent) {
    throw new Error("Could not find redirectUrl in popup.ts");
  }

  // 4. Create a blob for the updated popup.ts
  const blob = await githubApi(token, `/repos/${repo}/git/blobs`, "POST", {
    content: btoa(updatedContent),
    encoding: "base64",
  });

  // 5. Create a new tree
  const newTree = await githubApi(token, `/repos/${repo}/git/trees`, "POST", {
    base_tree: baseTreeSha,
    tree: [
      {
        path: "app/data/popup.ts",
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      },
    ],
  });

  // 6. Create a new commit
  const newCommit = await githubApi(token, `/repos/${repo}/git/commits`, "POST", {
    message: `Update popup redirect URL`,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // 7. Update the branch ref
  await githubApi(token, `/repos/${repo}/git/${ref}`, "PATCH", {
    sha: newCommit.sha,
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
