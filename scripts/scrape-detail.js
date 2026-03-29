const initCycleTLS = require("cycletls");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ─── Config ───
const INPUT_FILE = path.join(__dirname, "products.json");
const OUTPUT_DIR = path.join(__dirname, "products-detail");
const COMBINED_FILE = path.join(__dirname, "products-detailed.json");
const PROGRESS_FILE = path.join(__dirname, "detail-progress.json");
const CONCURRENCY = 10;      // parallel requests
const DELAY_BETWEEN_BATCH = 300; // ms between batches
const BATCH_SAVE_EVERY = 50;

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

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── Extract detail from a product page ───
function extractDetail(html) {
  const $ = cheerio.load(html);
  const detail = {};

  detail.name = $(".product-detail-title").first().text().trim() || "";

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
      const colorTexts = [];
      $(el).find("ul.color-list li a").each((_, a) => {
        const style = $(a).attr("style") || "";
        const match = style.match(/background-color:\s*([^;]+)/);
        if (match) colorTexts.push(match[1].trim());
      });
      if (colorTexts.length === 0) {
        const colorText = text.replace("Màu sắc:", "").trim();
        if (colorText) colorTexts.push(colorText);
      }
      detail.colors = colorTexts;
    }
  });

  const images = [];
  $(".product-detail-top img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src") || "";
    const full = absUrl(src);
    if (full && !images.includes(full)) images.push(full);
  });
  detail.images = images;

  const descSection = $(".product-detail-bottom .article-content").first();
  if (descSection.length) {
    detail.description = descSection.find("p").first().text().trim() || descSection.text().trim();
    detail.descriptionHtml = descSection.html() || "";
  }

  detail.badge = $(".product-badge .badge, .product-detail-top .badge").first().text().trim() || "";
  return detail;
}

// ─── Fetch a single product detail (with retry) ───
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function fetchProduct(cycleTLS, product, _index, _total) {
  const url = product.url;
  if (!url) return { product: { ...product, detail: null }, ok: false, skipped: true, time: 0, bytes: 0 };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const reqStart = Date.now();
    try {
      const r = await cycleTLS(url, { body: "", ja3: JA3, userAgent: USER_AGENT, headers: HEADERS });
      const reqTime = Date.now() - reqStart;

      if (r.status === 200) {
        const html = typeof r.data === "string" ? r.data : String(r.data);
        const bytes = Buffer.byteLength(html, "utf-8");
        const detail = extractDetail(html);

        const merged = {
          ...product,
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
        };

        return { product: merged, ok: true, skipped: false, time: reqTime, bytes, detail };
      }

      // Retry on 408 timeout
      if (r.status === 408 && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
        continue;
      }
      return { product: { ...product, detail_error: `HTTP ${r.status}` }, ok: false, skipped: false, time: reqTime, bytes: 0 };
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
        continue;
      }
      return { product: { ...product, detail_error: err.message }, ok: false, skipped: false, time: Date.now() - reqStart, bytes: 0 };
    }
  }
}

// ─── Save individual product JSON ───
function saveProductFile(product) {
  const cat = product.category || "uncategorized";
  const catDir = path.join(OUTPUT_DIR, cat);
  ensureDir(catDir);

  const filename = slugify(product.name) + ".json";
  const filePath = path.join(catDir, filename);

  // Strip descriptionHtml from individual file (keep it lean)
  const { descriptionHtml: _descriptionHtml, ...clean } = product;
  fs.writeFileSync(filePath, JSON.stringify(clean, null, 2), "utf-8");
  return filePath;
}

