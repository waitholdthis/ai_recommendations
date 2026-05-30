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

    await page.waitForTimeout(2500);
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
        'fullstory.com': 'FullStory',
        'logrocket.com': 'LogRocket',
        'mouseflow.com': 'Mouseflow',
        'clarity.ms': 'Microsoft Clarity',
        'intercom.io': 'Intercom',
        'crisp.chat': 'Crisp Chat',
        'tawk.to': 'Tawk.to',
        'drift.com': 'Drift',
        'tidio.com': 'Tidio',
        'facebook.net': 'Facebook Pixel',
        'connect.facebook.net': 'Facebook Pixel',
        'twitter.com': 'Twitter/X Pixel',
        'linkedin.com': 'LinkedIn Insight Tag',
        'snap.licdn.com': 'LinkedIn Insight Tag',
        'static.ads-twitter.com': 'Twitter/X Pixel',
        'stripe.com': 'Stripe',
        'paypal.com': 'PayPal',
        'shopify.com': 'Shopify',
        'cdn.shopify.com': 'Shopify',
        'woocommerce.com': 'WooCommerce',
        'hubspot.com': 'HubSpot',
        'js.hs-scripts.com': 'HubSpot',
        'salesforce.com': 'Salesforce',
        'pardot.com': 'Salesforce Pardot',
        'marketo.net': 'Marketo',
        'mailchimp.com': 'Mailchimp',
        'klaviyo.com': 'Klaviyo',
        'segment.io': 'Segment',
        'segment.com': 'Segment',
        'amplitude.com': 'Amplitude',
        'mixpanel.com': 'Mixpanel',
        'zendesk.com': 'Zendesk',
        'calendly.com': 'Calendly',
        'typeform.com': 'Typeform',
        'cloudflare.com': 'Cloudflare',
        'cookielaw.org': 'OneTrust (Cookie Consent)',
        'cookiebot.com': 'Cookiebot',
        'optimizely.com': 'Optimizely (A/B Testing)',
        'vwo.com': 'VWO (A/B Testing)',
        'convertflow.com': 'ConvertFlow',
        'heap.io': 'Heap Analytics',
        'customer.io': 'Customer.io',
        'activecampaign.com': 'ActiveCampaign',
        'gorgias.io': 'Gorgias',
        'recharge.com': 'ReCharge (Subscriptions)',
        'algolia.net': 'Algolia (Search)',
        'algolia.io': 'Algolia (Search)',
        'recaptcha.net': 'Google reCAPTCHA',
        'youtube.com': 'YouTube Embed',
        'vimeo.com': 'Vimeo Embed',
        'wistia.com': 'Wistia (Video)',
        'loom.com': 'Loom Video',
        'plausible.io': 'Plausible Analytics',
        'posthog.com': 'PostHog',
      };

      const resolvedScripts: string[] = [];
      const alreadyResolved = new Set<string>();
      thirdPartyDomains.forEach((domain) => {
        for (const [key, name] of Object.entries(knownServices)) {
          if (domain.includes(key) && !alreadyResolved.has(name)) {
            resolvedScripts.push(name);
            alreadyResolved.add(name);
            break;
          }
        }
      });

      const schemaEls = document.querySelectorAll('script[type="application/ld+json"]');
      const schemaTypes: string[] = [];
      schemaEls.forEach((el) => {
        try {
          const parsed = JSON.parse(el.textContent || '{}');
          const types = Array.isArray(parsed) ? parsed.map((d) => d['@type']) : [parsed['@type']];
          types.forEach((t) => t && schemaTypes.push(t));
        } catch {}
      });

      const computedStyles = new Set<string>();
      const sampleEls = document.querySelectorAll('body, h1, h2, p, button, a, .hero, .header, nav');
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
      const h3s = getTextContent('h3', 12);

      const ctaSelectors = [
        'button',
        'a[class*="btn"]',
        'a[class*="button"]',
        'a[class*="cta"]',
        '[class*="cta"]',
        'a[class*="primary"]',
        'input[type="submit"]',
      ];
      const ctaTexts = getTextContent(ctaSelectors.join(', '), 20);

      // Key paragraph copy for content analysis
      const paragraphTexts = Array.from(document.querySelectorAll('p'))
        .map((el) => el.textContent?.trim() || '')
        .filter((t) => t.length > 40 && t.length < 500)
        .slice(0, 8);

      // Form analysis
      const forms = document.querySelectorAll('form');
      const formCount = forms.length;

      // Video analysis
      const videoEls = document.querySelectorAll('video');
      const iframeEls = Array.from(document.querySelectorAll('iframe')).filter((el) => {
        const src = el.getAttribute('src') || '';
        return src.includes('youtube') || src.includes('vimeo') || src.includes('wistia') || src.includes('loom');
      });
      const videoCount = videoEls.length + iframeEls.length;

      // Hero video detection
      const heroSelectors = ['.hero', '#hero', '[class*="hero"]', '[id*="hero"]', 'header', '.banner', '[class*="banner"]'];
      let hasHeroVideo = false;
      for (const sel of heroSelectors) {
        const heroEl = document.querySelector(sel);
        if (heroEl) {
          if (heroEl.querySelector('video') || heroEl.querySelector('iframe[src*="youtube"], iframe[src*="vimeo"]')) {
            hasHeroVideo = true;
            break;
          }
        }
      }

      // Image analysis
      const allImages = document.querySelectorAll('img');
      const imageCount = allImages.length;
      const imagesWithAltCount = Array.from(allImages).filter((img) => {
        const alt = img.getAttribute('alt');
        return alt && alt.trim().length > 0;
      }).length;

      // Social proof signals
      const testimonialSelectors = [
        '[class*="testimonial"]', '[class*="review"]', '[class*="quote"]',
        'blockquote', '[class*="feedback"]', '[class*="customer"]',
        '[itemtype*="Review"]', '[data-*="testimonial"]',
      ];
      const testimonialCount = document.querySelectorAll(testimonialSelectors.join(', ')).length;

      const reviewWidgetSelectors = [
        '[class*="stars"]', '[class*="rating"]', '[class*="star-rating"]',
        '[aria-label*="star"]', '[data-rating]', '.trustpilot-widget',
        '[class*="trustpilot"]', '[class*="g2-badge"]', '[class*="capterra"]',
      ];
      const hasReviewWidget = document.querySelectorAll(reviewWidgetSelectors.join(', ')).length > 0;

      // Social proof section
      const socialProofSectionSelectors = [
        '[class*="social-proof"]', '[class*="trust"]', '[class*="testimonial"]',
        '[class*="reviews"]', '[class*="customers"]', '[class*="logos"]',
        '[class*="partners"]', '[class*="clients"]',
      ];
      const hasSocialProofSection = document.querySelectorAll(socialProofSectionSelectors.join(', ')).length > 0;

      // Press logos
      const pressSelectors = [
        '[class*="press"]', '[class*="media"]', '[class*="as-seen"]',
        '[class*="featured"]', '[class*="coverage"]', '[alt*="TechCrunch"]',
        '[alt*="Forbes"]', '[alt*="Wired"]', '[alt*="Bloomberg"]',
      ];
      const hasPressLogos = document.querySelectorAll(pressSelectors.join(', ')).length > 0;

      // Awards / certifications
      const awardsSelectors = [
        '[class*="award"]', '[class*="badge"]', '[class*="certified"]',
        '[class*="certification"]', '[class*="accredit"]', '[alt*="award"]',
        '[alt*="certified"]', '[alt*="ISO"]', '[class*="compliance"]',
      ];
      const hasAwardsBadges = document.querySelectorAll(awardsSelectors.join(', ')).length > 0;

      // Pricing page signals
      const hasPricingPage =
        !!document.querySelector('a[href*="pricing"], a[href*="/plans"], a[href*="/price"]') ||
        navLinks.some((n) => /pricing|plans|price/i.test(n)) ||
        document.body.innerText.includes('per month') ||
        document.body.innerText.includes('/mo') ||
        document.body.innerText.includes('per user');

      // Free trial / demo CTA
      const bodyText = document.body.innerText.toLowerCase();
      const hasFreeTrialOrDemo =
        bodyText.includes('free trial') ||
        bodyText.includes('try free') ||
        bodyText.includes('start free') ||
        bodyText.includes('get demo') ||
        bodyText.includes('book a demo') ||
        bodyText.includes('request demo') ||
        bodyText.includes('schedule demo') ||
        ctaTexts.some((c) => /free|demo|trial|start/i.test(c));

      // Case studies / portfolio
      const hasCaseStudies =
        !!document.querySelector('a[href*="case-stud"], a[href*="portfolio"], a[href*="/work"]') ||
        navLinks.some((n) => /case stud|portfolio|work|projects/i.test(n)) ||
        bodyText.includes('case study') ||
        bodyText.includes('success story');

      // Newsletter signup
      const hasNewsletterSignup =
        bodyText.includes('subscribe') ||
        bodyText.includes('newsletter') ||
        bodyText.includes('sign up for') ||
        !!document.querySelector('input[type="email"][placeholder*="email" i], input[name*="email"][placeholder*="subscri" i]');

      // Social media links
      const socialDomains = ['twitter.com', 'x.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'github.com'];
      const socialMediaLinks: string[] = [];
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        const domain = socialDomains.find((d) => href.includes(d));
        if (domain && !socialMediaLinks.includes(domain)) {
          socialMediaLinks.push(domain.replace('.com', '').replace('x.', 'twitter/x'));
        }
      });

      // Sticky nav
      const navEl = document.querySelector('nav, header');
      const hasStickyNav = navEl
        ? ['sticky', 'fixed'].includes(window.getComputedStyle(navEl).position)
        : false;

      return {
        title: document.title,
        metaDescription: getMeta('description'),
        h1Tags: h1s,
        h2Tags: h2s,
        h3Tags: h3s,
        ctaTexts: Array.from(new Set(ctaTexts)),
        navItems: Array.from(new Set(navLinks)),
        fontFamilies: Array.from(computedStyles).slice(0, 5),
        colorPalette: Array.from(bgColors).slice(0, 8),
        schemaTypes: Array.from(new Set(schemaTypes)),
        thirdPartyScripts: Array.from(new Set(resolvedScripts)).slice(0, 30),
        hasLiveChat:
          Array.from(thirdPartyDomains).some((d) =>
            ['intercom', 'crisp', 'tawk', 'drift', 'zendesk', 'livechat', 'tidio'].some((c) => d.includes(c))
          ) || !!document.querySelector('[id*="chat"], [class*="chat"], [data-*="chat"]'),
        hasBlog:
          !!document.querySelector('a[href*="/blog"], a[href*="/news"], a[href*="/articles"]') ||
          navLinks.some((n) => /blog|news|article|insight/i.test(n)),
        hasEcommerce:
          !!document.querySelector('[class*="cart"], [id*="cart"], [class*="shop"], button[class*="add"]') ||
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
        paragraphTexts,
        formCount,
        videoCount,
        hasHeroVideo,
        imageCount,
        imagesWithAltCount,
        testimonialCount,
        hasReviewWidget,
        hasSocialProofSection,
        hasPressLogos,
        hasAwardsBadges,
        hasPricingPage,
        hasFreeTrialOrDemo,
        hasCaseStudies,
        hasNewsletterSignup,
        socialMediaLinks,
        hasStickyNav,
      };
    });

    const hasSSL = url.startsWith('https://');

    return {
      url,
      title: data.title,
      metaDescription: data.metaDescription,
      h1Tags: data.h1Tags,
      h2Tags: data.h2Tags,
      h3Tags: data.h3Tags,
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
      paragraphTexts: data.paragraphTexts,
      formCount: data.formCount,
      videoCount: data.videoCount,
      hasHeroVideo: data.hasHeroVideo,
      imageCount: data.imageCount,
      imagesWithAltCount: data.imagesWithAltCount,
      testimonialCount: data.testimonialCount,
      hasReviewWidget: data.hasReviewWidget,
      hasSocialProofSection: data.hasSocialProofSection,
      hasPressLogos: data.hasPressLogos,
      hasAwardsBadges: data.hasAwardsBadges,
      hasPricingPage: data.hasPricingPage,
      hasFreeTrialOrDemo: data.hasFreeTrialOrDemo,
      hasCaseStudies: data.hasCaseStudies,
      hasNewsletterSignup: data.hasNewsletterSignup,
      socialMediaLinks: data.socialMediaLinks,
      hasStickyNav: data.hasStickyNav,
    };
  } finally {
    await browser.close();
  }
}
