const API_BASE = "https://api.telegram.org";

export async function sendMessage(
  token: string,
  chatId: number,
  text: string,
  replyMarkup?: object
) {
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  await fetch(`${API_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function answerCallbackQuery(token: string, callbackQueryId: string, text?: string) {
  await fetch(`${API_BASE}/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function getFile(token: string, fileId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/bot${token}/getFile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId }),
  });
  const data = (await res.json()) as { result: { file_path: string } };
  return data.result.file_path;
}

export async function downloadFile(token: string, filePath: string): Promise<ArrayBuffer> {
  const res = await fetch(`${API_BASE}/file/bot${token}/${filePath}`);
  return res.arrayBuffer();
}

export function buildShopKeyboard(shops: ReadonlyArray<{ id: string; name: string }>) {
  return {
    inline_keyboard: shops.map((shop) => [
      { text: shop.name, callback_data: shop.id },
    ]),
  };
}
