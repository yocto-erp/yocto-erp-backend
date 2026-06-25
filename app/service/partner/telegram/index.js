import { appLog } from '../../../config/winston';

export const YOCTO_MONITORING_CHAT_ID = -417285318;

const { Telegram } = require('telegraf');

const telegram = new Telegram(process.env.TELEGRAM_BOT, {
  webhookReply: false
});

export async function sendMessage(message) {
  try {
    await telegram.sendMessage(YOCTO_MONITORING_CHAT_ID, message,
      { parse_mode: 'HTML' });
  } catch (e) {
    appLog.error(e.stack);
  }
}

export async function sendErrorMessage(message) {
  try {
    await telegram.sendMessage(YOCTO_MONITORING_CHAT_ID, `<code>${message}</code>`,
      { parse_mode: 'HTML' });
  } catch (e) {
    appLog.error(e.stack);
  }
}
