# n8n Automation Setup Checklist

Use this checklist to ensure all n8n workflows are properly configured and integrated with ClassVisa.

## 📋 Pre-Setup

- [ ] n8n instance is running (self-hosted or cloud)
- [ ] Access to n8n admin panel
- [ ] ClassVisa server running locally or deployed
- [ ] All dependencies installed: `pnpm install`
- [ ] Database initialized: `npx prisma migrate dev`

---

## 🔌 Credential Setup (Do This First)

### Slack
- [ ] Create a Slack app at https://api.slack.com/apps
- [ ] Copy Bot Token (starts with `xoxb-`)
- [ ] In n8n: Add credential "Slack API" with bot token
- [ ] Create Slack channels: #orders, #inventory, #support-alerts, #customer-praise
- [ ] Invite n8n bot to all channels

### Google Workspace
- [ ] Enable Google Sheets API at https://console.cloud.google.com
- [ ] Enable Google Drive API
- [ ] Enable Google Docs API
- [ ] In n8n: Add credential "Google Sheets OAuth2"
- [ ] Create Google Sheets for:
  - [ ] Orders log (name it or get ID)
  - [ ] Reviews analytics (name it or get ID)
- [ ] Create Google Drive folder for invoices (get folder ID)

### OpenAI
- [ ] Create API key at https://platform.openai.com/api-keys
- [ ] In n8n: Add credential "OpenAI API" with key

### Zendesk
- [ ] Go to https://your-company.zendesk.com/admin/api/clients
- [ ] Create API token
- [ ] In n8n: Add credential "Zendesk API" with domain and token

---

## 📥 Import Workflows

- [ ] Download workflow JSON files (or copy from project)
- [ ] In n8n Dashboard: **Workflows** → **Import from file**
- [ ] Import **01-order-fulfillment-automation.json**
- [ ] Import **02-inventory-operations.json**
- [ ] Import **03-customer-support-triage.json**
- [ ] Verify all workflows appear in your workflows list

---

## ⚙️ Configure Workflow Credentials

### Workflow 1: Order & Fulfillment
- [ ] Click workflow, open nodes:
  - [ ] **Slack: Team Notification** → select slackApi credential
  - [ ] **Google Sheets: Log Order** → select googleSheetsOAuth2Api
  - [ ] **Google Docs: Create Invoice** → select googleDocsOAuth2Api
  - [ ] **Google Drive: Create Customer Folder** → select googleDriveOAuth2Api
  - [ ] **Google Drive: Move Invoice** → select googleDriveOAuth2Api
- [ ] Click **Save**

### Workflow 2: Inventory & Operations
- [ ] Click workflow, open nodes:
  - [ ] **Slack: Send Low Stock Alert** → select slackApi credential
- [ ] Click **Save**

### Workflow 3: Customer Support Triage
- [ ] Click workflow, open nodes:
  - [ ] **OpenAI: Sentiment Analysis** → select openaiApi credential
  - [ ] **Zendesk: Create High Priority Ticket** → select zendeskApi credential
  - [ ] **Slack: Alert Support Team** → select slackApi credential
  - [ ] **Slack: Share Positive Review** → select slackApi credential
  - [ ] **Google Sheets: Log Review Analytics** → select googleSheetsOAuth2Api
- [ ] Click **Save**

---

## 🔗 Get Webhook URLs

### For Workflow 1: Order Fulfillment
- [ ] Open workflow in n8n
- [ ] Click the **"Webhook: New Order"** trigger node
- [ ] Copy the webhook URL (format: `https://your-n8n.io/webhook/orders/new`)
- [ ] In `.env`: Set `N8N_ORDER_WEBHOOK_URL="[paste url]"`

### For Workflow 3: Customer Support
- [ ] Open workflow in n8n
- [ ] Click the **"Webhook: New Review Posted"** trigger node
- [ ] Copy the webhook URL (format: `https://your-n8n.io/webhook/reviews/new`)
- [ ] In `.env`: Set `N8N_REVIEW_WEBHOOK_URL="[paste url]"`

---

## 🗂️ Update ClassVisa `.env`

