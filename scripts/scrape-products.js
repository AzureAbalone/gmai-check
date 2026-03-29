const initCycleTLS = require("cycletls");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ─── Config ───
const BASE_URL = "https://vietnhatplastic.com/san-pham";
const START_PAGE = 1;
const END_PAGE = 130;
const DELAY_MS = 100;
const OUTPUT_FILE = path.join(__dirname, "products.json");
const PROGRESS_FILE = path.join(__dirname, "products-progress.json");
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
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  cookie: "ASP.NET_SessionId=7c0b1d39-7654-49ec-8f40-fb419c6cc737",
  Referer: "https://vietnhatplastic.com/san-pham",
};

const JA3 = "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513-21,29-23-24,0";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

// ─── Helpers ───
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return `${m}m ${rem}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ${rem}s`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

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
    const name = $el.attr("title") || $el.find(".product-title").text().trim() || "";
    const href = $el.attr("href") || "";
    const url = href.startsWith("http") ? href : `https://vietnhatplastic.com${href}`;
    const images = [];
    $el.find(".product-img img").each((_, img) => {
      const src = $(img).attr("src") || $(img).attr("data-src") || "";
      if (src) images.push(src.startsWith("http") ? src : `https://vietnhatplastic.com${src}`);
    });
    const code = $el.find(".product-code").text().trim() || "";
    const badge = $el.find(".product-badge .badge").text().trim() || "";
    const urlParts = href.split("/").filter(Boolean);
    const category = urlParts.length >= 3 ? urlParts[urlParts.length - 2] : "";

    if (name) {
      products.push({ name, code, url, images, thumbnail: images[0] || "", badge, category, page: pageNum });
    }
  });

  return products;
}

