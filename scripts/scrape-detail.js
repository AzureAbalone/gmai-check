const initCycleTLS = require("cycletls");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ─── Config ───
const INPUT_FILE = path.join(__dirname, "products.json");
const OUTPUT_FILE = path.join(__dirname, "products-detailed.json");
const PROGRESS_FILE = path.join(__dirname, "detail-progress.json");
const DELAY_MS = 1200;
const BATCH_SAVE_EVERY = 10;

const HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-ua": '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  cookie: "ASP.NET_SessionId=7c0b1d39-7654-49ec-8f40-fb419c6cc737",
  Referer: "https://vietnhatplastic.com/san-pham",
};

const JA3 = "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513-21,29-23-24,0";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const absUrl = (src) => (src && !src.startsWith("http") ? "https://vietnhatplastic.com" + src : src || "");

// ─── Extract detail from a product page ───
function extractDetail(html) {
  const $ = cheerio.load(html);
  const detail = {};

  // ── Name ──
  detail.name = $(".product-detail-title").first().text().trim() || "";

  // ── Product info rows ──
  // Structure: <div class="product-detail-row"> with label + value
  $(".product-detail-row").each((_, el) => {
    const text = $(el).text().trim();

    if (text.startsWith("Mã sản phẩm")) {
      detail.code = text.replace("Mã sản phẩm:", "").trim();
    } else if (text.startsWith("Kích thước")) {
      detail.dimensions = text.replace("Kích thước:", "").trim();
    } else if (text.startsWith("Chất liệu")) {
      detail.material = text.replace("Chất liệu:", "").trim();
    } else if (text.startsWith("Quy cách đóng gói") || text.startsWith("Quy cách")) {
      detail.packaging = text.replace(/Quy cách( đóng gói)?:/, "").trim();
    } else if (text.startsWith("Giá sản phẩm") || text.startsWith("Giá")) {
      detail.price = text.replace(/Giá( sản phẩm)?:/, "").trim();
    } else if (text.startsWith("Màu sắc")) {
      // Colors might be in swatches or text
      const colorTexts = [];
      $(el).find("img, .color-item, [class*='color']").each((_, c) => {
        const alt = $(c).attr("alt") || $(c).attr("title") || "";
        if (alt) colorTexts.push(alt);
      });
      if (colorTexts.length === 0) {
        const colorText = text.replace("Màu sắc:", "").trim();
        if (colorText) colorTexts.push(colorText);
      }
      detail.colors = colorTexts;
    }
  });

  // ── All images (from left column gallery) ──
  const images = [];
  $(".product-detail-top img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src") || "";
    const full = absUrl(src);
    if (full && !images.includes(full)) images.push(full);
  });
  detail.images = images;

  // ── Description from bottom section ──
  const descSection = $(".product-detail-bottom .article-content").first();
  if (descSection.length) {
    // Get first <p> as main description
    detail.description = descSection.find("p").first().text().trim() || descSection.text().trim();
    // Get full HTML for rich content
    detail.descriptionHtml = descSection.html() || "";
  }

  // ── Badge ──
  detail.badge = $(".product-badge .badge, .product-detail-top .badge").first().text().trim() || "";

  return detail;
}

// ─── Main ───
async function main() {
  // Load product list from listing scraper
  if (!fs.existsSync(INPUT_FILE)) {
    console.error("❌ Missing", INPUT_FILE);
    console.error("   Run scrape-products.js first to get the product list.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
  const products = data.products || [];
  console.log(`🚀 Detail scraper — ${products.length} products to process`);
  console.log(`   Delay: ${DELAY_MS}ms\n`);

  // Resume support
  let startIndex = 0;
  let results = [];
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
      results = progress.products || [];
      startIndex = results.length;
      console.log(`📂 Resuming from index ${startIndex}\n`);
    } catch (_) { /* start fresh */ }
  }

  const cycleTLS = await initCycleTLS();
  let failed = [];

  try {
    for (let i = startIndex; i < products.length; i++) {
      const product = products[i];
      const url = product.url;
      const progress = `[${i + 1}/${products.length}]`;

      if (!url) {
        console.log(`${progress} ⚠ No URL, skipping: ${product.name}`);
        results.push({ ...product, detail: null });
        continue;
      }

      try {
        const r = await cycleTLS(url, {
          body: "",
          ja3: JA3,
          userAgent: USER_AGENT,
          headers: HEADERS,
        });

        if (r.status === 200) {
          const html = typeof r.data === "string" ? r.data : String(r.data);
          const detail = extractDetail(html);

          // Merge detail into product
          results.push({
            ...product,
            // Override with richer detail data
            name: detail.name || product.name,
            code: detail.code || product.code,
            dimensions: detail.dimensions || "",
            material: detail.material || "",
            packaging: detail.packaging || "",
            price: detail.price || "",
            colors: detail.colors || [],
            images: detail.images.length > 0 ? detail.images : product.images,
            description: detail.description || "",
            descriptionHtml: detail.descriptionHtml || "",
            badge: detail.badge || product.badge,
          });

          console.log(`${progress} ✅ ${detail.name || product.name}`);
          console.log(`         dims=${detail.dimensions || "-"} mat=${detail.material || "-"} imgs=${detail.images.length}`);
        } else {
          console.log(`${progress} ❌ HTTP ${r.status}: ${product.name}`);
          results.push({ ...product, detail_error: `HTTP ${r.status}` });
          failed.push(i);
        }
      } catch (err) {
        console.error(`${progress} ❌ ${err.message}: ${product.name}`);
        results.push({ ...product, detail_error: err.message });
        failed.push(i);
      }

      // Save progress
      if ((i + 1) % BATCH_SAVE_EVERY === 0) {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ products: results }, null, 2), "utf-8");
        console.log(`  💾 Progress saved (${i + 1}/${products.length})`);
      }

      // Delay
      if (i < products.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    // ── Save final output ──
    const output = {
      scraped_at: new Date().toISOString(),
      source: "vietnhatplastic.com",
      total: results.length,
      failed: failed.length,
      products: results,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

    console.log("\n" + "═".repeat(50));
    console.log("✅ COMPLETE!");
    console.log(`   Total: ${results.length} products`);
    console.log(`   Failed: ${failed.length}`);
    console.log(`   Output: ${OUTPUT_FILE}`);

    // Cleanup progress
    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);

  } finally {
    cycleTLS.exit();
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
