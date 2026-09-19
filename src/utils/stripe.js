import { loadStripe } from '@stripe/stripe-js'
import { PLAN_TIERS } from './planLimits'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
export const isRealStripeConfigured = Boolean(
  stripePublicKey && !stripePublicKey.includes('your_stripe')
)

let stripePromise = null
if (isRealStripeConfigured) {
  stripePromise = loadStripe(stripePublicKey)
}

/**
 * Trigger checkout flow for a given price and billing cycle
 */
export async function triggerStripeCheckout({ planType, billingInterval = 'monthly', user, onMockSuccess }) {
  if (isRealStripeConfigured) {
    const stripe = await stripePromise
    if (!stripe) {
      alert('Stripe 初始化失败，请检查网络或密钥配置')
      return
    }

    // Determine price ID from env
    let priceId = ''
    if (planType === PLAN_TIERS.PRO) {
      priceId = billingInterval === 'yearly'
        ? import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID
    } else if (planType === PLAN_TIERS.ULTIMATE) {
      priceId = billingInterval === 'yearly'
        ? import.meta.env.VITE_STRIPE_ULTIMATE_YEARLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_ULTIMATE_MONTHLY_PRICE_ID
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/app?payment=success&plan=${planType}`,
      cancelUrl: `${window.location.origin}/pricing?payment=cancel`,
      clientReferenceId: user?.id,
      customerEmail: user?.email,
    })

    if (error) {
      console.error('Stripe redirect error:', error)
      alert(error.message || '跳转结算中心失败')
    }
  } else {
    // Demo / Mock Mode checkout simulation
    if (onMockSuccess) {
      onMockSuccess(planType)
    }
  }
}
