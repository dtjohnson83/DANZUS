# Stripe proposal

Draft only. This pull request does not create payment links, change Stripe settings, or add Stripe code.

When a payment link is turned on, put the matching text in the payment page custom text, above the pay button, so the customer sees it before they pay.

## Missed-call text-back, $99 a month

Renews monthly at $99 until you cancel. Cancel any time by email at dan@danzus.co or by phone at (916) 404-6129, or at https://danzus.co/cancel. The first 30 days are a free pilot.

## Website hosting, $49 a month

Renews monthly at $49 until you cancel. Cancel any time by email at dan@danzus.co or by phone at (916) 404-6129, or at https://danzus.co/cancel. The $1,500 website build is paid once.

## Google and AI search, $199 a month

Renews monthly at $199 until you cancel. Cancel any time by email at dan@danzus.co or by phone at (916) 404-6129, or at https://danzus.co/cancel.

## DANZUS Growth, $299 a month

Renews monthly at $299 until you cancel. Cancel any time by email at dan@danzus.co or by phone at (916) 404-6129, or at https://danzus.co/cancel. If you stay 6 months, the website costs $750 instead of $1,500. You pay it once. After month 6 it continues month to month at $299 until cancelled.

## Customer portal

Turn on the Stripe customer portal so a customer can cancel a monthly plan in their browser.

Suggested settings when Daniel is ready:

- Allow customers to cancel.
- End the plan at the close of the month already paid, which matches the terms.
- Leave plan changes off until we want customers to switch prices themselves.
- After the portal exists, add its link on https://danzus.co/cancel next to the email form.

Do that in the Stripe Dashboard. This repo does not call Stripe.
