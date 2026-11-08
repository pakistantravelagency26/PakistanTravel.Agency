# Transactional Email & DNS Configuration Guide

This document specifies the email infrastructure, DNS authentication records (SPF, DKIM, DMARC, MX), and environment variables for **PakistanTravel.Agency** (`www.pakistantravel.agency`).

---

## 1. Architecture Overview: Resilient Transactional Outbox Pattern

All transactional emails (Customer Booking Confirmations, Vendor Host Notifications, Admin Alerts, and Cancellation Notices) are processed through an **ACID Transactional Outbox** (`EmailOutbox` model in Neon PostgreSQL):

1. **Atomic Insertion**: Emails are written to the database in the same transaction or immediately following booking lifecycle events.
2. **Guaranteed Delivery**: If external network issues or SMTP throttling occur, records persist in `EmailOutbox` with status `PENDING` and retry counters (`attempts`).
3. **Graceful Fallback**: If SMTP credentials are not yet populated in the environment, simulated dispatches are logged to standard out without throwing unhandled exceptions, ensuring checkouts and cancellations are never blocked.
4. **Audit Trail**: Every outgoing communication has its timestamp, recipient, subject, and delivery status permanently recorded in the database.

---

## 2. DNS Authentication Records (Domain Registrar / Cloudflare)

To guarantee high deliverability, avoid spam folders, and satisfy modern DMARC requirements (Gmail & Yahoo 2024+ sender guidelines), configure the following DNS records for `pakistantravel.agency`:

### A. SPF (Sender Policy Framework)
- **Type:** `TXT`
- **Name / Host:** `@` (or `pakistantravel.agency`)
- **TTL:** `Auto` (or `3600`)
- **Content / Value:**
  ```text
  v=spf1 include:_spf.mx.cloudflare.net include:sendgrid.net ~all
  ```
  *(Note: Replace `sendgrid.net` with your specific SMTP provider's include string, e.g., `include:mailgun.org`, `include:amazonses.com`, or `include:resend.com`)*

### B. DKIM (DomainKeys Identified Mail)
- **Type:** `CNAME` or `TXT` (Provided by your SMTP provider, e.g., Resend, SendGrid, Amazon SES)
- **Name / Host:** `smtp._domainkey` (or selector specified by provider)
- **Value:** `k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...` *(Provided by provider dashboard)*

### C. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
- **Type:** `TXT`
- **Name / Host:** `_dmarc`
- **TTL:** `Auto` (or `3600`)
- **Content / Value:**
  ```text
  v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@pakistantravel.agency; aspf=r;
  ```
  *(Once email alignment is verified, update `p=quarantine` to `p=reject` for strict spoofing protection)*

### D. MX Records (Inbound Support Mail)
- If handling incoming email at `support@pakistantravel.agency` via Google Workspace or Cloudflare Email Routing:
  - **Type:** `MX`
  - **Priority:** `10`
  - **Value:** `route1.mx.cloudflare.net` (or `aspmx.l.google.com`)

---

## 3. Environment Variables Specification

Set the following variables in your production environment (Vercel Project Settings or VPS `.env`):

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `SMTP_HOST` | Hostname of SMTP server | `smtp.resend.com` / `smtp.sendgrid.net` |
| `SMTP_PORT` | Port for TLS / STARTTLS | `587` (or `465` for SSL) |
| `SMTP_USER` | SMTP authentication username | `apikey` / `smtp_user` |
| `SMTP_PASSWORD` | SMTP authentication secret / API key | `re_123456789...` |
| `SMTP_FROM` | Sender address visible to recipients | `PakistanTravel.Agency <no-reply@pakistantravel.agency>` |
| `ADMIN_ALERT_EMAIL` | Inbox receiving real-time booking alerts | `ops@pakistantravel.agency` |
| `SUPPORT_EMAIL` | Customer-facing support contact email | `support@pakistantravel.agency` |

---

## 4. Dispatched Notification Matrix

| Event | Recipient | Subject Format | Contents |
| :--- | :--- | :--- | :--- |
| **Booking Confirmed** | Customer | `Booking Confirmed: [REF] - [Listing]` | Booking details, dates, amount paid, balance due, host phone/whatsapp, link to voucher PDF, cancellation policy |
| **Booking Confirmed** | Vendor (Host) | `New Booking Received! Ref: [REF] ([Listing])` | Guest details, pax, dates, gross PKR, commission deducted, net vendor payout, payout timing (`within 48 hours`) |
| **Booking Confirmed** | Admin | `[Admin Alert] New Marketplace Booking: [REF]` | Gross volume, platform fee earned, vendor details, payment method, link to admin |
| **Booking Cancelled** | Customer | `Booking Cancelled: [REF] - [Listing]` | Cancellation notice, refund eligibility terms according to cancellation policy |
| **Booking Cancelled** | Vendor (Host) | `Booking Cancelled by Guest: Ref: [REF]` | Notice that dates/seats are replenished to inventory |
| **Booking Cancelled** | Admin | `[Admin Alert] Booking Cancelled: [REF]` | Alert for audit and refund reconciliation |
