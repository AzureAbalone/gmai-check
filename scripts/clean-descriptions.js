/**
 * Clean product descriptions:
 * 1. Remove manufacturer contact info block ("Thông tin liên hệ" ... end)
 * 2. Remove brand story block ("Thương hiệu Nhựa Việt Nhật" ... end)
 * 3. Remove manufacturer name references ("Việt Nhật", "Nhựa Việt Nhật", "Hokori")
 * 4. Parse structured sections: productInfo, advantages, usage, storage
 */

const fs = require('fs')
const path = require('path')

const dataPath = path.resolve(__dirname, '../server/data/products.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

// Junk blocks to cut (everything from marker to end of description)
const CUT_FROM_MARKERS = [
  'Thông tin liên hệ',
  'Thương hiệu Nhựa Việt Nhật',
  'NHỰA VIỆT NHẬT - MANG TIỆN NGHI',
  'Nhựa Việt Nhật - Một thương hiệu',
  '"Chất lượng là nền tảng',
]

// Lines to remove if they contain these
const JUNK_LINE_PATTERNS = [
  /^Hotline:/i,
  /^Zalo\s*(OA)?:/i,
  /^Website:/i,
  /^Fanpage:/i,
  /^TikTok:/i,
  /^Youtube:/i,
  /^Văn phòng:/i,
  /^Nhà máy:/i,
  /vietnhatplastic/i,
  /facebook\.com\/.*viet\s*nhat/i,
  /tiktok\.com\/.*viet\s*nhat/i,
  /youtube\.com\/.*viet\s*nhat/i,
  /zalo\.me\/.*viet\s*nhat/i,
  /ISO 9001/,
]

// Manufacturer name patterns to strip from text
const NAME_REPLACEMENTS = [
  // Order matters: longer patterns first
  [/\bcủa nhà Việt Nhật\b/g, ''],
  [/\bcủa Nhựa Việt Nhật\b/g, ''],
  [/\bNhựa Việt Nhật\b/g, ''],
  [/\bViệt Nhật\b/g, ''],
  [/\bHokori\b/g, ''],
  // Clean up double spaces left behind
  [/\s{2,}/g, ' '],
  // Clean up "của " at end when brand was removed
  [/\bcủa\s*$/gm, ''],
  [/\bcủa\s*\./g, '.'],
  [/\bcủa\s*,/g, ','],
]

let cleaned = 0
let sectionsFound = 0

for (const product of data) {
  let desc = product.description || ''
  if (!desc) continue

  // 1. Cut everything from junk markers to end
  for (const marker of CUT_FROM_MARKERS) {
    const idx = desc.indexOf(marker)
    if (idx !== -1) {
      desc = desc.substring(0, idx)
    }
  }

  // 2. Remove junk lines
  const lines = desc.split('\n')
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim()
    if (!trimmed) return true // keep blank lines
    return !JUNK_LINE_PATTERNS.some(pat => pat.test(trimmed))
  })
  desc = cleanLines.join('\n')

  // 3. Strip manufacturer names from remaining text
  for (const [pattern, replacement] of NAME_REPLACEMENTS) {
    desc = desc.replace(pattern, replacement)
  }

  // 4. Trim and clean up
  desc = desc.replace(/\n{3,}/g, '\n\n').trim()

  // 5. Parse structured sections
  const sections = {
    productInfo: '',
    advantages: [],
    usage: [],
    storage: [],
  }

  // Check for structured format
  if (desc.includes('Ưu điểm') || desc.includes('Hướng dẫn sử dụng') || desc.includes('Bảo quản')) {
    sectionsFound++
    
    // Split by known headers
    const headerPattern = /^(Thông tin sản phẩm|Ưu điểm|Hướng dẫn sử dụng|Bảo quản)\s*$/m
    const parts = desc.split(headerPattern)
    
    let currentSection = 'intro'
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim()
      if (!part) continue
      
      if (part === 'Thông tin sản phẩm') { currentSection = 'productInfo'; continue }
      if (part === 'Ưu điểm') { currentSection = 'advantages'; continue }
      if (part === 'Hướng dẫn sử dụng') { currentSection = 'usage'; continue }
      if (part === 'Bảo quản') { currentSection = 'storage'; continue }
      
      if (currentSection === 'intro' || currentSection === 'productInfo') {
        sections.productInfo = part
      } else if (currentSection === 'advantages') {
        sections.advantages = part.split('\n')
          .map(l => l.replace(/^-\s*/, '').trim())
          .filter(l => l.length > 0)
      } else if (currentSection === 'usage') {
        sections.usage = part.split('\n')
          .map(l => l.replace(/^-\s*/, '').trim())
          .filter(l => l.length > 0)
      } else if (currentSection === 'storage') {
        sections.storage = part.split('\n')
          .map(l => l.replace(/^-\s*/, '').trim())
          .filter(l => l.length > 0)
      }
    }
  } else {
    // No structure, just use whole text as productInfo
    sections.productInfo = desc
  }

  // Update product
  if (product.description !== desc) cleaned++
  product.description = desc
  product.productInfo = sections.productInfo
  product.advantages = sections.advantages
  product.usage = sections.usage
  product.storage = sections.storage
}

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')

console.log(`✅ Cleaned ${cleaned} / ${data.length} descriptions`)
console.log(`📋 Parsed ${sectionsFound} structured descriptions`)

// Verify no junk remains
const remaining = data.filter(p => 
  p.description.includes('vietnhatplastic') || 
  p.description.includes('Hotline:') ||
  p.description.includes('Thông tin liên hệ') ||
  p.description.includes('Thương hiệu Nhựa Việt Nhật')
)
console.log(`🔍 Remaining junk: ${remaining.length} products`)
if (remaining.length) {
  remaining.slice(0, 3).forEach(p => console.log('  -', p.id, p.name))
}
