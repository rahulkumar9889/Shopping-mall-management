/**
 * Shopping Mall Management System (SMMS)
 * Client-Side Interactive Operations: Floor Map, Store Directory Filtering, and Modals
 */

// Helper to fill credentials on login page
function fillCreds(username, password) {
  const userInput = document.getElementById('username');
  const passInput = document.getElementById('password');
  if (userInput && passInput) {
    userInput.value = username;
    passInput.value = password;
  }
}

// Floor Map Definitions (Levels 1 to 5)
const MALL_FLOOR_DATA = {
  1: {
    level: 'LEVEL 1: ATRIUM',
    title: 'Haute Couture & Fine Horology Salon',
    desc: 'Grand marble atrium housing world-renowned fashion flagships, Swiss fine watch salons, and premier concierge services.',
    badgeClass: 'bg-warning text-dark',
    units: [
      { code: '101', name: 'Zara Premier Outlet', category: 'Fashion & Apparel', active: true, color: 'border-warning' },
      { code: '105', name: 'Gucci Flagship Boutique', category: 'Luxury Leather', active: true, color: 'border-secondary' },
      { code: '108', name: 'Rolex & Fine Horology', category: 'Swiss Watches', active: true, color: 'border-secondary' },
      { code: '112', name: 'Sephora Beauty Lounge', category: 'Cosmetics', active: true, color: 'border-secondary' },
      { code: '118', name: 'Artisan Roast Espresso', category: 'Café & Bakery', active: true, color: 'border-secondary' },
      { code: '120', name: 'Central Concierge Desk', category: 'Guest Services', active: true, color: 'border-primary' }
    ]
  },
  2: {
    level: 'LEVEL 2: INNOVATION',
    title: 'Consumer Technology & Digital Flagships',
    desc: 'Cutting-edge electronics, authorized device repairs, interactive gaming lounges, and departmental officer safety station.',
    badgeClass: 'bg-info text-dark',
    units: [
      { code: '204', name: 'Apple Authorized Reseller', category: 'Electronics', active: true, color: 'border-info' },
      { code: '215', name: 'Sony PlayStation Arena', category: 'Gaming & VR', active: true, color: 'border-secondary' },
      { code: '218', name: 'L’Occitane Organic Spa', category: 'Skincare', active: true, color: 'border-secondary' },
      { code: '222', name: 'Samsung Experience Zone', category: 'Smartphones', active: true, color: 'border-secondary' },
      { code: '225', name: 'Floor 2 Safety Station', category: 'Safety & Compliance', active: true, color: 'border-warning' },
      { code: '230', name: 'Tech Support Genius Pod', category: 'Diagnostics', active: true, color: 'border-primary' }
    ]
  },
  3: {
    level: 'LEVEL 3: ACTIVE LIFE',
    title: 'Athleisure, Footwear & Outdoor Expeditions',
    desc: 'Performance sportswear, custom footwear motion labs, climbing & camping equipment, and mindful fitness studios.',
    badgeClass: 'bg-success text-white',
    units: [
      { code: '302', name: 'Nike Rise Flagship', category: 'Sportswear', active: true, color: 'border-danger' },
      { code: '308', name: 'Adidas Performance Lab', category: 'Athletics', active: true, color: 'border-secondary' },
      { code: '315', name: 'Lululemon Yoga Studio', category: 'Activewear', active: true, color: 'border-secondary' },
      { code: '320', name: 'The North Face Summit', category: 'Outerwear', active: true, color: 'border-secondary' },
      { code: '325', name: 'Puma Speed Studio', category: 'Footwear', active: true, color: 'border-secondary' },
      { code: '330', name: 'Recovery Hydro Lounge', category: 'Wellness', active: true, color: 'border-primary' }
    ]
  },
  4: {
    level: 'LEVEL 4: CULTURE',
    title: 'Bookstore, Contemporary Arts & Family Zone',
    desc: 'Multilingual international book gallery, children discovery store, artisanal pottery studio, and Japanese teppanyaki.',
    badgeClass: 'bg-primary text-white',
    units: [
      { code: '401', name: 'Kinokuniya Book Gallery', category: 'Literature', active: true, color: 'border-primary' },
      { code: '410', name: 'LEGO Discovery Emporium', category: 'Family & Play', active: true, color: 'border-warning' },
      { code: '416', name: 'Matsuri Teppanyaki Grill', category: 'Dining', active: true, color: 'border-secondary' },
      { code: '422', name: 'Arcade Wonderland', category: 'Gaming', active: true, color: 'border-secondary' },
      { code: '428', name: 'Galleria Art Pavilion', category: 'Exhibitions', active: true, color: 'border-secondary' },
      { code: '435', name: 'Toy Craft Workshop', category: 'Crafts', active: true, color: 'border-info' }
    ]
  },
  5: {
    level: 'LEVEL 5: SKYLINE',
    title: 'Sky Dining Terraces & IMAX Cinema',
    desc: 'Panoramic rooftop dining, twilight cocktail verandas, IMAX laser auditoriums, and open-air botanical gardens.',
    badgeClass: 'bg-danger text-white',
    units: [
      { code: '501', name: 'The Glasshouse Bistro', category: 'Fine Dining', active: true, color: 'border-success' },
      { code: '508', name: 'Saffron Royale Cuisine', category: 'Gourmet', active: true, color: 'border-warning' },
      { code: '515', name: 'Grand IMAX Laser Cinema', category: 'Cinema & Arts', active: true, color: 'border-danger' },
      { code: '520', name: 'Twilight Skyline Lounge', category: 'Cocktails', active: true, color: 'border-secondary' },
      { code: '525', name: 'Botanical Observation Deck', category: 'Garden Deck', active: true, color: 'border-info' },
      { code: '530', name: 'Sommelier Private Cellar', category: 'Wine Tasting', active: true, color: 'border-primary' }
    ]
  }
};