// ─── Main ───
async function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error("❌ Missing", INPUT_FILE);
    console.error("   Run scrape-products.js first.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
  const products = data.products || [];

  console.log("🚀 Detail scraper (concurrent)");
  console.log(`   Products: ${products.length}`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  console.log(`   Batch delay: ${DELAY_BETWEEN_BATCH}ms`);
  console.log(`   Output: ${OUTPUT_DIR}/<category>/<product>.json\n`);

  // Resume support — only track index, not all products
  let startIndex = 0;
  let results = [];

  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
      startIndex = progress.lastIndex || 0;
      console.log(`📂 Resuming from index ${startIndex}\n`);
    } catch (_e) { /* start fresh */ }
  }

  ensureDir(OUTPUT_DIR);
  const cycleTLS = await initCycleTLS();

  // ─── Statistics ───
  const stats = {
    startTime: Date.now(),
    processed: 0, success: 0, skipped: 0, failed: 0,
    requestTimes: [], bytesReceived: 0, imagesTotal: 0,
    withDimensions: 0, withMaterial: 0, withDescription: 0,
    withCode: 0, withColors: 0,
    materials: {}, categories: {},
    filesWritten: 0,
  };

  const failedIndices = [];
  const remaining = products.slice(startIndex);
  const batches = [];

  // Split into batches
  for (let i = 0; i < remaining.length; i += CONCURRENCY) {
    batches.push(remaining.slice(i, i + CONCURRENCY).map((p, j) => ({ product: p, globalIndex: startIndex + i + j })));
  }

  try {
    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b];
      const batchPromises = batch.map(({ product, globalIndex }) =>
        fetchProduct(cycleTLS, product, globalIndex, products.length)
      );

      const batchResults = await Promise.all(batchPromises);

      for (let r = 0; r < batchResults.length; r++) {
        const res = batchResults[r];
        const gi = batch[r].globalIndex;
        stats.processed++;

        if (res.skipped) {
          stats.skipped++;
          results.push(res.product);
          console.log(`[${gi + 1}/${products.length}] ⚠ Skipped (no URL)`);
          continue;
        }

        if (res.ok) {
          stats.success++;
          stats.requestTimes.push(res.time);
          stats.bytesReceived += res.bytes;
          stats.imagesTotal += res.detail.images.length;

          if (res.detail.dimensions) stats.withDimensions++;
          if (res.detail.material) {
            stats.withMaterial++;
            stats.materials[res.detail.material] = (stats.materials[res.detail.material] || 0) + 1;
          }
          if (res.detail.description) stats.withDescription++;
          if (res.detail.code) stats.withCode++;
          if (res.detail.colors && res.detail.colors.length > 0) stats.withColors++;

          const cat = res.product.category || "uncategorized";
          stats.categories[cat] = (stats.categories[cat] || 0) + 1;

          // Save individual file
          saveProductFile(res.product);
          stats.filesWritten++;

          results.push(res.product);

          // Live stats
          const elapsed = Date.now() - stats.startTime;
          const avgPerItem = elapsed / stats.processed;
          const left = products.length - (gi + 1);
          const eta = formatDuration((left / CONCURRENCY) * (avgPerItem));
          const speed = (stats.processed / (elapsed / 1000)).toFixed(1);

          console.log(`[${gi + 1}/${products.length}] ✅ ${res.product.name} | ${res.time}ms | ETA: ${eta} | ${speed}/s`);
        } else {
          stats.failed++;
          failedIndices.push(gi);
          results.push(res.product);
          console.log(`[${gi + 1}/${products.length}] ❌ ${res.product.detail_error || "error"}: ${batch[r].product.name}`);
        }
      }

      // Progress save — only store the index
      const lastGi = batch[batch.length - 1].globalIndex + 1;
      if (lastGi % BATCH_SAVE_EVERY < CONCURRENCY || b === batches.length - 1) {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ lastIndex: lastGi }), "utf-8");
        console.log(`  💾 Progress saved (${lastGi}/${products.length})`);
      }

      // Batch delay
      if (b < batches.length - 1) await sleep(DELAY_BETWEEN_BATCH);
    }

    // ─── Save combined file ───
    const output = {
      scraped_at: new Date().toISOString(),
      source: "vietnhatplastic.com",
      total: results.length,
      failed: stats.failed,
      products: results,
    };
    fs.writeFileSync(COMBINED_FILE, JSON.stringify(output, null, 2), "utf-8");

    // ─── Statistics ───
    const totalTime = Date.now() - stats.startTime;
    const avgReq = stats.requestTimes.length > 0
      ? Math.round(stats.requestTimes.reduce((a, b) => a + b, 0) / stats.requestTimes.length) : 0;
    const minReq = stats.requestTimes.length > 0 ? Math.min(...stats.requestTimes) : 0;
    const maxReq = stats.requestTimes.length > 0 ? Math.max(...stats.requestTimes) : 0;
    const combinedSize = fs.existsSync(COMBINED_FILE) ? fs.statSync(COMBINED_FILE).size : 0;
    const avgImgs = stats.success > 0 ? (stats.imagesTotal / stats.success).toFixed(1) : 0;

    // Count output dir size
    let dirSize = 0;
    let fileCount = 0;
    const catDirs = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
    catDirs.forEach((d) => {
      const dp = path.join(OUTPUT_DIR, d);
      if (fs.statSync(dp).isDirectory()) {
        const files = fs.readdirSync(dp);
        fileCount += files.length;
        files.forEach((f) => { dirSize += fs.statSync(path.join(dp, f)).size; });
      }
    });

    console.log("\n" + "═".repeat(60));
    console.log("  📊 DETAIL SCRAPE STATISTICS");
    console.log("═".repeat(60));
    console.log(`  Total time:          ${formatDuration(totalTime)}`);
    console.log(`  Products processed:  ${stats.processed} / ${products.length}`);
    console.log(`  Success rate:        ${stats.success}/${stats.processed} (${((stats.success / Math.max(stats.processed, 1)) * 100).toFixed(1)}%)`);
    console.log(`  Failed:              ${stats.failed}`);
    console.log(`  Skipped (no URL):    ${stats.skipped}`);
    console.log("─".repeat(60));
    console.log(`  Concurrency:         ${CONCURRENCY} parallel`);
    console.log(`  Effective speed:     ${(stats.processed / (totalTime / 1000)).toFixed(2)} products/sec`);
    console.log(`  Avg response time:   ${avgReq}ms`);
    console.log(`  Min response time:   ${minReq}ms`);
    console.log(`  Max response time:   ${maxReq}ms`);
    console.log("─".repeat(60));
    console.log(`  Total images:        ${stats.imagesTotal} (avg ${avgImgs}/product)`);
    console.log(`  With dimensions:     ${stats.withDimensions}/${stats.success} (${((stats.withDimensions / Math.max(stats.success, 1)) * 100).toFixed(0)}%)`);
    console.log(`  With material:       ${stats.withMaterial}/${stats.success} (${((stats.withMaterial / Math.max(stats.success, 1)) * 100).toFixed(0)}%)`);
    console.log(`  With code:           ${stats.withCode}/${stats.success} (${((stats.withCode / Math.max(stats.success, 1)) * 100).toFixed(0)}%)`);
    console.log(`  With colors:         ${stats.withColors}/${stats.success} (${((stats.withColors / Math.max(stats.success, 1)) * 100).toFixed(0)}%)`);
    console.log(`  With description:    ${stats.withDescription}/${stats.success} (${((stats.withDescription / Math.max(stats.success, 1)) * 100).toFixed(0)}%)`);
    console.log("─".repeat(60));
    console.log(`  Data received:       ${formatBytes(stats.bytesReceived)}`);
    console.log(`  Combined JSON:       ${formatBytes(combinedSize)}`);
    console.log(`  Individual files:    ${fileCount} files (${formatBytes(dirSize)})`);
    console.log(`  Category folders:    ${catDirs.length}`);
    console.log("─".repeat(60));

    const matEntries = Object.entries(stats.materials).sort((a, b) => b[1] - a[1]);
    if (matEntries.length > 0) {
      console.log("  🧱 Materials:");
      matEntries.forEach(([m, c]) => console.log(`     ${m} (${c})`));
      console.log("─".repeat(60));
    }

    const catEntries = Object.entries(stats.categories).sort((a, b) => b[1] - a[1]);
    if (catEntries.length > 0) {
      console.log("  📂 Categories:");
      catEntries.forEach(([c, n]) => console.log(`     ${c} (${n})`));
    }

    console.log("═".repeat(60));
    console.log(`  ✅ Individual: ${OUTPUT_DIR}/<category>/<product>.json`);
    console.log(`  ✅ Combined:   ${COMBINED_FILE}`);
    console.log("═".repeat(60));

    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
  } finally {
    cycleTLS.exit();
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
