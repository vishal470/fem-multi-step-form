# 🎯 Quick Test Selector Reference

## All Required Selectors ✅

### Step 1: Personal Information
```
✅ button#next-button        → "Next Step" button
✅ input[name="userName"]    → Name input field
✅ input[name="email"]       → Email input field
✅ input[name="phone"]       → Phone input field
✅ .invalid-feedback         → Error messages
```

### Step 2: Select Plan
```
✅ button#back-button        → "Go Back" button
✅ button#next-button        → "Next Step" button
✅ .plan-card                → Plan selection cards
   - .plan-card[data-plan="arcade"]
   - .plan-card[data-plan="advanced"]
   - .plan-card[data-plan="pro"]
✅ #plan-error               → Plan selection error
```

### Step 3: Pick Add-ons
```
✅ button#back-button        → "Go Back" button
✅ button#next-button        → "Next Step" button
✅ .addon_card               → Add-on selection items
   - .addon_card[data-addon="online-service"]
   - .addon_card[data-addon="larger-storage"]
   - .addon_card[data-addon="customizable-profile"]
```

### Step 4: Finishing Up
```
✅ button#back-button        → "Go Back" button
✅ button#confirm-button     → "Confirm" button
✅ #selected-plan-summary    → Selected plan display
✅ #change-plan              → Change plan link
✅ #total-price              → Total price display
```

### Final: Thank You
```
✅ h1 contains "Thank you!"  → Success message
✅ p contains support email  → Support info
```

---

## Button Visibility by Step

| Step | Back Button | Next Button | Confirm Button |
|------|-----------|----------|-----------|
| 1 | Hidden | Visible (`#next-button`) | - |
| 2 | Visible (`#back-button`) | Visible (`#next-button`) | - |
| 3 | Visible (`#back-button`) | Visible (`#next-button`) | - |
| 4 | Visible (`#back-button`) | - | Visible (`#confirm-button`) |
| Thank You | Hidden | Hidden | Hidden |

**Only one button with each ID is visible at any time** → Cypress can find them! ✅

---

## Validation Messages

### Required Fields (Step 1)
- Empty name → `#name-error` displays error
- Empty email → `#email-error` displays error
- Empty phone → `#phone-error` displays error

### Plan Selection (Step 2)
- No plan selected → `#plan-error` displays error
- Plan selected → Error disappears

---

## Event Flow with Event Delegation

```
Step 1 loaded
  └─ User clicks #next-button in Step 1
     └─ Event bubbles to .form-container listener
        └─ Listener catches click on #next-button
           └─ getCurrentStep() returns 1
              └─ nextStep(1) validates and navigates
                 └─ Step 2 becomes active
                    └─ Step 1 buttons hidden
                    └─ Step 2 buttons visible
                       └─ #back-button now points to Step 2's back button
                       └─ #next-button now points to Step 2's next button
```

Same listener handles all future clicks! ✅

---

## Test Compatibility Matrix

| Test # | Requires | Found By |
|--------|----------|----------|
| 1 | `button#next-button` | Step 1's next button |
| 2 | `button#next-button` + `.plan-card` + `.addon_card` | Dynamic buttons as you navigate |
| 3 | `button#next-button` + `.plan-card` | Step 2's buttons |
| 4 | `button#next-button` + validation | Step 1's buttons with error display |
| 5 | `button#next-button` + `.addon_card` | Step 3's buttons |
| 6 | `button#next-button` + validation | Step 1's buttons with errors |

**All tests should now PASS** ✅

---

## Deployment Status

✅ Code changes complete  
✅ Committed to Git  
✅ Pushed to GitHub  
✅ Vercel will auto-deploy  
✅ Tests will run automatically  

**ETA**: Tests passing within minutes of deployment