// Render floor map
function selectFloor(floorNumber) {
  const data = MALL_FLOOR_DATA[floorNumber];
  if (!data) return;

  // 1. Update button states
  const buttons = document.querySelectorAll('.floor-tab');
  buttons.forEach(btn => {
    const f = parseInt(btn.getAttribute('data-floor'), 10);
    if (f === floorNumber) {
      btn.className = 'btn btn-warning btn-sm fw-bold px-3 py-2 floor-tab active';
    } else {
      btn.className = 'btn btn-outline-secondary btn-sm text-light px-3 py-2 floor-tab';
    }
  });

  // 2. Update Floor Information Header
  const badgeEl = document.getElementById('mapFloorBadge');
  const titleEl = document.getElementById('mapFloorTitle');
  const descEl = document.getElementById('mapFloorDesc');
  const locationEl = document.getElementById('mapFloorLocation');

  if (badgeEl) {
    badgeEl.textContent = data.level;
    badgeEl.className = 'badge ' + data.badgeClass + ' font-mono fw-bold';
  }
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (locationEl) locationEl.innerHTML = '<i class="bi bi-geo-alt-fill text-warning me-1"></i> Level ' + floorNumber + ' Main Concourse &bull; Escalator & Elevator Access';

  // 3. Render Units Grid
  const gridEl = document.getElementById('mapUnitsGrid');
  if (gridEl) {
    gridEl.innerHTML = '';
    data.units.forEach(unit => {
      const col = document.createElement('div');
      col.className = 'col-md-2 col-4';
      col.innerHTML = `
        <div class="p-3 rounded-3 border ${unit.color} bg-dark h-100 map-unit-card" style="cursor: pointer; transition: transform 0.2s;" onclick="highlightMapUnit('${unit.code}', '${unit.name.replace(/'/g, "\\'")}', '${unit.category}', ${floorNumber})">
          <span class="text-warning font-mono small d-block">Unit #${unit.code}</span>
          <strong class="text-white small d-block mt-1 text-truncate">${unit.name}</strong>
          <small class="text-success font-mono" style="font-size: 0.65rem;">Active</small>
        </div>
      `;
      gridEl.appendChild(col);
    });
  }

  // 4. Update the highlight box to first unit
  if (data.units.length > 0) {
    highlightMapUnit(data.units[0].code, data.units[0].name, data.units[0].category, floorNumber);
  }
}

// Highlight single unit detail
function highlightMapUnit(code, name, category, floor) {
  const codeEl = document.getElementById('unitDetailCode');
  const nameEl = document.getElementById('unitDetailName');
  const descEl = document.getElementById('unitDetailDesc');

  if (codeEl) codeEl.textContent = '#' + code;
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.textContent = 'Level ' + floor + ' East Promenade • Category: ' + category + ' • Status: Active';
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Bind floor buttons
  const buttons = document.querySelectorAll('.floor-tab');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      const floor = parseInt(this.getAttribute('data-floor'), 10);
      selectFloor(floor);
    });
  });

  // Select Floor 1 initially
  selectFloor(1);
});
