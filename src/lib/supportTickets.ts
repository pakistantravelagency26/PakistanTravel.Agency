import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { maskSensitiveData } from "./chatSanitizer";
import { generateTicketNumber } from "./ticketUtils";

export { generateTicketNumber };

export interface CreateTicketInput {
  customerName: string;
  customerContact: string;
  category?: "COMPLAINT" | "REFUND" | "PAYMENT" | "GENERAL";
  message: string;
  source?: "CHATBOT" | "CONTACT_FORM";
  metadata?: Record<string, unknown>;
}

export async function createSupportTicket(input: CreateTicketInput) {
  const ticketNumber = generateTicketNumber();
  const sanitizedMessage = maskSensitiveData(input.message.trim());
  const sanitizedContact = maskSensitiveData(input.customerContact.trim());
  const sanitizedName = input.customerName.trim().slice(0, 100);

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      customerName: sanitizedName,
      customerContact: sanitizedContact,
      category: input.category || "GENERAL",
      message: sanitizedMessage,
      source: input.source || "CHATBOT",
      status: "OPEN",
      priority: input.category === "REFUND" || input.category === "COMPLAINT" ? "HIGH" : "MEDIUM",
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[Support Ticket Created] ${ticket.ticketNumber} | Priority: ${ticket.priority} | Notify: ${siteConfig.contact.supportEmail}`
    );
  }

  return ticket;
}
