(() => {
  const translations={};
  const text=(vi,en)=>(translations[vi]=en,vi);
  const firstGroup=['retrofit','building-blocks','natural-supply','airborn'];
  const additions={
    'moments-in-time':{
      description:text('Họa tiết lấy cảm hứng từ đường chỉ và cảnh quan biến đổi. Những lớp kết cấu và sắc màu trầm tạo cảm giác bình yên cho không gian.','Stitch-inspired patterns and changing landscapes, layered with muted colours for a calm, grounded space.'),
      specifications:text('Thương hiệu: Milliken\nBộ sưu tập: Moments in Time\nLoại: thảm tấm\nKích thước, đế thảm và màu: xác nhận theo mẫu được chọn\nGiá và thời gian giao: liên hệ báo giá','Brand: Milliken\nCollection: Moments in Time\nType: carpet tiles\nDimensions, backing and colours: confirm selected design\nPrice and delivery: contact for quotation'),
      images:['assets/products/milliken-moments-in-time-catalogue.jpg','assets/products/milliken-moments-in-time-2.webp'],
      sourceUrl:'https://www.milliken.com/en-my/businesses/floor-covering',
      summary:text('Kết cấu và sắc màu trầm','Layered texture and muted colour')
    },
    'pattern-play':{
      description:text('Kết hợp hình khối, màu sắc và kết cấu để tạo điểm nhấn. Từ gam trung tính nhẹ nhàng đến bố cục nổi bật cho từng khu vực.','Mix shapes, colours and textures, from quiet neutrals to bold patterns that define each area.'),
      specifications:text('Thương hiệu: Milliken\nLoại: thảm tấm\nKích thước tham khảo: 50 × 50 cm\nSợi: polyamide 6\nĐế tham khảo: Comfort Lite / Comfort Plus\nMàu, đế thảm cung ứng tại Việt Nam và giá: xác nhận khi báo giá','Brand: Milliken\nType: carpet tiles\nReference tile size: 50 × 50 cm\nFibre: polyamide 6\nReference backing: Comfort Lite / Comfort Plus\nLocal colours, backing availability and price: confirmed with quotation'),
      images:['assets/products/milliken-pattern-play-catalogue.jpg','assets/products/milliken-pattern-play-2.webp'],
      sourceUrl:'https://www.milliken.com/en-gb/businesses/floor-covering/collections/pattern-play',
      summary:text('Hình khối và màu sắc','Playful shapes and colour')
    },
    coastline:{
      description:text('Lấy cảm hứng từ nơi đất liền gặp biển. Những lớp màu chuyển nhẹ kết nối các khu vực trong một bố cục tự nhiên.','Inspired by the meeting of land and sea. Soft colour transitions connect areas in a flowing, natural layout.'),
      specifications:text('Thương hiệu: Milliken\nHọa tiết: Landscape, Seascape và Transitions\nSợi: nylon ECONYL tái chế\nKích thước, màu và đế thảm: xác nhận theo cấu hình địa phương\nGiá và thời gian giao: liên hệ báo giá','Brand: Milliken\nDesigns: Landscape, Seascape and Transitions\nFibre: recycled ECONYL nylon\nDimensions, colours and backing: confirm local configuration\nPrice and delivery: contact for quotation'),
      images:['assets/products/milliken-coastline-2.jpg'],
      sourceUrl:'https://www.milliken.com/en-gb/businesses/floor-covering/collections/coastline',
      summary:text('Chuyển sắc ven biển','Coastal colour transitions')
    },
    passage:{
      description:text('Lấy cảm hứng từ ánh sáng và chuyển động. Những đường nét mềm mại và sắc màu điểm xuyết dẫn lối qua không gian.','Light-inspired patterns with flowing lines and colour accents that guide movement through a space.'),
      specifications:text('Thương hiệu: Milliken\nCấu tạo: thảm sợi vòng\nKích thước: 100 × 100 cm hoặc 25 × 100 cm\nSợi: 100% nylon được Milliken chứng nhận\nPhương pháp nhuộm: PrintWorks\nĐế: WellBAC Comfort không PVC; tùy chọn TractionBack\nĐộ dày danh định: 8,4 mm ±10%\nGiá, màu và thời gian giao: xác nhận khi báo giá','Brand: Milliken\nConstruction: tufted loop\nTile sizes: 100 × 100 cm / 25 × 100 cm\nFibre: 100% Milliken-certified nylon\nDye method: PrintWorks\nBacking: PVC-free WellBAC Comfort; optional TractionBack\nNominal thickness: 8.4 mm ±10%\nPrice, colours and delivery: confirmed with quotation'),
      images:['assets/products/milliken-passage-1.png'],
      sourceUrl:'https://pr.www.ipros.com/en/milliken/product/detail/2000627641/',
      summary:text('Đường nét của ánh sáng','Patterns of light')
    }
  };
  for(const [id,product] of Object.entries(additions))window.productDetails[id]={...product,brand:'Milliken',productType:text('Thảm tấm','Carpet tiles'),swatches:[],variants:[],galleryModes:product.images.map(()=> 'photo'),highlights:[product.summary]};
  const copy={
    retrofit:['Thảm tấm cho không gian làm việc linh hoạt. Chọn màu và bố cục phù hợp với dự án.','Carpet tiles for flexible workspaces. Choose colours and a layout to suit your project.','Linh hoạt cho văn phòng','Flexible office flooring'],
    'building-blocks':['Thảm tấm 50 × 50 cm với họa tiết cấu trúc, dễ phối màu để phân vùng không gian.','Structured 50 × 50 cm carpet tiles. Combine colours to define different areas.','Phối màu, phân vùng','Colour and zoning'],
    'natural-supply':['Họa tiết lấy cảm hứng từ thiên nhiên, mang lại cảm giác thư thái cho văn phòng. Dạng tấm 25 × 100 cm.','Nature-inspired patterns for a calm office setting. Available in 25 × 100 cm tiles.','Cảm hứng thiên nhiên','Inspired by nature'],
    airborn:['Họa tiết nhẹ nhàng lấy cảm hứng từ bầu trời. Thảm tấm 25 × 100 cm cho không gian làm việc thoáng đãng.','Soft, sky-inspired patterns in 25 × 100 cm tiles for an open, airy workspace.','Nhẹ nhàng, thoáng đãng','Light and airy'],
    cornerstone:['Bốn họa tiết lấy cảm hứng từ đá: Elements, Keystone, Pavement và Fundament. Thảm tấm 50 × 50 cm.','Four stone-inspired patterns: Elements, Keystone, Pavement and Fundament. Available in 50 × 50 cm tiles.','Kết cấu đá tự nhiên','Stone-inspired texture'],
    'heavy-meta':['Họa tiết lấy cảm hứng từ kim loại, tạo chiều sâu cho sàn văn phòng. Thảm tấm 25 × 100 cm với đế WellBAC Comfort.','Metal-inspired patterns add depth to office floors. 25 × 100 cm tiles with WellBAC Comfort backing.','Cảm hứng kim loại','Metal-inspired patterns'],
    'living-facades':['Lấy cảm hứng từ vườn đứng và những lớp cây xanh. Phối các tấm thảm để tạo chuyển động và chiều sâu cho không gian.','Inspired by living walls and layers of greenery. Combine tiles to bring movement and depth to your floor.','Những lớp sắc xanh','Layers of greenery'],
    patina:['Họa tiết gợi bề mặt đá, đồng và gỗ qua thời gian. Phối kết cấu tương phản để tạo dấu ấn riêng cho không gian.','Patterns inspired by stone, copper and timber as they age. Mix contrasting textures for a distinctive floor.','Vẻ đẹp theo thời gian','Textures shaped by time'],
  };
  const summaries=Object.fromEntries(Object.entries(additions).map(([id,product])=>[id,product.summary]));
  for(const [id,[vi,en,shortVi,shortEn]] of Object.entries(copy)){
    const product=window.productDetails[id];
    if(!product)continue;
    if(product.specifications==='Thông số kỹ thuật:' && product.description.includes('Thông số kỹ thuật:'))product.specifications=product.description.split('Thông số kỹ thuật:')[1].trim();
    product.description=text(vi,en);
    product.brand='Milliken';
    product.productType=text('Thảm tấm','Carpet tiles');
    product.swatches=[];
    product.highlights=[text(shortVi,shortEn),text('Chọn màu theo mẫu vật liệu','Choose colours from material samples'),text('Xác nhận khối lượng và thi công khi báo giá','Quantity and installation confirmed with quotation')];
    summaries[id]=text(shortVi,shortEn);
  }
  // Collection-matched photographs from the Milliken Asia catalogue and brochure.
  const brochureImages={
  "moments-in-time": additions["moments-in-time"].images,
  "pattern-play": additions["pattern-play"].images,
  "retrofit": [
    "assets/products/milliken-retrofit-catalogue.jpg",
    "assets/products/milliken-retrofit-brochure-2.jpg"
  ],
  "building-blocks": [
    "assets/products/milliken-building-blocks-brochure-1.jpg",
    "assets/products/milliken-building-blocks-brochure-2.jpg"
  ],
  "natural-supply": [
    "assets/products/milliken-natural-supply-brochure-1.jpg",
    "assets/products/milliken-natural-supply-brochure-2.jpg"
  ],
  "heavy-meta": [
    "assets/products/milliken-heavy-meta-brochure-1.jpg",
    "assets/products/milliken-heavy-meta-brochure-2.jpg"
  ],
  "living-facades": [
    "assets/products/milliken-living-facades-catalogue.jpg",
    "assets/products/milliken-living-facades-brochure-2.jpg"
  ],
  "patina": [
    "assets/products/milliken-patina-brochure-1.jpg",
    "assets/products/milliken-patina-brochure-2.jpg"
  ]
};
  for(const [id,images] of Object.entries(brochureImages)){
    window.productDetails[id].images=images;
    window.productGalleryOverrides[id]={...window.productGalleryOverrides[id],images};
  }
  const imageStyle=(id)=>brochureImages[id]?'width:100%;height:100%;object-fit:cover;object-position:center 60%':'';
  const range=text('605.000–935.000 ₫/m² (đã gồm 10% VAT)','605,000–935,000 VND/m² (including 10% VAT)');
  const groupTitle=text('Lựa chọn 01','Option 01');
  const net=text('550.000–850.000 ₫/m² chưa VAT','550,000–850,000 VND/m² before VAT');
  const other=text('Khám phá thêm bộ sưu tập','Explore more collections');
  const quote=text('Liên hệ để nhận giá theo bộ sưu tập.','Contact us for collection-specific pricing.');
  text('Giải pháp sàn · Milliken','Flooring solutions · Milliken');
  const title=text('Thảm cho không gian làm việc.','Carpet for the way you work.');
  const intro=text('Khám phá kết cấu, màu sắc và bố cục. Chọn bộ sưu tập, chúng tôi sẽ hỗ trợ mẫu vật liệu và báo giá cho dự án.','Explore texture, colour and layout. Choose a collection for material samples and a project quotation.');
  const note=text('Giá tham khảo; màu, khối lượng, giao hàng và thi công được xác nhận trong báo giá.','Indicative pricing; colour, quantity, delivery and installation are confirmed in the quotation.');
  window.carpetCollection={firstGroup,summaries,imageStyle,priceText:id=>firstGroup.includes(id)?range:null,decorateGrid(filter){
    const grid=document.getElementById('productGrid');
    if(!grid)return;
    grid.classList.toggle('carpet-grid',filter==='Flooring Solutions');
    document.getElementById('carpetIntro')?.remove();
    if(filter!=='Flooring Solutions')return;
    const header=document.createElement('section');
    header.id='carpetIntro';header.className='carpet-intro';
    header.innerHTML=`<div><p class="eyebrow">MILLIKEN · CARPET COLLECTION</p><h3>${title}</h3></div><p>${intro}</p>`;
    grid.before(header);
    const first=grid.querySelector(`[data-product="${firstGroup[0]}"]`)?.closest('article');
    if(first)first.insertAdjacentHTML('beforebegin',`<div class="carpet-group"><div><h3>${groupTitle}</h3><p>${note}</p></div><div class="carpet-group-price"><strong>${range}</strong><span>${net}</span></div></div>`);
    const remaining=[...grid.querySelectorAll('article')].find(card=>!firstGroup.includes(card.querySelector('[data-product]')?.dataset.product));
    if(remaining)remaining.insertAdjacentHTML('beforebegin',`<div class="carpet-group"><div><h3>${other}</h3><p>${quote}</p></div></div>`);
  }};
  window.carpetTranslations=translations;
})();
