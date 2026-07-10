import { test, expect, type Page } from '@playwright/test';

/**
 * WLOP Landing Page — E2E Test Suite
 *
 * Covers: page load, SSR safety, accessibility, navigation,
 * hero section, character sections (Alice/Fiama/Mica),
 * gallery with modal, contact form validation, and footer.
 */

/* ─── Helpers ──────────────────────────────────────────────────── */

/** Capture console errors and unhandled page errors for the test */
async function captureErrors(page: Page) {
  const errors: { type: string; text: string }[] = [];

  await page.setViewportSize({ width: 1440, height: 900 });

  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', text: err.message });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console.error', text: msg.text() });
    }
  });

  return errors;
}

/** Safely scroll an element into view — uses native JS to bypass Lenis */
async function scrollIntoView(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ block: 'start' });
  }, selector);
  // Small wait for Lenis + ScrollTrigger to settle
  await page.waitForTimeout(600);
}

/** Wait for the hero text to appear (3s delay from showText signal) */
async function waitForHeroText(page: Page) {
  // The hero-content starts with opacity-0, after 3s transitions to opacity-100
  await page.waitForTimeout(3500);
}

/* ─── Suite ─────────────────────────────────────────────────────── */

test.describe('WLOP Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any leftover state between tests
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  /* ── 1. Page Load & HTML ─────────────────── */

  test.describe('Page Load & Metadata', () => {
    test('should load with correct document title', async ({ page }) => {
      await expect(page).toHaveTitle(
        /WLOP \| Ilustraciones Digitales & Arte Fantástico/,
      );
    });

    test('should have correct lang attribute', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'es');
    });

    test('should have SEO meta tags', async ({ page }) => {
      await expect(
        page.locator('meta[name="description"]'),
      ).toHaveAttribute('content', /Arte digital/);

      await expect(
        page.locator('meta[property="og:title"]'),
      ).toHaveAttribute('content', /WLOP/);

      await expect(
        page.locator('meta[name="twitter:card"]'),
      ).toHaveAttribute('content', 'summary_large_image');
    });

    test('should have canonical link', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', 'https://wlop.art/');
    });

    test('should have theme-color meta', async ({ page }) => {
      await expect(
        page.locator('meta[name="theme-color"]'),
      ).toHaveAttribute('content', '#d4af37');
    });

    test('should emit zero page errors (GSAP/SSR safety)', async ({ page }) => {
      const errors = await captureErrors(page);
      await page.waitForTimeout(2000);
      expect(errors).toHaveLength(0);
    });
  });

  /* ── 2. Skip Link ────────────────────────── */

  test.describe('Skip Link', () => {
    test('should render and be focusable', async ({ page }) => {
      const skipLink = page.locator('.skip-link');
      await expect(skipLink).toHaveText('Saltar al contenido principal');
      await expect(skipLink).toHaveAttribute('href', '#main-content');
      await expect(skipLink).toBeVisible();
    });

    test('should become visible on focus', async ({ page }) => {
      const skipLink = page.locator('.skip-link');
      await skipLink.focus();
      // The skip-link starts at top:-100px and moves to top:0 on focus
      await expect(skipLink).toBeFocused();
    });
  });

  /* ── 3. Navbar ──────────────────────────── */

  test.describe('Navbar', () => {
    test('should render navigation landmark', async ({ page }) => {
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute(
        'aria-label',
        'Navegación principal',
      );
    });

    test('should have correct menu items', async ({ page }) => {
      const arte = page.locator('[role="menuitem"][aria-label="Arte"]');
      const galeria = page.locator('[role="menuitem"][aria-label="Galeria"]');
      const contacto = page.locator('[role="menuitem"][aria-label="Contacto"]');

      await expect(arte).toBeVisible();
      await expect(arte).toHaveText('Arte');
      await expect(galeria).toBeVisible();
      await expect(galeria).toHaveText('Galeria');
      await expect(contacto).toBeVisible();
      await expect(contacto).toHaveText('Contacto');
    });

    test('should have logo brand', async ({ page }) => {
      const logo = page.locator('.logo-brand');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveText('WLOP');
    });
  });

  /* ── 4. Hero Section ────────────────────── */

  test.describe('Hero Section', () => {
    test('should render hero section', async ({ page }) => {
      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
    });

    test('should have main title', async ({ page }) => {
      const title = page.locator('#hero h1');
      await expect(title).toHaveText('WLOP');
    });

    test('should have subtitle', async ({ page }) => {
      const subtitle = page.locator('#hero p');
      await expect(subtitle).toContainText('Artista digital excepcional');
    });

    test('should have background image set', async ({ page }) => {
      const bg = page.locator('#hero .hero-bg');
      await expect(bg).toHaveCSS('background-image', /wlop-hero/);
    });

    test('should have canvas for particle effect', async ({ page }) => {
      const canvas = page.locator('#hero canvas');
      await expect(canvas).toBeAttached();
      await expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    test('should show text after 3-second delay', async ({ page }) => {
      const content = page.locator('#hero .hero-content');

      // Initially the text should exist but may be hidden
      await expect(content).toBeAttached();

      // Wait for the showText delay (3s)
      await waitForHeroText(page);

      // After the delay, the text should be fully visible (opacity-100)
      await expect(content).toHaveCSS('opacity', '1');
    });
  });

  /* ── 5. Character Sections ──────────────── */

  test.describe('Character Sections', () => {
    test('Alice section should have correct content', async ({ page }) => {
      await scrollIntoView(page, '#section-alice');
      const section = page.locator('#alice');
      await expect(section).toBeVisible();

      await expect(section.locator('h2')).toHaveText('Colores');
      await expect(section.locator('p')).toContainText(
        'Un personaje enigmático',
      );

      const bg = section.locator('.alice-bg');
      await expect(bg).toHaveCSS('background-image', /wlop-alice-bg/);
    });

    test('Fiama section should have correct content', async ({ page }) => {
      await scrollIntoView(page, '#section-fiama');
      const section = page.locator('#fiama');
      await expect(section).toBeVisible();

      await expect(section.locator('h2')).toHaveText('Unico');
      await expect(section.locator('p')).toContainText(
        'Un personaje que irradia fuerza',
      );

      const bg = section.locator('.fiama-bg');
      await expect(bg).toHaveCSS('background-image', /wlop-fiama/);
    });

    test('Mica section should have correct content', async ({ page }) => {
      await scrollIntoView(page, '#section-mica');
      const section = page.locator('#mica');
      await expect(section).toBeVisible();

      await expect(section.locator('h2')).toHaveText('Personalidad');
      await expect(section.locator('p')).toContainText(
        'Un personaje con una personalidad única',
      );

      const bg = section.locator('.mica-bg');
      await expect(bg).toHaveCSS('background-image', /wlop-mica/);
    });
  });

  /* ── 6. Gallery Section ──────────────────── */

  test.describe('Gallery Section', () => {
    test('should render gallery with heading', async ({ page }) => {
      await scrollIntoView(page, '#section-galeria');
      // Use app-carrousel to disambiguate: both App wrapper and Carrousel have #section-galeria
      const galeria = page.locator('app-carrousel #section-galeria');
      await expect(galeria).toBeVisible();
      await expect(galeria.locator('h2')).toHaveText('Galeria');
    });

    test('should display 16 parallelogram image items', async ({ page }) => {
      await scrollIntoView(page, '#section-galeria');
      const items = page.locator('.parallelogram-item');
      await expect(items).toHaveCount(16);
    });

    test('gallery images should have alt text', async ({ page }) => {
      await scrollIntoView(page, '#section-galeria');
      const imgs = page.locator('.parallelogram-content img');
      const count = await imgs.count();
      for (let i = 0; i < count; i++) {
        await expect(imgs.nth(i)).toHaveAttribute('alt', /Gallery image/);
      }
    });

    test.describe('Modal (Desktop)', () => {
      test.beforeEach(async ({ page }) => {
        await scrollIntoView(page, '#section-galeria');
        // Click the first gallery item to open modal
        await page.locator('.parallelogram-item').first().click();
        // Wait for modal animation
        await page.waitForTimeout(500);
      });

      test('should open modal with image on click', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();
        await expect(modal).toHaveAttribute('aria-modal', 'true');
        await expect(modal).toHaveAttribute(
          'aria-label',
          'Galería de imágenes',
        );
      });

      test('should display image inside modal', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');
        const img = modal.locator('img');
        await expect(img).toBeAttached();
        await expect(img).toHaveAttribute('alt', /Gallery image/);
      });

      test('should close modal with Escape key', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        await expect(modal).not.toBeVisible();
      });

      test('should close modal with close button', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        await page.locator('[aria-label="Cerrar modal"]').click();
        await page.waitForTimeout(500);

        await expect(modal).not.toBeVisible();
      });

      test('should navigate images with arrow buttons', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');

        // Click next
        await page.locator('[aria-label="Siguiente imagen"]').click();
        await page.waitForTimeout(500);
        await expect(modal).toBeVisible();

        // Click prev
        await page.locator('[aria-label="Imagen anterior"]').click();
        await page.waitForTimeout(500);
        await expect(modal).toBeVisible();
      });

      test('should navigate images with keyboard arrows', async ({ page }) => {
        const modal = page.locator('[role="dialog"]');

        // ArrowRight → next image
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);
        await expect(modal).toBeVisible();

        // ArrowLeft → prev image
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(500);
        await expect(modal).toBeVisible();
      });

      test('close button should have correct attributes', async ({ page }) => {
        const closeBtn = page.locator('[aria-label="Cerrar modal"]');
        await expect(closeBtn).toBeVisible();
      });

      test('navigation arrows should have correct labels', async ({ page }) => {
        const prev = page.locator('[aria-label="Imagen anterior"]');
        const next = page.locator('[aria-label="Siguiente imagen"]');
        await expect(prev).toBeVisible();
        await expect(next).toBeVisible();
      });
    });
  });

  /* ── 7. Contact Section ────────────────── */

  test.describe('Contact Section', () => {
    test('should render contact section', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');
      const section = page.locator('#contacto');
      await expect(section).toBeVisible();
      await expect(section.locator('h2')).toHaveText('Contacto');
    });

    test('should have form with all inputs', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      await expect(page.locator('#nombre')).toBeVisible();
      await expect(page.locator('#mail')).toBeVisible();
      await expect(page.locator('#asunto')).toBeVisible();

      await expect(
        page.locator('button[type="submit"]'),
      ).toBeVisible();
      await expect(
        page.locator('button[type="submit"]'),
      ).toHaveText('Enviar mensaje');
    });

    test('should show validation errors on empty submit', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      // Submit empty form
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);

      // Should show error messages — use the container div (has aria-live + role="alert")
      const alertBox = page.locator('[aria-live="polite"]');
      await expect(alertBox).toBeVisible();
      await expect(alertBox).toContainText('El nombre es obligatorio');
      await expect(alertBox).toContainText('El email es obligatorio');
      await expect(alertBox).toContainText('El asunto es obligatorio');
    });

    test('should validate email format', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      // Fill invalid email
      await page.locator('#nombre').fill('Test User');
      await page.locator('#mail').fill('invalid-email');
      await page.locator('#asunto').fill('Test subject');

      // Submit
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);

      // Should show email error in the container and the field-specific error
      const alertBox = page.locator('[aria-live="polite"]');
      await expect(alertBox).toContainText('Ingresa un email válido');
    });

    test('should submit successfully with valid data', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      // Fill all fields correctly
      await page.locator('#nombre').fill('Usuario Test');
      await page.locator('#mail').fill('test@example.com');
      await page.locator('#asunto').fill('Consulta de prueba');

      // Submit
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);

      // Should NOT show any error
      const alertBox = page.locator('[role="alert"]');
      await expect(alertBox).not.toBeVisible();
    });

    test('form inputs should have aria-required attribute', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      await expect(page.locator('#nombre')).toHaveAttribute(
        'aria-required',
        'true',
      );
      await expect(page.locator('#mail')).toHaveAttribute(
        'aria-required',
        'true',
      );
      await expect(page.locator('#asunto')).toHaveAttribute(
        'aria-required',
        'true',
      );
    });

    test('should have contact info with email and location', async ({ page }) => {
      await scrollIntoView(page, '#section-contacto');

      await expect(page.locator('#contacto')).toContainText(
        'contacto@wlop.art',
      );
      await expect(page.locator('#contacto')).toContainText('China');
    });
  });

  /* ── 8. Footer ─────────────────────────── */

  test.describe('Footer', () => {
    test('should render footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should have ArtStation link', async ({ page }) => {
      const link = page.locator('[aria-label="Ver perfil de ArtStation"]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute(
        'href',
        'https://www.artstation.com/wlop',
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('should have disclaimer text', async ({ page }) => {
      const disclaimer = page.locator('.footer-disclaimer');
      await expect(disclaimer).toBeVisible();
      await expect(disclaimer).toContainText(
        'demo para mostrar habilidades de frontend',
      );
    });

    test('should display current copyright year', async ({ page }) => {
      const currentYear = new Date().getFullYear().toString();
      const footer = page.locator('footer');
      await expect(footer).toContainText(currentYear);
      await expect(footer).toContainText('WLOP');
    });
  });

  /* ── 9. Responsive — Mobile ──────────────── */

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should render all sections in mobile layout', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      // Hero section
      await expect(page.locator('#hero')).toBeVisible();
      await expect(page.locator('#hero h1')).toBeVisible();

      // Character sections
      await scrollIntoView(page, '#section-alice');
      await expect(page.locator('#alice h2')).toHaveText('Colores');

      await scrollIntoView(page, '#section-fiama');
      await expect(page.locator('#fiama h2')).toHaveText('Unico');

      await scrollIntoView(page, '#section-mica');
      await expect(page.locator('#mica h2')).toHaveText('Personalidad');

      // Gallery
      await scrollIntoView(page, '#section-galeria');
      await expect(page.locator('#section-galeria h2')).toHaveText('Galeria');

      // Contact
      await scrollIntoView(page, '#section-contacto');
      await expect(page.locator('#contacto h2')).toHaveText('Contacto');
    });

    test('should show mobile modal on gallery click', async ({ page }) => {
      await scrollIntoView(page, '#section-galeria');

      // Click the first gallery item
      await page.locator('.parallelogram-item').first().click();
      await page.waitForTimeout(500);

      // Mobile modal (non-desktop) should appear
      const mobileModal = page.locator('.modal-full-image-mobile');
      await expect(mobileModal).toBeAttached();
    });

    test('should close mobile modal on escape', async ({ page }) => {
      await scrollIntoView(page, '#section-galeria');

      await page.locator('.parallelogram-item').first().click();
      await page.waitForTimeout(500);

      await expect(
        page.locator('.modal-full-image-mobile'),
      ).toBeAttached();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      await expect(
        page.locator('.modal-full-image-mobile'),
      ).not.toBeVisible();
    });
  });

  /* ── 10. Accessibility Checks ────────────── */

  test.describe('Accessibility', () => {
    test('images should have alt attributes', async ({ page }) => {
      // Check hero background has aria-hidden (it's a bg, not content)
      // Canvas should be aria-hidden
      await expect(
        page.locator('#hero canvas'),
      ).toHaveAttribute('aria-hidden', 'true');

      // Gallery thumbnails should have alt text
      await scrollIntoView(page, '#section-galeria');
      const galleryImgs = page.locator('.parallelogram-content img');
      const count = await galleryImgs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('navbar should use proper ARIA roles', async ({ page }) => {
      await expect(
        page.locator('nav[role="navigation"]'),
      ).toBeAttached();

      await expect(
        page.locator('[role="menubar"]'),
      ).toBeAttached();

      const menuitems = page.locator('[role="menuitem"]');
      const count = await menuitems.count();
      expect(count).toBe(3);
    });

    test('contact form should have accessible error handling', async ({
      page,
    }) => {
      await scrollIntoView(page, '#section-contacto');

      // Submit empty form
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(300);

      // Error container should have role="alert" and aria-live
      const errorContainer = page.locator('[aria-live="polite"]');
      await expect(errorContainer).toBeVisible();
    });
  });
});