Update your `.env` file with:

```bash
# n8n Webhooks
N8N_ORDER_WEBHOOK_URL="https://your-n8n-instance.io/webhook/orders/new"
N8N_REVIEW_WEBHOOK_URL="https://your-n8n-instance.io/webhook/reviews/new"

# ClassVisa API (for inventory endpoints)
CLASSICVISA_API_KEY="choose-a-secure-random-string"

# Google Workspace
GOOGLE_SHEETS_SALES_ID="your-sheet-id"
GOOGLE_SHEETS_REVIEWS_ID="your-sheet-id"
GOOGLE_DRIVE_INVOICES_FOLDER="your-folder-id"

# Supplier Integration
SUPPLIER_SPREADSHEET_URL="https://your-supplier.com/inventory.csv"

# OpenAI & Zendesk
OPENAI_API_KEY="sk-..."
ZENDESK_DOMAIN="your-company.zendesk.com"
ZENDESK_API_TOKEN="your-token"
```

- [ ] All URLs filled in
- [ ] All API keys added
- [ ] File saved

---

## 💻 Update ClassVisa Code

### Add Webhook Triggers to Order Creation

- [ ] Open your checkout/order creation endpoint (e.g., `/app/api/checkout/route.ts`)
- [ ] Import: `import { triggerOrderWebhook } from '@/lib/webhook-triggers'`
- [ ] After order is created, call:
  ```typescript
  await triggerOrderWebhook({
    id: order.id,
    shippingName: order.shippingName,
    shippingEmail: order.shippingEmail,
    total: order.total,
    items: [...],
    status: order.status,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
  })
  ```

### Add Webhook Triggers to Review Creation

- [ ] Create `/app/api/reviews/route.ts` if it doesn't exist
- [ ] Import: `import { triggerReviewWebhook } from '@/lib/webhook-triggers'`
- [ ] After review is created, call:
  ```typescript
  await triggerReviewWebhook({
    id: review.id,
    customerName: review.customerName,
    customerEmail: review.customerEmail,
    productId: review.productId,
    productName: product.name,
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt.toISOString(),
  })
  ```

### Implement Inventory API Endpoints

- [ ] Create `/app/api/products/inventory/route.ts`
  - [ ] GET endpoint returns list of products with stock levels
  - [ ] Requires Bearer token authentication
  
- [ ] Create `/app/api/products/sync-inventory/route.ts`
  - [ ] PATCH endpoint accepts batch inventory updates
  - [ ] Requires Bearer token authentication

- [ ] (Optional) Add Product and Review models to Prisma if missing:
  ```prisma
  model Product {
    id    String  @id @default(cuid())
    name  String
    stock Int     @default(100)
  }
  ```

### Type Check

- [ ] Run: `pnpm exec tsc --noEmit`
- [ ] All TypeScript errors resolved ✅

---

## 🚀 Activate Workflows

In n8n Dashboard:

- [ ] Open **Workflow 1: Order & Fulfillment**
  - [ ] Click toggle to **Active** (green)
  - [ ] Save

- [ ] Open **Workflow 2: Inventory & Operations**
  - [ ] Click toggle to **Active** (green)
  - [ ] Save
  - [ ] Verify schedule trigger (Daily 1 AM UTC)

- [ ] Open **Workflow 3: Customer Support Triage**
  - [ ] Click toggle to **Active** (green)
  - [ ] Save

---

## ✅ Test Each Workflow

### Test 1: Order Fulfillment

```bash
# Terminal 1: Start ClassVisa
pnpm dev

# Terminal 2: Create a test order
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "test-1", "quantity": 1, "price": 9999}],
    "shippingName": "Test User",
    "shippingEmail": "test@example.com",
    "shippingAddress": "123 Test St",
    "total": 9999
  }'
```

**Expected Results**:
- ✅ Slack message in #orders
- ✅ Row added to Google Sheets
- ✅ Invoice created in Google Docs
- ✅ Customer folder created in Google Drive

**Check**: Open n8n workflow, click "Show executions" — should see green checkmark

### Test 2: Inventory Operations

