/* Carpet browsing follows the manufacturer's collection → design → colour structure. */
(() => {
  const catalog = window.carpetCollection;
  const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words = {
    'Xem bộ sưu tập':'View collection', 'Tài liệu kỹ thuật':'Technical sheet',
    'Tìm bộ sưu tập':'Search collections', 'Tất cả bộ sưu tập':'All collections', 'Bộ sưu tập':'Collection',
    'Tất cả mẫu thiết kế':'All designs', 'Mẫu thiết kế':'Design',
    'Tìm tên hoặc mã màu':'Search colour name or code', 'Không tìm thấy kết quả.':'No results found.',
    'Màu sắc & mẫu thiết kế':'Colours & designs', 'Thông số kỹ thuật':'Technical specifications',
    'Tài liệu & chứng nhận':'Documents & certifications', 'Tư vấn màu này ↗':'Enquire about this colour ↗',
    'Đã chọn':'Selected', 'Dòng tiết kiệm':'Budget line', 'Ảnh không gian':'Room photographs'
  };
  Object.assign(window.carpetTranslations, words);
  const local = text => document.documentElement.lang === 'en' ? words[text] || text : text;
  document.addEventListener('tfw:languagechange', () => {
    document.querySelectorAll('.carpet-photo-thumbs button').forEach((button,index) => button.setAttribute('aria-label', `${local('Ảnh không gian')} ${index + 1}`));
  });
  const oldDecorate = catalog.decorateGrid;
  catalog.decorateGrid = function(filter) {
    oldDecorate(filter);
    document.getElementById('carpetBrowse')?.remove();
    if (filter !== 'Flooring Solutions') return;
    const grid = document.getElementById('productGrid');
    const cards = [...grid.querySelectorAll('.product-card')];
    cards.forEach(card => {
      const trigger = card.querySelector('.product-title');
      const id = trigger.dataset.product, tech = catalog.technicalData[id];
      const image = card.querySelector('.product-image-button img');
      image.src = window.productDetails[id].images[0];
      image.style.cssText = catalog.imageStyle(id, 0);
      const heading = document.createElement('div');
      heading.className = 'carpet-card-heading';
      heading.append(trigger);
      card.prepend(heading);
      const meta = card.querySelector('.product-meta');
      meta.innerHTML = `<button type="button" class="carpet-visit">Xem bộ sưu tập <span aria-hidden="true">→</span></button><a href="${safe(tech.source)}" target="_blank" rel="noopener">Tài liệu kỹ thuật <span aria-hidden="true">↗</span></a>`;
      meta.querySelector('button').onclick = () => trigger.click();
      card.querySelector('.quick-add')?.remove();
    });
    const controls = document.createElement('div');
    controls.id = 'carpetBrowse'; controls.className = 'carpet-browse';
    controls.innerHTML = `<label><span>Tìm bộ sưu tập</span><input type="search" id="carpetCollectionSearch"></label><label><span>Bộ sưu tập</span><select id="carpetCollectionGroup"><option value="all">Tất cả bộ sưu tập</option><option value="budget">Dòng tiết kiệm</option></select></label><output aria-live="polite"></output>`;
    grid.before(controls);
    const empty = document.createElement('p'); empty.className = 'carpet-empty'; empty.textContent = 'Không tìm thấy kết quả.'; empty.hidden = true; grid.append(empty);
    const update = () => {
      const query = controls.querySelector('input').value.trim().toLocaleLowerCase();
      const budget = controls.querySelector('select').value === 'budget';
      cards.forEach(card => { const id = card.querySelector('[data-product]').dataset.product; card.hidden = !card.querySelector('.product-title').textContent.toLocaleLowerCase().includes(query) || (budget && !catalog.firstGroup.includes(id)); });
      grid.querySelectorAll('.carpet-group').forEach(heading => {
        let next = heading.nextElementSibling, visible = false;
        while(next && !next.classList.contains('carpet-group')) { if(next.classList.contains('product-card') && !next.hidden) visible = true; next = next.nextElementSibling; }
        heading.hidden = !visible;
      });
      const count = cards.filter(card => !card.hidden).length;
      controls.querySelector('output').replaceChildren(`${count} / ${cards.length}`);
      empty.hidden = count > 0;
    };
    controls.querySelector('input').oninput = update;
    controls.querySelector('select').onchange = update;
    update();
  };

  catalog.enhanceDetail = function(id) {
    document.getElementById('carpetSectionNav')?.remove();
    const root = document.getElementById('productDetail');
    if (!catalog.collectionLinks[id]) return;
    const gallery = document.getElementById('detailGallery');
    const photos = [...gallery.querySelectorAll('.detail-image')];
    gallery.querySelector('.carpet-gallery-heading')?.remove();
    const thumbs = document.createElement('div'); thumbs.className = 'carpet-photo-thumbs';
    photos.forEach((figure, index) => {
      figure.hidden = index !== 0;
      const button = document.createElement('button'); button.type = 'button';
      button.setAttribute('aria-label', `${local('Ảnh không gian')} ${index + 1}`);
      button.setAttribute('aria-pressed', String(index === 0));
      const image = figure.querySelector('img').cloneNode(); image.alt = ''; image.loading = 'lazy';
      button.append(image); thumbs.append(button);
      button.onclick = () => { photos.forEach((photo, i) => { photo.hidden = i !== index; }); [...thumbs.children].forEach((thumb,i) => thumb.setAttribute('aria-pressed', String(i === index))); };
    });
    gallery.append(thumbs);
    const info = root.querySelector('.detail-information');
    const nav = document.createElement('nav'); nav.id = 'carpetSectionNav';
    nav.innerHTML = `<button type="button" data-section="carpetColours">Màu sắc & mẫu thiết kế</button><button type="button" data-section="specificationsPanel">Thông số kỹ thuật</button><button type="button" data-section="carpetCertificates">Tài liệu & chứng nhận</button>`;
    info.prepend(nav);
    nav.querySelectorAll('button').forEach(button => button.onclick = () => { const panel = document.getElementById(button.dataset.section); if(panel.tagName === 'DETAILS')panel.open = true; panel.scrollIntoView({block:'start',behavior:'smooth'}); });

    const panel = document.getElementById('carpetColours');
    const groups = window.carpetColours[id];
    const title = document.getElementById('detailTitle').textContent;
    panel.innerHTML = `<div class="carpet-colour-heading"><div><p class="eyebrow">MILLIKEN · ${safe(title)}</p><h3>Màu sắc & mẫu thiết kế</h3></div><span>${groups.reduce((n,g)=>n+g.colors.length,0)}</span></div><p>Màu thực tế có thể khác màn hình. Vui lòng xác nhận mẫu vật liệu trước khi đặt hàng.</p><div class="carpet-colour-tools"><label><span>Mẫu thiết kế</span><select id="carpetDesignFilter"><option value="all">Tất cả mẫu thiết kế</option>${groups.map((g,i)=>`<option value="${i}">${safe(g.design)} (${g.colors.length})</option>`).join('')}</select></label><label><span>Tìm tên hoặc mã màu</span><input type="search" id="carpetColourSearch"></label><output id="carpetColourCount" aria-live="polite"></output></div><div class="carpet-selection" hidden><div><span>Đã chọn</span><strong></strong></div><a>Tư vấn màu này ↗</a></div>${groups.map((g,i)=>`<section class="carpet-design-group" data-design="${i}"><h4>${safe(g.design)} <small>${g.colors.length}</small></h4><div class="carpet-colour-grid">${g.colors.map(c=>`<figure data-colour="${safe(c.name)}"><button type="button" aria-label="${safe(c.name)}" aria-pressed="false"><img src="${safe(c.image)}" alt="" loading="lazy"></button><figcaption>${safe(c.name)}</figcaption></figure>`).join('')}</div></section>`).join('')}<p class="carpet-empty" hidden>Không tìm thấy kết quả.</p>`;
    const figures = [...panel.querySelectorAll('[data-colour]')];
    const update = () => {
      const design = panel.querySelector('select').value, query = panel.querySelector('input').value.trim().toLocaleLowerCase();
      let count = 0;
      panel.querySelectorAll('.carpet-design-group').forEach(group => {
        let groupCount = 0;
        group.querySelectorAll('figure').forEach(figure => { figure.hidden = (design !== 'all' && group.dataset.design !== design) || !figure.dataset.colour.toLocaleLowerCase().includes(query); if(!figure.hidden)groupCount++; });
        group.hidden = groupCount === 0; count += groupCount;
      });
      panel.querySelector('output').replaceChildren(`${count} / ${figures.length}`);
      panel.querySelector('.carpet-empty').hidden = count > 0;
    };
    panel.querySelector('select').onchange = update;
    panel.querySelector('input').oninput = update;
    figures.forEach(figure => figure.querySelector('button').onclick = () => {
      figures.forEach(f => f.querySelector('button').setAttribute('aria-pressed', String(f === figure)));
      const selected = panel.querySelector('.carpet-selection'); selected.hidden = false;
      selected.querySelector('strong').replaceChildren(figure.dataset.colour);
      selected.querySelector('a').href = `mailto:hi@tfw.space?subject=${encodeURIComponent(title+' — '+figure.dataset.colour)}`;
    });
    update();
    root.querySelector('.detail-accordions>details:first-child').open = false;
  };
})();
