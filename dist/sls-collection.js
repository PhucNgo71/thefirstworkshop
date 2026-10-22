// TFW retail packages. Existing IDs stay stable for carts and order history:
// sls470 is SLS 670 PRO; the newly added 470 has its own sls-470-pro ID.
// The 1400 x 700 mm top is TFW's standard package, not a factory-size claim.
(() => {
  const size = '1400 × 700 mm';
  const members = ['sls1050', 'sls770', 'sls-470-pro', 'sls470', 'sls470bench'];
  const translations = {};
  const text = (vi, en) => { translations[vi] = en.replace(/thefirstworkshop package/g, 'TFW package'); return vi; };
  const singleSummary = text('Đã bao gồm mặt bàn 1400 × 700 mm', 'Includes a 1400 × 700 mm tabletop');
  const benchSummary = text('Đã bao gồm 02 mặt bàn 1400 × 700 mm', 'Includes two 1400 × 700 mm tabletops');
  const topLabel = text('Kích thước mặt bàn tiêu chuẩn', 'Standard tabletop size');
  const eachTopLabel = text('Kích thước mỗi mặt bàn tiêu chuẩn', 'Standard size of each tabletop');
  const topColourLabel = text('Màu mặt bàn', 'Tabletop finish');
  const frameColourLabel = text('Màu khung', 'Frame finish');
  const topName = text('Mặt bàn tiêu chuẩn', 'Standard tabletop');
  const twoTopsName = text('02 mặt bàn tiêu chuẩn', 'Two standard tabletops');
  const includedSingle = text('1400 × 700 mm · Đã bao gồm', '1400 × 700 mm · Included');
  const includedBench = text('02 × 1400 × 700 mm · Đã bao gồm', '2 × 1400 × 700 mm · Included');
  const setTitle = text('Bộ tiêu chuẩn & phụ kiện', 'Standard package & accessories');
  const setSubtitle = text('Mặt bàn đã nằm trong giá · Phụ kiện theo cấu hình', 'Tabletop included in price · Accessories depend on configuration');
  const customNote = text('Kích thước khác và phụ kiện ngoài bộ tiêu chuẩn: liên hệ báo giá.', 'Other sizes and accessories outside the standard package: request a quotation.');
  const photoNote = text('Hình ảnh tham khảo màu sắc và kiểu dáng; mặt bàn giao theo cấu hình tiêu chuẩn 1400 × 700 mm.', 'Images illustrate finishes and design; the supplied standard tabletop is 1400 × 700 mm.');
  text('Bàn nâng hạ điện hoàn chỉnh', 'Complete electric sit-stand desk');
  text('Bàn bench nâng hạ điện hoàn chỉnh', 'Complete electric sit-stand bench');
  text('Trắng', 'White'); text('Xám nhạt', 'Light grey'); text('Sồi', 'Oak');
  text('Đen', 'Black'); text('Bạc', 'Silver');
  text('mặt bàn tiêu chuẩn: 1400 × 700 mm', 'Standard tabletop: 1400 × 700 mm');
  text('mỗi mặt bàn tiêu chuẩn: 1400 × 700 mm', 'Each standard tabletop: 1400 × 700 mm');
  text('02 vị trí làm việc · Không vách ngăn', 'Two workstations · No screen');
  text('Vách ngăn trung tâm · 02 monitor arm', 'Central screen · Two monitor arms');
  text('Cấu hình', 'Configuration'); text('02 người', 'Two people');
  text('Mặt bàn', 'Tabletops'); text('02 bộ · Tiêu chuẩn', 'Two sets · Standard');
  const descriptions = {
    'sls-470-pro': text('SLS 470 PRO kết hợp khung nâng hạ điện Actiforce với mặt bàn tiêu chuẩn 1400 × 700 mm trong gói thefirstworkshop. Cột vuông 70 × 70 mm, bộ điều khiển ActiSwitch Eco-Memory và chống va chạm hỗ trợ chuyển đổi giữa tư thế ngồi và đứng.', 'SLS 470 PRO combines an Actiforce electric height-adjustable frame with the 1400 × 700 mm standard tabletop in the thefirstworkshop package. Square 70 × 70 mm columns, ActiSwitch Eco-Memory controls and anti-collision support sit-stand working.'),
    sls470: text('SLS 670 PRO là bàn nâng hạ điện Actiforce dành cho không gian làm việc chuyên nghiệp. Gói thefirstworkshop đã bao gồm mặt bàn tiêu chuẩn 1400 × 700 mm, 01 cable tray và 01 cable riser. Bộ điều khiển ActiSwitch Eco-Memory, ghi nhớ độ cao và chống va chạm hỗ trợ sử dụng hằng ngày.', 'SLS 670 PRO is an Actiforce electric sit-stand desk for professional workspaces. The thefirstworkshop package includes a standard 1400 × 700 mm tabletop, one cable tray and one cable riser. ActiSwitch Eco-Memory controls, height memory and anti-collision support everyday use.'),
    sls470bench: text('SLS 670 BENCH PRO tổ chức hai vị trí làm việc nâng hạ trên một hệ khung chung. Gói thefirstworkshop đã bao gồm 02 mặt bàn tiêu chuẩn, mỗi mặt 1400 × 700 mm, 02 cable tray và 02 cable riser. Vách ngăn, ghế và tay màn hình là phụ kiện đặt thêm.', 'SLS 670 BENCH PRO provides two height-adjustable work positions on a shared frame. The thefirstworkshop package includes two standard 1400 × 700 mm tabletops, two cable trays and two cable risers. Screens, chairs and monitor arms are additional accessories.'),
    sls770: text('SLS 770 PRO là bàn nâng hạ điện Actiforce với dải chiều cao 685–1155 mm. Gói thefirstworkshop đã bao gồm mặt bàn tiêu chuẩn 1400 × 700 mm. Thiết kế khung ổn định, vận hành điện và chống va chạm phù hợp cho trạm làm việc ngồi–đứng.', 'SLS 770 PRO is an Actiforce electric sit-stand desk with a 685–1155 mm frame-height range. The thefirstworkshop package includes a standard 1400 × 700 mm tabletop. A stable frame, electric adjustment and anti-collision suit sit-stand workstations.'),
    sls1050: text('Steelforce 1050 kết hợp khung nâng hạ điện Actiforce với mặt bàn tiêu chuẩn 1400 × 700 mm trong gói thefirstworkshop. Khung thép hỗ trợ thay đổi tư thế ngồi–đứng, có chống va chạm và bốn màu khung lựa chọn. Phụ kiện quản lý dây cáp được đặt thêm theo nhu cầu.', 'Steelforce 1050 combines an Actiforce electric height-adjustable frame with the standard 1400 × 700 mm tabletop in the thefirstworkshop package. The steel frame supports sit-stand working, anti-collision and four frame finishes. Cable-management accessories are available separately.')
  };
  const new470 = {
    imageScale:82,
    swatches:['#111312','#a7aaa8','#f4f5f3'],
    brand:'Actiforce · SLS Collection',
    productType:'Bàn nâng hạ điện hoàn chỉnh',
    specifications:'Cột nâng: 70 × 70 mm\nChiều cao khung: 615–1275 mm\nChiều rộng khung: 1100–1700 mm\nHành trình nâng: 660 mm\nTải trọng nâng động: tối đa 120 kg, tùy bộ điều khiển; bao gồm trọng lượng mặt bàn\nTruyền động: động cơ điện\nHệ chống va chạm: có\nBộ điều khiển: ActiSwitch Eco-Memory\nQuản lý dây cáp: tùy chọn',
    highlights:[text('Cột vuông 70 × 70 mm', 'Square 70 × 70 mm columns'),text('Điều chỉnh độ cao bằng điện', 'Electric height adjustment'),text('ActiSwitch Eco-Memory đi kèm', 'ActiSwitch Eco-Memory included')],
    images:[
      'assets/products/sls-470-pro-cutout.png',
      'https://actiforce.com/wp-content/uploads/2025/05/sls470_bf_st_side2-min.jpg',
      'https://actiforce.com/wp-content/uploads/2025/05/sls470_wf_wt_side-min.jpg',
      'https://actiforce.com/wp-content/uploads/2025/05/sls470_wf_ot_side-min.jpg'
    ],
    galleryModes:['contain','contain','contain','contain'],
    galleryLabels:[['SLS 470 PRO',text('Khung đen · Mặt trắng', 'Black frame · White top')],['SLS 470 PRO',text('Khung đen · Góc bên', 'Black frame · Side view')],['SLS 470 PRO',text('Khung trắng · Mặt trắng', 'White frame · White top')],['SLS 470 PRO',text('Khung trắng · Mặt sồi', 'White frame · Oak top')]],
    bundleItems:[{id:'m2pro'},{id:'freedom'},{id:'cabletray'},{id:'cableriser'}],
    sourceUrl:'https://actiforce.com/produkt/sls-470-pro-schreibtisch/'
  };
  // Translate model-specific technical lines without replacing their specifications.
  const specTerms = {
    'Khối lượng':'Weight','Khối lượng khung':'Frame weight','Kích thước khung':'Frame dimensions','Kích thước đóng gói':'Packed dimensions','Kích thước cột':'Column dimensions','Cột nâng':'Lifting columns','Chiều cao khung':'Frame height','Chiều cao điều chỉnh':'Height range','Chiều rộng khung':'Frame width','Chiều rộng điều chỉnh':'Width range','Hành trình nâng':'Travel','Tốc độ nâng':'Lifting speed','Tải trọng nâng động':'Dynamic lifting capacity','Truyền động':'Drive','Hệ chống va chạm':'Anti-collision','Ổ cắm tích hợp':'Integrated sockets','Quản lý dây cáp':'Cable management','Vật liệu':'Material','Bộ điều khiển':'Controller','Độ ồn':'Noise level','Xuất xứ sản xuất':'Manufactured in','Kích thước mặt bàn khuyến nghị':'Manufacturer-recommended tabletop size'
  };
  const specValue = value => value.replace(/tối đa/g,'up to').replace(/tùy bộ điều khiển/g,'depending on control box').replace(/bao gồm trọng lượng mặt bàn/g,'including tabletop weight').replace(/động cơ điện/g,'electric motors').replace(/tùy chọn/g,'optional').replace(/tiêu chuẩn/g,'standard').replace(/khoảng/g,'approx.').replace(/dưới/g,'below').replace(/kim loại/g,'metal').replace(/thép, nhựa và nhôm/g,'steel, plastic and aluminium').replace(/^có$/,'yes').replace(/^không$/,'none');
  window.slsListingDetails = Object.fromEntries(members.map(id=>[id,id==='sls470bench'?benchSummary:singleSummary]));
  window.slsDefaultOrderOptions = Object.fromEntries(members.map(id=>[id,id==='sls470bench'?'Includes 2 standard tabletops, each 1400 x 700 mm; finishes to be confirmed':'Includes 1 standard tabletop, 1400 x 700 mm; finishes to be confirmed']));
  window.applySlsDetails = overrides => {
    overrides['sls-470-pro'] = {...new470};
    for (const id of members) {
      const model = overrides[id];
      const bench = id==='sls470bench';
      const included = bench?benchSummary:singleSummary;
      const frameColours = model.optionGroups?.find(group=>group.label==='Màu khung')?.values || ['Đen','Bạc','Trắng'];
      model.productType = bench?'Bàn bench nâng hạ điện hoàn chỉnh':'Bàn nâng hạ điện hoàn chỉnh';
      model.description = id==='sls1050' ? text(descriptions[id].replace('Steelforce 1050','SLS 1050'), translations[descriptions[id]].replace('Steelforce 1050','SLS 1050')) : descriptions[id];
      const technical = model.specifications || '';
      const englishTechnical = technical.split('\n').map(line=>{const at=line.indexOf(':');return at<0?line:`${specTerms[line.slice(0,at)]||line.slice(0,at)}: ${specValue(line.slice(at+1).trim())}`;}).join('\n');
      const topSpec = `${bench?eachTopLabel:topLabel}: ${size}`;
      model.specifications = text(`${topSpec}\n${included}\n\n${technical}\n\n${customNote}\n${photoNote}`, `${bench?'Standard size of each tabletop':'Standard tabletop size'}: ${size}\n${translations[included]}\n\n${englishTechnical}\n\n${translations[customNote]}\n${translations[photoNote]}`);
      model.highlights = [included,...(model.highlights || []).slice(0,2)];
      model.optionGroups = [{label:bench?eachTopLabel:topLabel,values:[size]},{label:topColourLabel,values:['Trắng','Xám nhạt','Sồi']},{label:frameColourLabel,values:[...frameColours]}];
      model.setTitle = setTitle; model.setSubtitle = setSubtitle;
      model.bundleItems = [{label:bench?twoTopsName:topName,detail:bench?includedBench:includedSingle,included:true},...(model.bundleItems || [])];
      if(bench) model.gallerySpecs = model.gallerySpecs.map(([label,value])=>label==='Mặt bàn'?[label,'02 × 1400 × 700 mm']:[label,value]);
    }
  };
  text('Điều chỉnh điện êm và chính xác','Smooth, precise electric adjustment');
  text('Khung đen · Mặt sồi','Black frame · Oak top');
  text('Tải trọng nâng động 120 kg','120 kg dynamic lifting capacity');
  text('Hệ bench tiết kiệm diện tích','Space-efficient bench system');
  text('Điều chỉnh độ cao cho từng vị trí','Independent height adjustment');
  text('Dải cao 68,5–115,5 cm','68.5–115.5 cm height range');
  text('Tải trọng tối đa 120 kg','Up to 120 kg lifting capacity');
  text('Kết cấu thép ổn định','Stable steel structure');
  text('Tải trọng nâng động 100 kg','100 kg dynamic lifting capacity');
  window.slsTranslations = translations;
})();
