export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  GITHUB_TOKEN: string;
  ALLOWED_CHAT_IDS: string; // comma-separated, e.g. "123456,789012"
  WEBHOOK_SECRET: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  BOT_STATE: KVNamespace;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text?: string;
  photo?: PhotoSize[];
  document?: Document;
}

export interface CallbackQuery {
  id: string;
  data?: string;
  message?: TelegramMessage;
}

export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface Document {
  file_id: string;
  file_name?: string;
  mime_type?: string;
}