```bash
# In n8n Dashboard: Open Workflow 2
# Click "Execute Workflow" button
```

**Expected Results**:
- ✅ Workflow runs immediately (don't wait for 1 AM)
- ✅ If any products have stock < 10: Slack alert in #inventory
- ✅ Supplier CSV fetched and processed

**Check**: In n8n, verify all nodes completed successfully

### Test 3: Customer Support Triage

```bash
# Terminal: Create a test negative review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "test-1",
    "customerName": "Unhappy Customer",
    "customerEmail": "unhappy@example.com",
    "rating": 1,
    "text": "This product is terrible. Complete waste of money. Do not buy!"
  }'
```

**Expected Results** (for negative review):
- ✅ OpenAI sentiment analysis: "negative"
- ✅ Zendesk ticket created (high priority)
- ✅ Slack alert in #support-alerts
- ✅ Row added to Google Sheets

```bash
# Test a positive review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "test-1",
    "customerName": "Happy Customer",
    "customerEmail": "happy@example.com",
    "rating": 5,
    "text": "Amazing product! Exceeded expectations. Highly recommend!"
  }'
```

**Expected Results** (for positive review):
- ✅ OpenAI sentiment analysis: "positive"
- ✅ Slack message in #customer-praise
- ✅ Row added to Google Sheets
- ✅ NO Zendesk ticket created

**Check**: Open n8n workflow, click "Show executions" — verify execution flow

---

## 📊 Monitor & Maintain

- [ ] Check n8n **Dashboard** weekly for failed executions
- [ ] Review **Executions** tab of each workflow for errors
- [ ] Monitor Slack channels for alerts
- [ ] Verify Google Sheets are updating
- [ ] Check Zendesk for support tickets
- [ ] Adjust alert thresholds if needed (e.g., low stock threshold)

---

## 🆘 Troubleshooting

### Webhook Not Triggering

- [ ] Verify webhook URL in `.env` matches n8n
- [ ] Verify webhook trigger node is **Active** in n8n
- [ ] Check n8n server is running
- [ ] Test URL with curl
- [ ] Check n8n logs for errors

### Credentials Invalid

- [ ] Re-authenticate Slack, Google, OpenAI, Zendesk
- [ ] Verify API keys haven't expired
- [ ] Test credentials individually in n8n

### Workflow Execution Fails

- [ ] Click workflow → "Show executions"
- [ ] Click failed execution to see error
- [ ] Common errors:
  - Missing credentials (fix in nodes)
  - API rate limits (add delays)
  - Invalid payload format (check trigger data)

### Order/Review Not Creating in ClassVisa

- [ ] Check ClassVisa logs: `pnpm dev`
- [ ] Verify database is running: `npx prisma db inspect`
- [ ] Check `/app/api/checkout` or `/app/api/reviews` endpoint is working

---

## 📝 Final Checklist

- [ ] All n8n workflows imported and active
- [ ] All credentials configured
- [ ] All webhook URLs copied to `.env`
- [ ] `.env` file updated with all variables
- [ ] Webhook triggers added to ClassVisa code
- [ ] Inventory API endpoints implemented
- [ ] TypeScript checks pass
- [ ] ClassVisa server running
- [ ] All three workflows tested successfully
- [ ] Slack channels created and receiving messages
- [ ] Google Sheets updating with data
- [ ] Zendesk creating tickets for negative reviews

---

## 🎉 You're Done!

Your ClassVisa e-commerce platform is now fully automated with n8n:

✅ Orders → Instant team notifications + invoice generation  
✅ Inventory → Daily low stock alerts + automatic sync  
✅ Reviews → Sentiment analysis + support ticket creation  

**Next Steps**:
1. Let it run for a few days
2. Monitor execution logs in n8n
3. Adjust settings based on what you learn
4. Add more workflows as needed (email, social media, etc.)

Questions? Check the detailed guides:
- `README.md` — Full workflow descriptions
- `WEBHOOK_URLS.md` — All webhook configurations
- `INTEGRATION_GUIDE.md` — Code integration examples

**Happy automating! 🚀**
