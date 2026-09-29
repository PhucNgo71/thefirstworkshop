// Source: Dress Collection 2026, pages 13–16. Catalog prices supplied by the client.
(() => {
  const finishes = ['Đỏ san hô', 'Trắng ngà', 'Xanh lam', 'Xanh lá đậm', 'Đen'];
  const translations = {
    'Đỏ san hô':'Coral Red', 'Trắng ngà':'Ivory White',
    'Xanh lam':'Elegant Blue', 'Xanh lá đậm':'Dark Green',
    'Ghế xoay':'Swivel chair', 'Ghế nâng hạ có tay vịn':'Height-adjustable armchair',
    'Ghế bar':'Bar stool'
  };
  const rows = [
    ['04', 'Ghế xoay',
      'Dress-4 kết hợp thiết kế thanh gọn với cơ chế xoay linh hoạt, phù hợp cho không gian làm việc, phòng họp và khu vực trao đổi. Chân bốn nhánh tạo dáng ghế nhẹ nhàng, đồng bộ với đường cong của thân ghế.',
      'Dress-4 combines a slender design with a smooth swivel mechanism for workspaces, meeting rooms and collaborative areas. Its four-star base complements the curved seat shell.',
      '525 × 465 × 825 mm', '450 mm',
      'Cơ chế: Xoay\nChân ghế: Bốn nhánh',
      'Mechanism: Swivel\nBase: Four-star'],
    ['05', 'Ghế nâng hạ có tay vịn',
      'Dress-5 là ghế điều chỉnh độ cao với tay vịn và chân bánh xe, được giới thiệu cho phòng hội nghị và không gian làm việc cộng tác. Thiết kế gọn gàng giúp dễ dàng di chuyển và điều chỉnh tư thế ngồi.',
      'Dress-5 is a height-adjustable chair with armrests and a castor base, designed for conference rooms and collaborative workspaces. Its compact design supports easy movement and seat-height adjustment.',
      '530 × 595 × 765–860 mm', '395–490 mm',
      'Cơ chế: Điều chỉnh độ cao\nChân ghế: Năm nhánh có bánh xe\nTay vịn: Có',
      'Mechanism: Height adjustment\nBase: Five-star with castors\nArmrests: Included'],
    ['06', 'Ghế bar',
      'Dress-6 là ghế bar chân khung trượt, kết hợp thân ghế cong với dáng cao thanh mảnh và thanh gác chân. Thiết kế mang phong cách hiện đại cho khu vực quầy bar và không gian gặp gỡ.',
      'Dress-6 is a sled-base bar stool combining a curved shell, a slender tall frame and a footrest. Its contemporary design suits bar areas and informal meeting spaces.',
      '504 × 465 × 1140 mm', '755 mm',
      'Chân ghế: Khung trượt cao, có thanh gác chân',
      'Base: Tall sled frame with footrest']
  ];
  for (const [number, type, vi, en, dimensions, seatHeight, featuresVi, featuresEn] of rows) {
    const specs = `Kích thước: ${dimensions}\nChiều cao mặt ngồi: ${seatHeight}\n${featuresVi}\nNguồn: Dress Collection 2026. Màu và cấu hình được xác nhận khi báo giá.`;
    translations[vi] = en;
    translations[specs] = `Dimensions: ${dimensions}\nSeat height: ${seatHeight}\n${featuresEn}\nSource: Dress Collection 2026. Colors and configuration are confirmed with the quotation.`;
    window.productDetails[`dress${number}`] = {
      brand: 'thefirstworkshop', productType: type,
      description: vi, specifications: specs, variants: finishes,
      swatches: ['#984e36', '#eeeae2', '#477685', '#345a49', '#171917'],
      images: [`assets/dress${number}-lifestyle.jpg`, `assets/dress${number}-main.png`],
      galleryModes: ['contain', 'contain'], imageScale: 90,
      sourceDocument: 'Dress Collection 2026.pdf, pages 13–16'
    };
  }
  // Original high-resolution product photos supplied by the client.
  const dressPhotos = ['green-front', 'green-rear', 'black-front', 'black-rear',
    'blue-front', 'coral-front', 'ivory-front', 'ivory-rear'];
  for (const number of ['04', '05', '06']) {
    window.productDetails[`dress${number}`].images = dressPhotos.map(view => `assets/dress${number}-${view}.jpg`);
    window.productDetails[`dress${number}`].galleryModes = dressPhotos.map(() => 'contain');
  }
  window.dressTranslations = translations;
})();
