import { chromium } from 'playwright';
import type { ScrapedData } from './types';

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  const startTime = Date.now();
  let loadTimeMs = 0;

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);
    loadTimeMs = Date.now() - startTime;

    const screenshotBuffer = await page.screenshot({
      fullPage: false,
      type: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    const screenshotBase64 = screenshotBuffer.toString('base64');

    const data = await page.evaluate(() => {
      const getMeta = (name: string): string => {
        const el =
          document.querySelector(`meta[name="${name}"]`) ||
          document.querySelector(`meta[property="og:${name}"]`) ||
          document.querySelector(`meta[property="${name}"]`);
        return el?.getAttribute('content') || '';
      };

      const getTextContent = (selector: string, limit = 20): string[] => {
        return Array.from(document.querySelectorAll(selector))
          .map((el) => el.textContent?.trim() || '')
          .filter((t) => t.length > 0 && t.length < 200)
          .slice(0, limit);
      };

      const thirdPartyDomains = new Set<string>();
      document.querySelectorAll('script[src]').forEach((el) => {
        try {
          const src = el.getAttribute('src') || '';
          if (src.startsWith('http')) {
            const domain = new URL(src).hostname;
            if (!domain.includes(window.location.hostname)) {
              thirdPartyDomains.add(domain);
            }
          }
        } catch {}
      });

      const knownServices: Record<string, string> = {
        'googletagmanager.com': 'Google Tag Manager',
        'google-analytics.com': 'Google Analytics',
        'analytics.google.com': 'Google Analytics 4',
        'hotjar.com': 'Hotjar',
        'intercom.io': 'Intercom',
        'crisp.chat': 'Crisp Chat',
        'tawk.to': 'Tawk.to',
        'facebook.net': 'Facebook Pixel',
        'twitter.com': 'Twitter Pixel',
        'linkedin.com': 'LinkedIn Insight',
        'stripe.com': 'Stripe',
        'paypal.com': 'PayPal',
        'shopify.com': 'Shopify',
        'woocommerce.com': 'WooCommerce',
        'hubspot.com': 'HubSpot',
        'salesforce.com': 'Salesforce',
        'mailchimp.com': 'Mailchimp',
        'klaviyo.com': 'Klaviyo',
        'segment.io': 'Segment',
        'amplitude.com': 'Amplitude',
        'mixpanel.com': 'Mixpanel',
        'zendesk.com': 'Zendesk',
        'drift.com': 'Drift',
        'calendly.com': 'Calendly',
        'typeform.com': 'Typeform',
        'cloudflare.com': 'Cloudflare',
      };

      const resolvedScripts: string[] = [];
      thirdPartyDomains.forEach((domain) => {
        for (const [key, name] of Object.entries(knownServices)) {
          if (domain.includes(key)) {
            resolvedScripts.push(name);
            break;
          }
        }
        if (!resolvedScripts.some((s) => s)) {
          resolvedScripts.push(domain);
        }
      });

      const schemaEls = document.querySelectorAll('script[type="application/ld+json"]');
      const schemaTypes: string[] = [];
      schemaEls.forEach((el) => {
        try {
          const data = JSON.parse(el.textContent || '{}');
          const types = Array.isArray(data) ? data.map((d) => d['@type']) : [data['@type']];
          types.forEach((t) => t && schemaTypes.push(t));
        } catch {}
      });

      const computedStyles = new Set<string>();
      const sampleEls = document.querySelectorAll(
        'body, h1, h2, p, button, a, .hero, .header, nav'
      );
      sampleEls.forEach((el) => {
        const style = window.getComputedStyle(el);
        const ff = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        if (ff && ff !== 'inherit') computedStyles.add(ff);
      });

      const bgColors = new Set<string>();
      document.querySelectorAll('[style*="background"], [style*="color"], [class*="bg-"]').forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          bgColors.add(style.backgroundColor);
        }
      });

      const wordCount = document.body.innerText
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter((w) => w.length > 2).length;

      const internalLinks = Array.from(document.querySelectorAll('a[href]')).filter((a) => {
        const href = a.getAttribute('href') || '';
        return href.startsWith('/') || href.includes(window.location.hostname);
      }).length;

      const externalLinks = Array.from(document.querySelectorAll('a[href]')).filter((a) => {
        const href = a.getAttribute('href') || '';
        return href.startsWith('http') && !href.includes(window.location.hostname);
      }).length;

      const navLinks = getTextContent('nav a, header a, [role="navigation"] a');
      const h1s = getTextContent('h1');
      const h2s = getTextContent('h2', 15);

      const ctaSelectors = [
        'button',
        'a[class*="btn"]',
        'a[class*="button"]',
        'a[class*="cta"]',
        '[class*="cta"]',
        'a[class*="primary"]',
        'input[type="submit"]',
      ];
      const ctaTexts = getTextContent(ctaSelectors.join(', '), 15);

      return {
        title: document.title,
        metaDescription: getMeta('description'),
        h1Tags: h1s,
        h2Tags: h2s,
        ctaTexts: Array.from(new Set(ctaTexts)),
        navItems: Array.from(new Set(navLinks)),
        fontFamilies: Array.from(computedStyles).slice(0, 5),
        colorPalette: Array.from(bgColors).slice(0, 8),
        schemaTypes: Array.from(new Set(schemaTypes)),
        thirdPartyScripts: Array.from(new Set(resolvedScripts)).slice(0, 20),
        hasLiveChat:
          Array.from(thirdPartyDomains).some((d) =>
            ['intercom', 'crisp', 'tawk', 'drift', 'zendesk', 'livechat', 'tidio'].some((c) =>
              d.includes(c)
            )
          ) || !!document.querySelector('[id*="chat"], [class*="chat"], [data-*="chat"]'),
        hasBlog:
          !!document.querySelector('a[href*="/blog"], a[href*="/news"], a[href*="/articles"]') ||
          navLinks.some((n) => /blog|news|article|insight/i.test(n)),
        hasEcommerce:
          !!document.querySelector(
            '[class*="cart"], [id*="cart"], [class*="shop"], button[class*="add"]'
          ) ||
          schemaTypes.includes('Product') ||
          Array.from(thirdPartyDomains).some((d) =>
            ['stripe', 'paypal', 'shopify', 'woocommerce'].some((c) => d.includes(c))
          ),
        hasBookingSystem:
          !!document.querySelector('a[href*="calendly"], a[href*="booking"], [class*="book"]') ||
          Array.from(thirdPartyDomains).some((d) =>
            ['calendly', 'acuity', 'bookly', 'simplybook'].some((c) => d.includes(c))
          ),
        wordCount,
        internalLinks,
        externalLinks,
        pageCount: Math.max(internalLinks, 1),
      };
    });

    const hasSSL = url.startsWith('https://');

    return {
      url,
      title: data.title,
      metaDescription: data.metaDescription,
      h1Tags: data.h1Tags,
      h2Tags: data.h2Tags,
      ctaTexts: data.ctaTexts,
      navItems: data.navItems,
      colorPalette: data.colorPalette,
      fontFamilies: data.fontFamilies,
      schemaTypes: data.schemaTypes,
      thirdPartyScripts: data.thirdPartyScripts,
      hasLiveChat: data.hasLiveChat,
      hasBlog: data.hasBlog,
      hasEcommerce: data.hasEcommerce,
      hasBookingSystem: data.hasBookingSystem,
      pageCount: data.pageCount,
      loadTimeMs,
      screenshotBase64,
      screenshotMimeType: 'image/png',
      wordCount: data.wordCount,
      internalLinks: data.internalLinks,
      externalLinks: data.externalLinks,
      hasSSL,
      mobileViewport: true,
    };
  } finally {
    await browser.close();
  }
}
