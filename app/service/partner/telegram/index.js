export const YOCTO_MONITORING_CHAT_ID = -417285318;

const {Telegram} = require('telegraf')

const telegram = new Telegram(process.env.TELEGRAM_BOT, {
  webhookReply: false
})

export function sendMessage(message) {
  return telegram.sendMessage(YOCTO_MONITORING_CHAT_ID, message,
    {parse_mode: 'HTML'})
}

export function sendErrorMessage(message) {
  return telegram.sendMessage(YOCTO_MONITORING_CHAT_ID, `<code>${message}</code>`,
    {parse_mode: 'HTML'})
}
