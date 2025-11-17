# n8n Workflow Integration Guide for ClassVisa

This guide walks you through setting up three powerful n8n workflows to automate your e-commerce operations.

## Overview

Three workflows are provided:

1. **🛍️ Order & Fulfillment Automation** — Instant team notifications, order logging, and PDF invoice generation
2. **📦 Inventory & Operations Management** — Low stock alerts and automated supplier sync
3. **⭐ Customer Support Triage** — Sentiment analysis on reviews, automated ticket creation, and team alerts

---

## Prerequisites

- **n8n instance** running (self-hosted or cloud at https://n8n.io)
- **Third-party integrations** (credentials and accounts):
  - Slack workspace with a bot token
  - Google account (Drive, Docs, Sheets API enabled)
  - OpenAI API key (for sentiment analysis)
  - Zendesk account (for support tickets)
  - Stripe account (already configured)
- **Environment variables** set in `.env` file
- **ClassVisa API running** at `http://localhost:3000` (or your deployment URL)

---

## Setup Steps

### 1. Environment Variables

Add the following to your `.env` file:

```bash
# n8n Webhooks (created after importing workflows)
CLASSICVISA_ORDER_WEBHOOK_ID="your-order-webhook-uuid"
CLASSICVISA_REVIEW_WEBHOOK_ID="your-review-webhook-uuid"
CLASSICVISA_API_KEY="your-api-key-for-accessing-classicvisa-endpoints"

# Google Workspace
GOOGLE_SHEETS_SALES_ID="your-google-sheets-id-for-orders"
GOOGLE_SHEETS_REVIEWS_ID="your-google-sheets-id-for-reviews"
GOOGLE_DRIVE_INVOICES_FOLDER="your-google-drive-folder-id-for-invoices"

# Supplier Integration
SUPPLIER_SPREADSHEET_URL="https://your-supplier-url/inventory.csv"

# OpenAI (for sentiment analysis)
OPENAI_API_KEY="sk-..."

# Zendesk
ZENDESK_DOMAIN="your-company.zendesk.com"
ZENDESK_API_TOKEN="your-zendesk-api-token"
```

### 2. Import Workflows into n8n

1. **Start n8n** or access your n8n instance
2. **Go to Workflows** → **Import from file** or **Create new** → **Import**
3. **Upload each JSON file**:
   - `01-order-fulfillment-automation.json`
   - `02-inventory-operations.json`
   - `03-customer-support-triage.json`

### 3. Configure Credentials in n8n

After importing, each workflow will need credentials configured:

#### Workflow 1: Order & Fulfillment

- **Slack API**: Use your Slack bot token (create one in Slack App settings)
- **Google Sheets OAuth2**: Authorize with your Google account
- **Google Docs OAuth2**: Same Google account
- **Google Drive OAuth2**: Same Google account

#### Workflow 2: Inventory & Operations

- **Slack API**: Same as above
- **ClassVisa API Key**: Create an API key in your admin panel (or use `Bearer token` authentication)
- **Supplier CSV URL**: Ensure this URL is publicly accessible or authenticated

#### Workflow 3: Customer Support Triage

- **OpenAI API**: Paste your OpenAI API key
- **Slack API**: Same as above
- **Zendesk API**: Create an API token in Zendesk settings
- **Google Sheets OAuth2**: For analytics logging

### 4. Create Slack Channels

Create these channels in your Slack workspace:

```
#orders         — for new order notifications
#inventory      — for low stock alerts
#support-alerts — for negative reviews requiring urgent action
#customer-praise — for positive reviews to celebrate wins
```

### 5. Enable and Activate Webhooks

For workflows 1 and 3 (which use webhooks):

1. **Activate the workflow** in n8n (toggle on the main workflow page)
2. **Copy the webhook URL** — it will show in the webhook trigger node:
   - Example: `https://your-n8n.io/webhook/abc123def456`
3. **Register webhook in ClassVisa**:
   - For orders: Call `POST /api/webhooks/register` with `event: "order.created"` and the webhook URL
   - For reviews: Call `POST /api/webhooks/register` with `event: "review.created"` and the webhook URL

---

## Webhook URLs

Once deployed, your workflows will have these webhook URLs:

### Workflow 1: Order & Fulfillment
```
POST https://your-n8n-instance.io/webhook/orders/new
Content-Type: application/json

{
  "order": {
    "id": "order-123",
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "total": 5999,
    "items": [
      { "productId": "prod-1", "quantity": 2, "price": 2999 }
    ],
    "status": "paid",
    "shippingAddress": "123 Main St, City, State 12345",
    "createdAt": "2025-11-17T10:30:00Z"
  }
}
```

### Workflow 2: Inventory & Operations
```
Runs automatically on a schedule (daily at 1 AM)
No webhook needed — uses scheduled trigger
```

### Workflow 3: Customer Support Triage
```
POST https://your-n8n-instance.io/webhook/reviews/new
Content-Type: application/json

{
  "review": {
    "id": "review-456",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "productId": "prod-1",
    "productName": "Silk Pillowcase",
    "rating": 2,
    "text": "Product arrived damaged and customer service was unhelpful.",
    "createdAt": "2025-11-17T11:00:00Z"
  }
}
```

---

## API Endpoints Required in ClassVisa

The workflows expect the following API endpoints to exist in your Next.js app:

### 1. Get All Inventory (for inventory workflow)
```
GET /api/products/inventory
Authorization: Bearer {CLASSICVISA_API_KEY}

Response:
{
  "products": [
    { "id": "prod-1", "name": "Silk Pillowcase", "stock": 5 },
    { "id": "prod-2", "name": "Sleep Mask", "stock": 25 }
  ]
}
```

### 2. Sync Inventory (for inventory workflow)
```
PATCH /api/products/sync-inventory
Authorization: Bearer {CLASSICVISA_API_KEY}
Content-Type: application/json

{
  "updates": [
    { "productId": "prod-1", "stock": 10 },
    { "productId": "prod-2", "stock": 30 }
  ]
}
```

### 3. Webhook Registration (optional, for setting up triggers)
```
POST /api/webhooks/register
Authorization: Bearer {CLASSICVISA_API_KEY}
Content-Type: application/json

{
  "event": "order.created",
  "url": "https://your-n8n-instance.io/webhook/orders/new"
}
```

---

## Testing the Workflows

### Test Order Fulfillment Workflow

1. Go to n8n and open **Workflow 1**
2. Click the webhook trigger node and copy the test URL
3. Use curl to simulate an order:

```bash
curl -X POST https://your-n8n.io/webhook/orders/new \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "id": "test-order-1",
      "shippingName": "Test Customer",
      "shippingEmail": "test@example.com",
      "total": 9999,
      "items": [{"productId": "test-1", "quantity": 1, "price": 9999}],
      "status": "paid",
      "shippingAddress": "Test Address",
      "createdAt": "'$(date -u +'%Y-%m-%dT%H:%M:%SZ')'"
    }
  }'
```

Expected result:
- ✅ Slack message in `#orders`
- ✅ Row added to Google Sheets
- ✅ PDF invoice created in Google Drive
- ✅ Customer folder created with invoice

### Test Inventory Workflow

1. Open **Workflow 2** in n8n
2. Click "Execute Workflow" to manually trigger it
3. Expected result:
   - ✅ Low stock items checked
   - ✅ If any items < 10 units, Slack alert sent to `#inventory`
   - ✅ Supplier CSV fetched and inventory synced

### Test Customer Support Triage Workflow

1. Go to n8n and open **Workflow 3**
2. Click the webhook trigger node and copy the test URL
3. Use curl to simulate a review:

```bash
curl -X POST https://your-n8n.io/webhook/reviews/new \
  -H "Content-Type: application/json" \
  -d '{
    "review": {
      "id": "test-review-1",
      "customerName": "Unhappy Customer",
      "customerEmail": "unhappy@example.com",
      "productId": "prod-1",
      "productName": "Silk Pillowcase",
      "rating": 1,
      "text": "This product is terrible quality. It tore after one wash. Very disappointed and regret my purchase.",
      "createdAt": "'$(date -u +'%Y-%m-%dT%H:%M:%SZ')'"
    }
  }'
```

Expected result for negative review:
- ✅ Slack alert in `#support-alerts`
- ✅ High-priority ticket created in Zendesk
- ✅ Review logged to Google Sheets

---

## Monitoring & Maintenance

### Check Workflow Execution Logs

In n8n, each workflow shows:
- **Execution History** — view past runs and results
- **Error Logs** — troubleshoot failures
- **Success Rate** — monitor reliability

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Webhook returns 401 | Missing/invalid credentials | Verify API keys in n8n credentials |
| Slack message not sent | Channel doesn't exist or bot not in channel | Create channel, invite bot, check permissions |
| Google Sheets not updating | OAuth token expired | Re-authenticate Google account in n8n |
| Inventory sync fails | API endpoint not reachable | Verify ClassVisa API is running and accessible |
| Sentiment analysis errors | OpenAI API quota exceeded | Check OpenAI account usage/billing |

### Performance Tips

1. **Batch operations**: For many orders, consider batching webhook calls
2. **Schedule optimization**: Run inventory checks at off-peak hours (1 AM)
3. **Error handling**: Set up webhook error notifications to Slack
4. **Rate limiting**: Add delays between API calls if hitting rate limits

---

## Next Steps

After setting up these three workflows, consider adding:

1. **Customer Email Notifications** — Send order confirmation & shipping updates via email
2. **Analytics Dashboard** — Create a real-time dashboard in n8n showing sales, inventory, reviews
3. **Supplier Communications** — Auto-send low stock alerts to suppliers
4. **Refund Automation** — Auto-process refunds for negative reviews (with manual approval)
5. **Social Media Posting** — Auto-post positive reviews to Instagram/Twitter

---

## Support & Troubleshooting

- **n8n Documentation**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **Slack App Directory**: https://api.slack.com/apps
- **Google API Console**: https://console.cloud.google.com
- **Zendesk API Docs**: https://developer.zendesk.com

---

## File Structure

```
classVisa/
├── n8n-workflows/
│   ├── 01-order-fulfillment-automation.json
│   ├── 02-inventory-operations.json
│   ├── 03-customer-support-triage.json
│   └── README.md (this file)
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   └── inventory/route.ts (needs implementation)
│   │   └── webhooks/
│   │       └── register/route.ts (needs implementation)
│   └── ...
└── .env (add n8n configuration here)
```

---

**Happy automating! 🚀**
