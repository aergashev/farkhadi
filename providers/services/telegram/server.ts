import "server-only"

import type { Order } from "@/entities/order/data/shared/types"
import { formatPrice } from "@/shared/lib/format"
import { getDictionary, DEFAULT_LOCALE } from "@/providers/lib/i18n/shared"

/**
 * Telegram order-notification service.
 * Sends a formatted message to the shop's Telegram chat when a new order
 * arrives. Credentials come from env (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID).
 * Failures are swallowed so they never block the customer's checkout.
 */

const CURRENCY = getDictionary(DEFAULT_LOCALE).common.currency

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function buildMessage(order: Order): string {
  const lines = order.items
    .map(
      (item) =>
        `• ${escapeHtml(item.name)} × ${item.quantity} — <b>${formatPrice(
          item.price * item.quantity,
        )}</b> ${CURRENCY}`,
    )
    .join("\n")

  const comment = order.customer.comment
    ? `\n💬 <i>${escapeHtml(order.customer.comment)}</i>`
    : ""

  return [
    `🛍 <b>Yangi buyurtma — ${escapeHtml(order.number)}</b>`,
    "",
    `👤 <b>${escapeHtml(order.customer.name)}</b>`,
    `📞 ${escapeHtml(order.customer.phone)}`,
    `📍 ${escapeHtml(order.customer.address)}${comment}`,
    "",
    lines,
    "",
    `💰 <b>Jami: ${formatPrice(order.total)} ${CURRENCY}</b>`,
  ].join("\n")
}

export async function sendOrderNotification(order: Order): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[telegram] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set")
    }
    return false
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(order),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        // Don't let a slow Telegram API hang the checkout request.
        signal: AbortSignal.timeout(8000),
      },
    )
    if (!res.ok) {
      console.error("[telegram] sendMessage failed:", res.status, await res.text())
      return false
    }
    return true
  } catch (error) {
    console.error("[telegram] notification error:", error)
    return false
  }
}
