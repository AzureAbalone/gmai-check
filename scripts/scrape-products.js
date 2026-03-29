const initCycleTLS = require("cycletls");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ─── Config ───
const BASE_URL = "https://vietnhatplastic.com/san-pham";
const START_PAGE = 1;
const END_PAGE = 1; // Change to 130 for full scrape
const DELAY_MS = 1000;
const OUTPUT_FILE = path.join(__dirname, "products.json");
const PROGRESS_FILE = path.join(__dirname, "products-progress.json");
const BATCH_SAVE_EVERY = 10; // Save progress every N pages

const HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-ua": '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  cookie: "ASP.NET_SessionId=7c0b1d39-7654-49ec-8f40-fb419c6cc737",
  Referer: "https://vietnhatplastic.com/san-pham",
};

const JA3 = "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513-21,29-23-24,0";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

// ─── Helpers ───
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractProducts(html, pageNum) {
  const $ = cheerio.load(html);
  const section = $("section.product-all-section");
  const products = [];

  if (!section.length) {
    console.warn(`  ⚠ section.product-all-section not found on page ${pageNum}`);
    return products;
  }

  section.find("a.product-item").each((i, el) => {
    const $el = $(el);

    // Name from title attr or .product-title
    const name = $el.attr("title") || $el.find(".product-title").text().trim() || "";

    // URL
    const href = $el.attr("href") || "";
    const url = href.startsWith("http") ? href : `https://vietnhatplastic.com${href}`;

    // All images
    const images = [];
    $el.find(".product-img img").each((_, img) => {
      const src = $(img).attr("src") || $(img).attr("data-src") || "";
      if (src) {
        images.push(src.startsWith("http") ? src : `https://vietnhatplastic.com${src}`);
      }
    });

    // Product code
    const code = $el.find(".product-code").text().trim() || "";

    // Badge (e.g. "Mới", "Hot")
    const badge = $el.find(".product-badge .badge").text().trim() || "";

    // Category from URL path
    const urlParts = href.split("/").filter(Boolean);
    const category = urlParts.length >= 3 ? urlParts[urlParts.length - 2] : "";

    if (name) {
      products.push({
        name,
        code,
        url,
        images,
        thumbnail: images[0] || "",
        badge,
        category,
        page: pageNum,
      });
    }
  });

  return products;
}

// ─── Main ───
async function main() {
  console.log("🚀 VietNhat Plastic Product Scraper");
  console.log(`   Pages: ${START_PAGE} → ${END_PAGE}`);
  console.log(`   Delay: ${DELAY_MS}ms between requests\n`);

  const cycleTLS = await initCycleTLS();
  let allProducts = [];
  let failedPages = [];
  let emptyPages = [];

  // Resume from progress file if exists
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
      allProducts = progress.products || [];
      failedPages = progress.failed_pages || [];
      const lastPage = progress.last_page || 0;
      console.log(`📂 Resuming from page ${lastPage + 1} (${allProducts.length} products so far)\n`);
    } catch (e) {
      console.log("⚠ Could not resume, starting fresh\n");
    }
  }

  const startFrom = allProducts.length > 0
    ? Math.max(...allProducts.map((p) => p.page)) + 1
    : START_PAGE;

  try {
    for (let page = startFrom; page <= END_PAGE; page++) {
      const url = page === 1 ? BASE_URL : `${BASE_URL}?pagenumber=${page}`;
      const progress = `[${page}/${END_PAGE}]`;

      try {
        const response = await cycleTLS(url, {
          body: "",
          ja3: JA3,
          userAgent: USER_AGENT,
          headers: HEADERS,
        });

        if (response.status === 200) {
          const html = typeof response.data === "string" ? response.data : String(response.data);
          const products = extractProducts(html, page);

          if (products.length > 0) {
            allProducts.push(...products);
            console.log(`${progress} ✅ ${products.length} products (total: ${allProducts.length})`);
          } else {
            emptyPages.push(page);
            console.log(`${progress} ⚠ 0 products (empty page)`);
          }
        } else {
          console.log(`${progress} ❌ HTTP ${response.status}`);
          failedPages.push(page);
        }
      } catch (err) {
        console.error(`${progress} ❌ ${err.message}`);
        failedPages.push(page);
      }

      // Save progress periodically
      if (page % BATCH_SAVE_EVERY === 0) {
        const progressData = {
          last_page: page,
          total_products: allProducts.length,
          failed_pages: failedPages,
          empty_pages: emptyPages,
          products: allProducts,
        };
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progressData, null, 2), "utf-8");
        console.log(`  💾 Progress saved (page ${page})`);
      }

      // Delay
      if (page < END_PAGE) {
        await sleep(DELAY_MS);
      }
    }

    // ─── Final output ───
    const output = {
      scraped_at: new Date().toISOString(),
      source: "vietnhatplastic.com",
      total_products: allProducts.length,
      total_pages_scraped: END_PAGE - START_PAGE + 1,
      failed_pages: failedPages,
      empty_pages: emptyPages,
      products: allProducts,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

    // Print summary
    console.log("\n" + "═".repeat(50));
    console.log(`✅ COMPLETE!`);
    console.log(`   Total products: ${allProducts.length}`);
    console.log(`   Pages scraped:  ${END_PAGE - START_PAGE + 1}`);
    console.log(`   Failed pages:   ${failedPages.length}`);
    console.log(`   Empty pages:    ${emptyPages.length}`);
    console.log(`   Output:         ${OUTPUT_FILE}`);

    if (failedPages.length > 0) {
      console.log(`\n⚠ Failed pages: ${failedPages.join(", ")}`);
    }

    // Unique categories
    const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
    console.log(`\n📂 Categories found (${categories.length}):`);
    categories.forEach((c) => {
      const count = allProducts.filter((p) => p.category === c).length;
      console.log(`   ${c} (${count})`);
    });

    // Clean up progress file
    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }
  } finally {
    cycleTLS.exit();
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
