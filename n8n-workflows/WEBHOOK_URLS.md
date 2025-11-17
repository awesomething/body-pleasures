# n8n Webhook URLs & Configuration

This file contains all the webhook URLs and configuration needed to connect ClassVisa with n8n workflows.

## Webhook URLs

After importing the three workflows into n8n, you'll have these webhook endpoints:

### 1️⃣ Order & Fulfillment Automation

**Webhook Path**: `/webhook/orders/new`

**Full URL** (replace with your n8n domain):
```
https://your-n8n-instance.io/webhook/orders/new
```

**Trigger**: New order created (POST)

**Payload Example**:
```json
{
  "order": {
    "id": "order-uuid-123",
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "total": 9999,
    "items": [
      {
        "productId": "prod-123",
        "quantity": 2,
        "price": 4999
      }
    ],
    "status": "paid",
    "shippingAddress": "123 Main St, Anytown, ST 12345",
    "createdAt": "2025-11-17T10:30:00Z"
  }
}
```

**ClassVisa Integration**:
```bash
# In your .env
N8N_ORDER_WEBHOOK_URL="https://your-n8n-instance.io/webhook/orders/new"
```

**Expected Actions**:
- 📌 Slack notification in #orders
- 📊 Row added to Google Sheets (Sales Dashboard)
- 📄 PDF invoice generated
- 📁 Customer folder created in Google Drive

---

### 2️⃣ Inventory & Operations Management

**Trigger**: Scheduled (Daily at 1 AM UTC)

**Schedule**: Automatic (no webhook needed)

**Actions**:
1. Fetches current inventory from `/api/products/inventory`
2. Filters for low stock items (< 10 units)
3. Sends Slack alert to #inventory if any low stock
4. Fetches supplier CSV from `SUPPLIER_SPREADSHEET_URL`
5. Syncs inventory to ClassVisa via `/api/products/sync-inventory`

**ClassVisa API Endpoints Required**:

```bash
# GET endpoint - return all products with stock levels
GET /api/products/inventory
Authorization: Bearer {CLASSICVISA_API_KEY}

Response:
{
  "products": [
    { "id": "prod-1", "name": "Silk Pillowcase", "stock": 5 },
    { "id": "prod-2", "name": "Sleep Mask", "stock": 25 }
  ]
}

# PATCH endpoint - update inventory
PATCH /api/products/sync-inventory
Authorization: Bearer {CLASSICVISA_API_KEY}
Content-Type: application/json

Request body:
{
  "batchUpdates": [
    { "sku": "SKU-001", "stock": 50 },
    { "sku": "SKU-002", "stock": 100 }
  ]
}
```

**Environment Variables**:
```bash
CLASSICVISA_API_KEY="your-api-key"
SUPPLIER_SPREADSHEET_URL="https://your-supplier.com/inventory.csv"
GOOGLE_SHEETS_SALES_ID="1BxiMVs0XRA5nFMKUVjgskT6N6Pxlv5xQmKNSwNi4qJw"
```

**Expected Actions**:
- 📱 Daily low stock alert to #inventory Slack channel
- 📊 Automatic inventory sync from supplier CSV
- 🔄 Product stock quantities updated in ClassVisa

---

### 3️⃣ Customer Support Triage & Review Analysis

**Webhook Path**: `/webhook/reviews/new`

**Full URL**:
```
https://your-n8n-instance.io/webhook/reviews/new
```

**Trigger**: New review posted (POST)

**Payload Example**:
```json
{
  "review": {
    "id": "review-uuid-456",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "productId": "prod-123",
    "productName": "Silk Pillowcase",
    "rating": 2,
    "text": "Product arrived damaged and customer service was not helpful.",
    "createdAt": "2025-11-17T11:00:00Z"
  }
}
```

**ClassVisa Integration**:
```bash
# In your .env
N8N_REVIEW_WEBHOOK_URL="https://your-n8n-instance.io/webhook/reviews/new"
```

**Expected Actions**:

**For Negative Reviews** (sentiment score < 0.5):
- 🚨 High-priority ticket created in Zendesk
- 🔴 Alert sent to #support-alerts Slack channel
- 📊 Review logged to Google Sheets for analytics

**For Positive Reviews** (sentiment score ≥ 0.5):
- ✅ Posted to #customer-praise Slack channel
- 📊 Review logged to Google Sheets for analytics

---

## .env Configuration Template

Copy and paste this into your `.env` file:

```bash
# ============================================
# n8n Webhook Configuration
# ============================================

# Order webhook (Order & Fulfillment Automation)
N8N_ORDER_WEBHOOK_URL="https://your-n8n-instance.io/webhook/orders/new"

# Review webhook (Customer Support Triage)
N8N_REVIEW_WEBHOOK_URL="https://your-n8n-instance.io/webhook/reviews/new"

# ClassVisa API Key (for inventory endpoints)
CLASSICVISA_API_KEY="your-secure-api-key-here"

# ============================================
# Google Workspace (Workflows 1 & 2 & 3)
# ============================================

# Google Sheets ID for order logging
GOOGLE_SHEETS_SALES_ID="your-sheets-id"

# Google Sheets ID for review analytics
GOOGLE_SHEETS_REVIEWS_ID="your-sheets-id"

# Google Drive Folder ID for invoice storage
GOOGLE_DRIVE_INVOICES_FOLDER="your-folder-id"

# ============================================
# Supplier Integration (Workflow 2)
# ============================================

# URL to supplier CSV (must be publicly accessible or authenticated)
SUPPLIER_SPREADSHEET_URL="https://your-supplier.com/inventory.csv"

# ============================================
# Third-party Integrations
# ============================================

# OpenAI API Key (for sentiment analysis in reviews)
OPENAI_API_KEY="sk-..."

# Zendesk Domain (e.g., your-company.zendesk.com)
ZENDESK_DOMAIN="your-company.zendesk.com"

# Zendesk API Token
ZENDESK_API_TOKEN="your-zendesk-token"

# ============================================
# Existing Configuration
# ============================================

DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## Step-by-Step Setup

### 1. Deploy or Access n8n

- **Option A**: Self-hosted: Run `docker pull n8nio/n8n && docker run -d -p 5678:5678 n8nio/n8n`
- **Option B**: Cloud: Sign up at https://app.n8n.cloud

### 2. Import Workflows

1. Go to **Workflows** in n8n
2. Click **Import from file**
3. Upload each JSON file from `n8n-workflows/`:
   - `01-order-fulfillment-automation.json`
   - `02-inventory-operations.json`
   - `03-customer-support-triage.json`

### 3. Configure Credentials

For each workflow, add credentials:
- **Slack**: Use bot token from your Slack app
- **Google APIs**: OAuth2 with your Google account
- **OpenAI**: Your API key
- **Zendesk**: API token from admin settings

### 4. Copy Webhook URLs

1. Open each workflow (Workflows 1 & 3)
2. Click the webhook trigger node
3. Copy the displayed webhook URL
4. Paste into `.env` file

### 5. Deploy ClassVisa Updates

1. Add webhook trigger calls to your checkout and review endpoints
2. Implement `/api/products/inventory` and `/api/products/sync-inventory`
3. Update `.env` with all the URLs and API keys
4. Run `pnpm dev` to start the server

### 6. Test Each Workflow

Use the test URLs and curl commands in the main `README.md`

---

## Slack Channel Setup

Create these channels in your Slack workspace:

```
#orders              → New order notifications
#inventory           → Low stock alerts (daily digest)
#support-alerts      → Negative review alerts (HIGH PRIORITY)
#customer-praise     → Positive reviews to celebrate
```

Then invite the n8n Slack bot to each channel.

---

## Troubleshooting Webhook URLs

### Issue: "Webhook URL not working"

1. **Verify n8n is running**: Visit https://your-n8n-instance.io
2. **Check webhook path**: Should be exactly `/webhook/orders/new` or `/webhook/reviews/new`
3. **Test with curl**:
   ```bash
   curl -X POST https://your-n8n-instance.io/webhook/orders/new \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Issue: "401 Unauthorized"

- Verify `CLASSICVISA_API_KEY` matches the key in n8n workflow credentials
- Check that API key is set in your ClassVisa `.env` and server is running

### Issue: "CORS errors"

- n8n webhooks don't have CORS restrictions, should work from any domain
- If still failing, check firewall/network policies

---

## Summary

| Workflow | Trigger | Slack Channels | External Services |
|----------|---------|----------------|--------------------|
| 🛍️ Order Fulfillment | Webhook: New Order | #orders | Slack, Google Drive/Docs/Sheets |
| 📦 Inventory Ops | Schedule: Daily 1 AM | #inventory | Slack, Google Sheets |
| ⭐ Support Triage | Webhook: New Review | #support-alerts, #customer-praise | Slack, Zendesk, Google Sheets, OpenAI |

---

**Ready to automate?** 🚀

1. Update `.env` with webhook URLs
2. Activate workflows in n8n
3. Integrate webhook triggers in ClassVisa
4. Test with sample data
5. Monitor executions in n8n dashboard
