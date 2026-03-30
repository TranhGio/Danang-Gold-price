import { Env, TelegramUpdate } from "./types";
import { SHOPS, getShopById } from "./shops";
import { sendMessage, answerCallbackQuery, getFile, downloadFile, buildShopKeyboard } from "./telegram";
import { updateShopImage, updateShopTimestamp } from "./github";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    // Validate webhook secret
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 403 });
    }

    const update = (await request.json()) as TelegramUpdate;
    const chatId = update.message?.chat?.id ?? update.callback_query?.message?.chat?.id;

    // ALLOWED_CHAT_IDS supports comma-separated IDs, e.g. "123456,789012"
    const allowedIds = env.ALLOWED_CHAT_IDS.split(",").map((id) => id.trim());
    if (!chatId || !allowedIds.includes(String(chatId))) {
      return new Response("OK");
    }

    try {
      // Handle /start or /update command
      if (update.message?.text?.startsWith("/start") || update.message?.text?.startsWith("/update")) {
        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, "Chọn tiệm vàng cần cập nhật:", buildShopKeyboard(SHOPS));
        return new Response("OK");
      }

      // Handle /cancel command
      if (update.message?.text?.startsWith("/cancel")) {
        await env.BOT_STATE.delete(`user:${chatId}`);
        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, "Đã hủy. Gửi /update để bắt đầu lại.");
        return new Response("OK");
      }

      // Handle shop selection (callback query from inline button)
      if (update.callback_query) {
        const shopId = update.callback_query.data;
        if (!shopId || !getShopById(shopId)) {
          return new Response("OK");
        }

        await env.BOT_STATE.put(`user:${chatId}`, shopId, { expirationTtl: 300 });
        await answerCallbackQuery(env.TELEGRAM_BOT_TOKEN, update.callback_query.id);

        const shop = getShopById(shopId)!;
        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `Gửi ảnh giá vàng ${shop.name}:`);
        return new Response("OK");
      }

      // Handle photo message
      const fileId = getFileId(update);
      if (fileId) {
        const shopId = await env.BOT_STATE.get(`user:${chatId}`);
        if (!shopId) {
          await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, "Vui lòng chọn tiệm vàng trước. Gửi /update");
          return new Response("OK");
        }

        const shop = getShopById(shopId);
        if (!shop) {
          return new Response("OK");
        }

        await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `Đang cập nhật ${shop.name}...`);

        // Download photo from Telegram
        const filePath = await getFile(env.TELEGRAM_BOT_TOKEN, fileId);
        const imageData = await downloadFile(env.TELEGRAM_BOT_TOKEN, filePath);

        // Commit image to GitHub
        await updateShopImage(env.GITHUB_TOKEN, env.GITHUB_REPO, env.GITHUB_BRANCH, shop.filename, imageData);

        // Update timestamp in goldShops.ts
        const vnTime = getVietnamTime();
        await updateShopTimestamp(env.GITHUB_TOKEN, env.GITHUB_REPO, env.GITHUB_BRANCH, shop.id, vnTime);

        // Clear state
        await env.BOT_STATE.delete(`user:${chatId}`);

        await sendMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          `Đã cập nhật ${shop.name} lúc ${vnTime}. Trang web sẽ tự động deploy trong ~2 phút.`
        );
        return new Response("OK");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `Lỗi: ${errorMsg}`);
    }

    return new Response("OK");
  },
};

function getFileId(update: TelegramUpdate): string | null {
  // Photo sent as photo (compressed)
  if (update.message?.photo?.length) {
    return update.message.photo[update.message.photo.length - 1].file_id;
  }
  // Photo sent as document (original quality)
  if (update.message?.document?.mime_type?.startsWith("image/")) {
    return update.message.document.file_id;
  }
  return null;
}

function getVietnamTime(): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}