// ─── Main ───
async function main() {
  const totalPages = END_PAGE - START_PAGE + 1;
  console.log("🚀 VietNhat Plastic Product Scraper");
  console.log(`   Pages: ${START_PAGE} → ${END_PAGE} (${totalPages} pages)`);
  console.log(`   Delay: ${DELAY_MS}ms between requests\n`);

  const cycleTLS = await initCycleTLS();
  let allProducts = [];
  let failedPages = [];
  let emptyPages = [];

  // Resume support
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
      allProducts = progress.products || [];
      failedPages = progress.failed_pages || [];
      emptyPages = progress.empty_pages || [];
      const lastPage = progress.last_page || 0;
      console.log(`📂 Resuming from page ${lastPage + 1} (${allProducts.length} products so far)\n`);
    } catch (_) {
      console.log("⚠ Could not resume, starting fresh\n");
    }
  }

  const startFrom = allProducts.length > 0
    ? Math.max(...allProducts.map((p) => p.page)) + 1
    : START_PAGE;

  // ─── Statistics tracking ───
  const stats = {
    startTime: Date.now(),
    pagesProcessed: 0,
    successPages: 0,
    requestTimes: [],    // ms per request
    bytesReceived: 0,
    productsPerPage: [],
    imagesTotal: 0,
  };

  try {
    for (let page = startFrom; page <= END_PAGE; page++) {
      const url = page === 1 ? BASE_URL : `${BASE_URL}?pagenumber=${page}`;
      const tag = `[${page}/${END_PAGE}]`;
      const reqStart = Date.now();

      try {
        const response = await cycleTLS(url, {
          body: "",
          ja3: JA3,
          userAgent: USER_AGENT,
          headers: HEADERS,
        });

        const reqTime = Date.now() - reqStart;
        stats.requestTimes.push(reqTime);
        stats.pagesProcessed++;

        if (response.status === 200) {
          const html = typeof response.data === "string" ? response.data : String(response.data);
          stats.bytesReceived += Buffer.byteLength(html, "utf-8");
          const products = extractProducts(html, page);
          stats.productsPerPage.push(products.length);
          stats.successPages++;

          if (products.length > 0) {
            products.forEach((p) => { stats.imagesTotal += p.images.length; });
            allProducts.push(...products);

            // Live stats: ETA
            const elapsed = Date.now() - stats.startTime;
            const avgPerPage = elapsed / stats.pagesProcessed;
            const remaining = END_PAGE - page;
            const eta = formatDuration(remaining * avgPerPage);
            const speed = (stats.pagesProcessed / (elapsed / 1000)).toFixed(1);

            console.log(`${tag} ✅ ${products.length} products (total: ${allProducts.length}) | ${reqTime}ms | ETA: ${eta} | ${speed} pg/s`);
          } else {
            emptyPages.push(page);
            console.log(`${tag} ⚠ 0 products (empty page) | ${reqTime}ms`);
          }
        } else {
          console.log(`${tag} ❌ HTTP ${response.status} | ${Date.now() - reqStart}ms`);
          failedPages.push(page);
        }
      } catch (err) {
        stats.pagesProcessed++;
        console.error(`${tag} ❌ ${err.message}`);
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

      if (page < END_PAGE) await sleep(DELAY_MS);
    }

    // ─── Final output ───
    const output = {
      scraped_at: new Date().toISOString(),
      source: "vietnhatplastic.com",
      total_products: allProducts.length,
      total_pages_scraped: totalPages,
      failed_pages: failedPages,
      empty_pages: emptyPages,
      products: allProducts,
    };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

    // ─── Statistics summary ───
    const totalTime = Date.now() - stats.startTime;
    const avgReq = stats.requestTimes.length > 0
      ? Math.round(stats.requestTimes.reduce((a, b) => a + b, 0) / stats.requestTimes.length)
      : 0;
    const minReq = stats.requestTimes.length > 0 ? Math.min(...stats.requestTimes) : 0;
    const maxReq = stats.requestTimes.length > 0 ? Math.max(...stats.requestTimes) : 0;
    const avgProducts = stats.productsPerPage.length > 0
      ? (stats.productsPerPage.reduce((a, b) => a + b, 0) / stats.productsPerPage.length).toFixed(1)
      : 0;
    const fileSize = fs.existsSync(OUTPUT_FILE) ? fs.statSync(OUTPUT_FILE).size : 0;

    const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];

    console.log("\n" + "═".repeat(55));
    console.log("  📊 SCRAPE STATISTICS");
    console.log("═".repeat(55));
    console.log(`  Total time:         ${formatDuration(totalTime)}`);
    console.log(`  Pages processed:    ${stats.pagesProcessed} / ${totalPages}`);
    console.log(`  Success rate:       ${stats.successPages}/${stats.pagesProcessed} (${((stats.successPages / Math.max(stats.pagesProcessed, 1)) * 100).toFixed(1)}%)`);
    console.log(`  Failed pages:       ${failedPages.length}${failedPages.length > 0 ? " → " + failedPages.join(", ") : ""}`);
    console.log(`  Empty pages:        ${emptyPages.length}${emptyPages.length > 0 ? " → " + emptyPages.join(", ") : ""}`);
    console.log("─".repeat(55));
    console.log(`  Total products:     ${allProducts.length}`);
    console.log(`  Avg products/page:  ${avgProducts}`);
    console.log(`  Total images:       ${stats.imagesTotal}`);
    console.log(`  Categories:         ${categories.length}`);
    console.log("─".repeat(55));
    console.log(`  Avg response time:  ${avgReq}ms`);
    console.log(`  Min response time:  ${minReq}ms`);
    console.log(`  Max response time:  ${maxReq}ms`);
    console.log(`  Speed:              ${(stats.pagesProcessed / (totalTime / 1000)).toFixed(2)} pages/sec`);
    console.log(`  Data received:      ${formatBytes(stats.bytesReceived)}`);
    console.log(`  Output file:        ${formatBytes(fileSize)}`);
    console.log("─".repeat(55));

    if (categories.length > 0) {
      console.log("  📂 Categories:");
      categories
        .map((c) => ({ name: c, count: allProducts.filter((p) => p.category === c).length }))
        .sort((a, b) => b.count - a.count)
        .forEach((c) => console.log(`     ${c.name} (${c.count})`));
    }

    console.log("═".repeat(55));
    console.log(`  ✅ Output: ${OUTPUT_FILE}`);
    console.log("═".repeat(55));

    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
  } finally {
    cycleTLS.exit();
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
