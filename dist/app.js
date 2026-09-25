const catalogDetails={
 'Smart Pods':'Buồng làm việc cách âm',
 'Loose Furniture':'Nội thất rời cho không gian linh hoạt',
 'Storage Solutions':'Giải pháp lưu trữ văn phòng',
 'System Furniture':'Nội thất hệ thống cho văn phòng',
 'Seatings':'Ghế công thái học và ghế tác vụ',
 'Monitor Arm & Docking':'Tay màn hình và giải pháp kết nối',
 'Glass Partition':'Hệ vách kính văn phòng',
 'Milliken Flooring':'Thảm tấm · Milliken',
 'Acoustic Wall Panel':'Tấm tiêu âm · Acoufelt',
 'Accessories':'Phụ kiện không gian làm việc'
};
const catalogEntries=[
 ['framery-one-compact','FRAMERY ONE COMPACT','Smart Pods',0,'https://framery.com/wp-content/uploads/2025/11/framery-one-compact-white-1.webp','framery-one-compact'],
 ['framery-one-premium','FRAMERY ONE','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/framery-one-white-1.webp','framery-one'],
 ['framery-four','FRAMERY FOUR','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/four-white-1.png','framery-four'],
 ['framery-six','FRAMERY SIX','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/framery-six-white.png','framery-six','Mới'],
 ['spod3','S POD 3.0 PLUS','Smart Pods',220000000,'https://winpodacoustics.com/wp-content/uploads/2026/06/S-Pod-3.0-Plus_White_Certification-1-1024x1024.avif','s-pod-3-0-plus-series','Mới'],
 ['wpod3','W POD 3.0 PLUS','Smart Pods',295000000,'https://winpodacoustics.com/wp-content/uploads/2026/06/W-Pod-3.0-Plus_Middle_Logo-1024x1024.avif','w-pod-3-0-plus-series'],
 ['dpod3','D POD 3.0 PLUS','Smart Pods',346700000,'https://winpodacoustics.com/wp-content/uploads/2026/06/D-Pod-3.0-Plus_Logo-1024x1024.avif','d-pod3-0-plus-series'],
 ['parco','Parco Series','Loose Furniture',19500000,'https://cdn.hstatic.net/products/200000617147/single_semi_pod_03_1b0a0bd782cb4023a5ed976e60f0e7ad_large.jpg','parco-series'],
 ['easychair','Easy Chair','Loose Furniture',3300000,'https://cdn.hstatic.net/products/200000617147/6_19__171b6d7811424588bb4a02ab3c7a6a4e_large.png','easy-chair'],
 ['maris','MARIS HIGH BACK SOFA','Loose Furniture',35000000,'https://cdn.hstatic.net/products/200000617147/22_5ebaa9b15be546f094c209d6deb7ccbe_large.png','maris-high-back-sofa'],
 ['noah800','NOAH 800 CAFE TABLE','Loose Furniture',10000000,'https://cdn.hstatic.net/products/200000617147/18_09c5dc9236c046969ec4dec7891f1475_large.png','noah-800-cafe-table'],
 ['turtle','TURTLE POUF','Loose Furniture',6000000,'https://cdn.hstatic.net/products/200000617147/13_1__7419697da1074cc0b196268a78139fab_large.png','turtle-pouf'],
 ['john','JOHN HIGH BACK SOFA','Loose Furniture',38000000,'https://cdn.hstatic.net/products/200000617147/9_2__39f531986d574275b915cfc7d3e26052_large.png','high-back-sofa'],
 ['swing','Swing Chair','Loose Furniture',16100000,'https://cdn.hstatic.net/products/200000617147/6_1__04cb884dcd674f318125a0e175871829_large.png','swing-chair'],
 ['jac','JAC Stool','Loose Furniture',0,'https://product.hstatic.net/200000617147/product/15_48e16d292b364ad9bc48721b089f9c3f_large.png','jac-stool'],
 ['occo','OCCO Chair','Loose Furniture',0,'https://product.hstatic.net/200000617147/product/5_3ec632a26e6546588fbee76c047bf393_large.png','occo-chair'],
 ['dress01','Dress-01','Loose Furniture',3300000,'https://product.hstatic.net/200000617147/product/7_2a5d96644f28497f9db29bb855675fa2_large.png','dress-01'],
 ['repo','REPO Pedestal','Storage Solutions',3500000,'https://cdn.hstatic.net/products/200000617147/1_2__708824e55ad84f00a73fe2a27a023ce5_large.png','repo-pedestal'],
 ['repo-tambour','REPO tambour','Storage Solutions',7700000,'https://cdn.hstatic.net/products/200000617147/2_1__7d76c51930304449acbf8a64137b77de_large.png','repo-tambour-2'],
 ['cableriser','Cable Riser / Sâu Điện','System Furniture',350000,'https://cdn.hstatic.net/products/200000617147/s_u_di_n_02_549028b7c34f435e8bf1b74e80308255_large.png','cable-riser-sau-dien'],
 ['cabletray','Cable Tray / Máng Điện','System Furniture',650000,'https://cdn.hstatic.net/products/200000617147/chatgpt_image_jul_20__2026__03_54_08_pm__2__3c3fc56466424e98a2f1a320411e0633_large.png','cable-tray-mang-dien'],
 ['meeting','Meeting Table Genese / Bàn Họp','System Furniture',56000000,'https://cdn.hstatic.net/products/200000617147/3_15__e297a1b72ee540baa111378536937a96_large.png','genese'],
 ['q20','Q20 / Holmris B8','System Furniture',24000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__9__2997fc9d0f154984b928b58494b2169b_large.png','q20-recrafted'],
 ['sls1050','Steelforce 1050 - thefirstworkshop','System Furniture',12000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__9__e499c03a86e54e6fbbdb07389ea82904_large.png','steelforce-1050-tfw'],
 ['sls770','SLS 770 PRO','System Furniture',13000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__8__526e52550344473690b6add29e3cb468_large.png','sls-770-pro-tfw','Nổi bật'],
 ['quantum','QUANTUM workstation','System Furniture',8500000,'https://cdn.hstatic.net/products/200000617147/24_2ab876c8cd7a4cd3826ec390e2983c1c_large.png','quantum-workstation'],
 ['sls470bench','SLS 670 BENCH PRO','System Furniture',30000000,'https://product.hstatic.net/200000617147/product/sls_670_bench_bf_oakt_1-scaled_04915ccfe2fb41e489d8307259fdeb73_large.jpg','sls-670-pro-bench'],
 ['sls470','SLS 670 PRO','System Furniture',15000000,'https://product.hstatic.net/200000617147/product/54_f198c19fea50400da9c0fe84500fbe1a_large.png','sls-470-pro','Bán chạy'],
 ['at-chair','AT Chair / Wilkhahn','Seatings',36980000,'https://product.hstatic.net/200000617147/product/fixed_1_4x-100_3b907028760740b9bed4f27bc11e9f8e_large.jpg','at-chair'],
 ['freedom','Freedom Chair / Humanscale','Seatings',36600000,'https://product.hstatic.net/200000617147/product/1_4x-100_e5507a410b524b5aa48fafeff583e49d_large.jpg','freedom-chair'],
 ['smart-chair','Smart Chair / Humanscale','Seatings',33000000,'https://product.hstatic.net/200000617147/product/them_tieu_de__1__4be2295487f44317b743d75a04b7e852_large.png','smart-chair'],
 ['liberty','Liberty Chair / Humanscale','Seatings',29650000,'https://product.hstatic.net/200000617147/product/them_tieu_de__4__78523b997f3d4b338711a8e2f27dd5c4_large.png','liberty-chair'],
 ['world-chair','World Chair / Humanscale','Seatings',24200000,'https://product.hstatic.net/200000617147/product/them_tieu_de__5__84703126540d43baa309fc75707080e9_large.png','world-chair'],
 ['worldone','World One Chair / Humanscale','Seatings',13500000,'https://product.hstatic.net/200000617147/product/hs-seating-world-one-1_d9c1729bdd57475eb0459c2d2c314f17_large.jpg','world-one-chair'],
 ['vox','Vox Chair / Zenith','Seatings',11500000,'https://product.hstatic.net/200000617147/product/15_db98a04259924bc787047b7707ac52d5_large.png','vox-chair'],
 ['k10m','K10M Chair / Krede','Seatings',9890000,'https://product.hstatic.net/200000617147/product/1_4x-100_87b1380d1aae4a31b50fde8be1af8316_large.jpg','k10m-chair'],
 ['khyn','Khyn Chair / Zenith','Seatings',9700000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__28__b031c543111e43e6862b5b1ac894b6dc_large.png','khyn-chair'],
 ['tori','Tori / Flokk','Seatings',8500000,'https://cdn.hstatic.net/products/200000617147/6_1__2010bc0bd11349439171e814c6546630_large.png','tori'],
 ['ae5','AE5-FF100','Monitor Arm & Docking',2200000,'https://cdn.hstatic.net/products/200000617147/ae5-5_ad788b5f33704e3084cc3e2a1b8e05b8_large.png','ae5-100'],
 ['ct206','CT 206','Monitor Arm & Docking',5500000,'https://cdn.hstatic.net/products/200000617147/image_2025-08-25_144515_441_db419cce294f42dcb0d89b1bf861ea68_large.png','ct-206'],
 ['mconnect3','M/Connect 3','Monitor Arm & Docking',21000000,'https://product.hstatic.net/200000617147/product/mc3_environmental_6734634215824594bc15054d4c9d7dec_large.jpg','m-connect-3'],
 ['m2pro','M2 Pro','Monitor Arm & Docking',6900000,'https://product.hstatic.net/200000617147/product/6_4x-100_08ae60e989204f02be2cfd6cd012dd7e_large.jpg','monitor-arm-m21'],
 ['m8pro','M8 Pro','Monitor Arm & Docking',18000000,'https://product.hstatic.net/200000617147/product/m81_learnpage_3_f222591c3cd7473e89a1e88c3804ae22_large.jpg','m8-1-dual'],
 ['mflex','MFlex','Monitor Arm & Docking',15900000,'https://product.hstatic.net/200000617147/product/mflex_2_m2.1_3_654c4e8f2d864a8390954a03d26e1127_large.jpg','m-flex'],
 ['focus','Focus','Glass Partition',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__21__2618102383c544b5bb9cdbad63f8d820_large.png','nhan-ban-tu-telescope'],
 ['teknion-pod','Teknion POD','Glass Partition',0,'https://cdn.hstatic.net/products/200000617147/1_12__0c2382838dd246b98af0e5bb49982b7e_large.png','teknion-pod'],
 ['telescope','Telescope','Glass Partition',0,'https://product.hstatic.net/200000617147/product/website_ergogen__9__5c53d91c9b734c75a0c24d45d89f6e6a_large.png','telescope'],
 ['within','WITHIN','Glass Partition',0,'https://product.hstatic.net/200000617147/product/website_ergogen__10__bd76f8a6b8b34ed389f6a6fb14a87244_large.png','within'],
 ['airborn','Air Born Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__12__7a69f706885247cdbc5d4aea50314fa4_large.png','air-born-collection'],
 ['building-blocks','Building Blocks 2.0 Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__13__14f1b24192134cc5ab44ab138728ccd2_large.png','building-blocks-2-0-collection'],
 ['cornerstone','Cornerstone Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_4__dcf3054e2f8048ec8779e3dce3c10a39_large.png','cornerstone-collection'],
 ['heavy-meta','Heavy Meta Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_9__513895adddf54eab84960b5272abe294_large.png','heavy-meta-collection'],
 ['living-facades','Living Facades Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_11__5b4d99cd0f0e447ca5eb11780756ff43_large.png','living-facades-collection'],
 ['natural-supply','Natural Supply Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_5__7f4db3535b3e48dbbbec87807ea23ede_large.png','natural-supply-collection'],
 ['on-the-track','On The Track Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_3__abba627021d24d81999d342581252dbe_large.png','on-the-track-collection'],
 ['patina','Patina Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_2__e44236a9cc25443b8beff032565fa216_large.png','patina-collection'],
 ['retrofit','Retrofit Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__10__6daea0acf8fb4baca08c60c391a7865d_large.png','retrofit-collection'],
 ['ripple-effect','Ripple Effect Collection','Milliken Flooring',0,'https://cdn.hstatic.net/products/200000617147/1_10__2905235d47bb4247bab00bfe9add82da_large.png','ripple-effect-collection'],
 ['fracture','Fracture Two-Tone','Acoustic Wall Panel',0,'https://product.hstatic.net/200000617147/product/acoufelt-n-w-panels-fracture-two-tone-shard-talc-amaryllis1_f9cfb5b1c7d2485dbdae56111a9ac4fe_large.jpg','fracture-two-tone'],
 ['pixel','Pixel','Acoustic Wall Panel',0,'https://product.hstatic.net/200000617147/product/acoufelt-n-w-panel-pixel-rectangle-limestone-balsam1_1d60d0cb353f477485d57b609496f858_large.jpg','pixel'],
 ['athena','Athena','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_8__506b7ec19007435ebe0c75447d52b5b1_large.png','athena'],
 ['centra','Centra','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_16__98fc1ba57c2347c7844420c9e490b103_large.png','centra'],
 ['ck06','CK06','Accessories',3500000,'https://cdn.hstatic.net/products/200000617147/4_2__7d5c69dcdebc43ef9bca4e6f4209b081_large.png','ck06'],
 ['freedom-usb','Freedom Portable USB Charger','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_15__595a408358bf47489d32d0afacd3620e_large.png','freedom-portable-usb-charger'],
 ['nova-viva','Nova & Viva','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_9__d3e35596876f4196a948cb65495754bf_large.png','nova-viva'],
 ['nw-series','NW Series','Accessories',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__6__fe7663fd00f647e7973792bccc11533c_large.png','nw'],
 ['odyssey','Odyssey','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_10__0f2ded2434c94cf6aa5e7f473b94de9c_large.png','odyssey'],
 ['sw-series','SW Series','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_5__6c7fc71c2e0a48f0b5f274480b5507e6_large.png','sw'],
 ['zeus','Zeus','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_11__a6f0e40081ad4418a4b9669c5d4783dd_large.png','zeus']
];
const products=catalogEntries.map(([id,name,scope,price,image,handle,badge])=>({id,name,category:scope,scope,price,image,badge,contactOnly:price===0,detail:catalogDetails[scope],sourceUrl:`https://tfw.space/products/${handle}`,swatches:['#111312','#f4f5f3','#8b8f8c']}));
const productLineProfiles={
 'Smart Pods':76,'Loose Furniture':84,'Storage Solutions':80,'System Furniture':86,'Seatings':80,
 'Monitor Arm & Docking':76,'Glass Partition':84,'Milliken Flooring':92,'Acoustic Wall Panel':88,'Accessories':74
};
const productLineSlug=value=>value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const podReference={optionGroups:[{label:'Màu hoàn thiện tham khảo',values:['Beige','Grey','Green','Blue','Cloud','Yellow','Navy']}],referenceUrl:'https://musepod.us/products/musepod-mp-series'};
const wpodExperience={
 optionGroups:[{label:'Màu hoàn thiện tham khảo',values:['Light','Dark','Beige','Grey','Green','Blue','Navy']}],
 referenceUrl:'https://room.com/shop/phone-booth/',
 highlights:['Không gian làm việc riêng tư','Cắm điện và sử dụng','Linh hoạt trong văn phòng'],
 experience:{
  eyebrow:'RIÊNG TƯ TRONG KHÔNG GIAN MỞ',
  title:'Một văn phòng thu nhỏ, sẵn sàng khi bạn cần.',
  copy:'WPOD 3.0 tạo một không gian yên tĩnh và thoải mái cho công việc tập trung, cuộc gọi video hoặc những phiên làm việc kéo dài — mà không cần cải tạo mặt bằng.',
  featureTitle:'Mọi thứ cần thiết, tích hợp gọn trong một không gian.',
  features:[
   ['Cách âm riêng tư','Giảm tác động của tiếng ồn xung quanh để bạn tập trung và trò chuyện thoải mái hơn.'],
   ['Không gian rộng rãi','Kích thước W140 × D125 × H218 cm phù hợp cho một người làm việc trong thời gian dài.'],
   ['Cảm biến thông minh','Đèn cảm biến hỗ trợ vận hành thuận tiện và tiết kiệm năng lượng.'],
   ['Thông gió chủ động','Quạt thông gió tích hợp duy trì luồng không khí trong suốt phiên làm việc.'],
   ['Nguồn điện & USB','Ổ điện và cổng USB được tích hợp để thiết bị luôn sẵn sàng.'],
   ['Ánh sáng điều chỉnh','Cường độ chiếu sáng có thể tăng giảm để phù hợp với từng tác vụ.']
  ]
 }
};
const manufacturerOverrides={
 wpod3:{experience:wpodExperience.experience},
 sls470:{
  imageScale:82,
  swatches:['#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce · SLS Collection',productType:'Bàn nâng hạ điện hoàn chỉnh',
  description:'SLS 670 PRO là bàn nâng hạ điện hoàn chỉnh dành cho không gian làm việc chuyên nghiệp, đã bao gồm mặt bàn Actiforce. Kết cấu thép ổn định, vận hành êm và điều chỉnh độ cao liên tục giúp chuyển đổi linh hoạt giữa tư thế ngồi và đứng. Bộ điều khiển ActiSwitch Eco-Memory, chức năng ghi nhớ độ cao, chống va chạm và tùy chọn quản lý dây cáp tạo nên một trạm làm việc gọn gàng, an toàn và dễ sử dụng.',
  specifications:'Khối lượng: 31 kg\nKích thước khung: 110 × 75 × 61 cm\nKích thước cột: 6 × 9 cm\nChiều cao điều chỉnh: 61,5–127,5 cm\nChiều rộng điều chỉnh: 110–170 cm\nHành trình nâng: 66 cm\nTốc độ nâng: 39 mm/s\nTải trọng nâng động: 120 kg\nTruyền động: động cơ điện\nHệ chống va chạm: có\nỔ cắm tích hợp: không\nQuản lý dây cáp: tùy chọn\nVật liệu: kim loại\nBộ điều khiển: ActiSwitch Eco-Memory',
  highlights:['Điều chỉnh điện êm và chính xác','Tải trọng nâng động 120 kg','ActiSwitch Eco-Memory đi kèm'],
  optionGroups:[{label:'Kích thước mặt bàn',values:['1600 × 800 × 25 mm','1800 × 800 × 25 mm','2000 × 800 × 25 mm']},{label:'Màu mặt bàn',values:['Trắng','Xám nhạt','Sồi']},{label:'Màu khung',values:['Đen','Bạc','Trắng']}],
  bundleItems:[{id:'m2pro'},{id:'freedom'},{id:'cabletray'},{id:'cableriser'}],
  sourceUrl:'https://actiforce.com/en/produkt/sls-670-pro-table-frame/'
 },
 sls470bench:{
  imageScale:90,
  swatches:['#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce · SLS Collection',productType:'Bàn bench nâng hạ điện hoàn chỉnh',
  description:'SLS 670 Bench PRO là hệ bàn đôi nâng hạ điện hoàn chỉnh dành cho văn phòng hiện đại và không gian coworking, đã bao gồm hai mặt bàn Actiforce. Hai vị trí làm việc được tổ chức trên một kết cấu chung để tiết kiệm diện tích, trong khi mỗi người dùng vẫn có thể điều chỉnh độ cao phù hợp với tư thế ngồi hoặc đứng. Kết cấu thép chắc chắn, chống va chạm và bộ điều khiển ActiSwitch Eco-Memory hỗ trợ vận hành an toàn, linh hoạt.',
  specifications:'Khối lượng: 70 kg\nKích thước khung: 110 × 140 × 61 cm\nKích thước cột: 6 × 9 cm\nTải trọng nâng động: 120 kg\nTruyền động: động cơ điện\nHệ chống va chạm: có\nỔ cắm tích hợp: không\nQuản lý dây cáp: tùy chọn\nVật liệu: kim loại\nBộ điều khiển: ActiSwitch Eco-Memory',
  highlights:['Hệ bench tiết kiệm diện tích','Điều chỉnh độ cao cho từng vị trí','Tải trọng nâng động 120 kg'],
  optionGroups:[{label:'Kích thước mỗi mặt bàn',values:['1600 × 800 × 25 mm','1800 × 800 × 25 mm','2000 × 800 × 25 mm']},{label:'Màu mặt bàn',values:['Trắng','Xám nhạt','Sồi']},{label:'Màu khung',values:['Đen','Bạc','Trắng']}],
  bundleItems:[
   {label:'Vách ngăn bàn',detail:'Vách ngăn trung tâm cho bàn bench',contact:true},
   {id:'m2pro'},{id:'freedom'},{id:'cabletray'},{id:'cableriser'}
  ],
  sourceUrl:'https://actiforce.com/en/produkt/sls-670-bench-pro-table-frame/'
 },
 sls770:{
  imageScale:86,
  swatches:['#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce · SLS Collection',productType:'Bàn nâng hạ điện hoàn chỉnh',
  description:'SLS 770 PRO là bàn nâng hạ điện hoàn chỉnh đã bao gồm mặt bàn Actiforce, phù hợp cho trạm làm việc công thái học có dải chiều cao tiêu chuẩn. Khung thép ổn định, vận hành điện êm và có chống va chạm, cho phép người dùng thay đổi tư thế làm việc thuận tiện trong ngày. Ba kích thước mặt bàn tiêu chuẩn đáp ứng nhiều diện tích làm việc văn phòng.',
  specifications:'Khối lượng khung: khoảng 27 kg\nChiều cao điều chỉnh: 68,5–115,5 cm\nChiều rộng điều chỉnh: 110–170 cm\nKích thước mặt bàn khuyến nghị: 120–200 × 80 cm\nHành trình nâng: 47 cm\nTốc độ nâng: khoảng 39 mm/s\nTải trọng nâng động: tối đa 120 kg, tùy bộ điều khiển\nĐộ ồn: dưới 50 dB(A)\nTruyền động: động cơ điện\nHệ chống va chạm: có\nVật liệu: thép, nhựa và nhôm\nXuất xứ sản xuất: Malaysia',
  highlights:['Dải cao 68,5–115,5 cm','Tải trọng tối đa 120 kg','Vận hành dưới 50 dB(A)'],
  optionGroups:[{label:'Kích thước mặt bàn',values:['1600 × 800 × 25 mm','1800 × 800 × 25 mm','2000 × 800 × 25 mm']},{label:'Màu mặt bàn',values:['Trắng','Xám nhạt','Sồi']},{label:'Màu khung',values:['Đen','Bạc','Trắng']}],
  bundleItems:[{id:'m2pro'},{id:'freedom'},{id:'cabletray'},{id:'cableriser'}],
  sourceUrl:'https://actiforce.com/wp-content/uploads/2023/11/P_ACTIFORC_SLS_SLS770PRO___Manual.pdf'
 },
 sls1050:{
  imageScale:80,
  swatches:['#434744','#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce',productType:'Khung bàn nâng hạ điện',
  description:'Steelforce 1050 là khung bàn nâng hạ điện bằng thép, được thiết kế cho độ ổn định và độ bền trong môi trường làm việc hằng ngày. Thiết kế tối giản có thể kết hợp với nhiều loại mặt bàn, hỗ trợ chuyển đổi linh hoạt giữa tư thế ngồi và đứng, đồng thời tích hợp chống va chạm và tùy chọn quản lý dây cáp.',
  specifications:'Khối lượng: 26 kg\nKích thước đóng gói: 76 × 26 × 19,5 cm\nKích thước cột: 8 × 5 cm\nChiều cao điều chỉnh: 61,5–122,5 cm\nChiều rộng điều chỉnh: 115–175 cm\nTốc độ nâng: 40 mm/s\nTải trọng nâng động: 100 kg\nĐộ ồn: khoảng 45 dB(A)\nTruyền động: động cơ điện\nHệ chống va chạm: có\nỔ cắm tích hợp: không\nQuản lý dây cáp: tùy chọn\nVật liệu: kim loại',
  highlights:['Kết cấu thép ổn định','Tải trọng nâng động 100 kg','Bốn màu khung lựa chọn'],
  optionGroups:[{label:'Màu khung',values:['Anthracite','Đen','Bạc','Trắng']}],
  bundleItems:[{id:'m2pro'},{id:'freedom'},{id:'cabletray'},{id:'cableriser'}],
  sourceUrl:'https://actiforce.com/en/produkt/steelforce-1050-table-frame/'
 }
};
let cart=JSON.parse(localStorage.getItem('tfw-demo-cart')||'{}');let activeFilter='all';let activeSort='featured';
const money=n=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
const priceText=p=>p.contactOnly?'Liên hệ':money(p.price);
const productImageScale=product=>manufacturerOverrides[product.id]?.imageScale||window.productDetails?.[product.id]?.imageScale||productLineProfiles[product.scope]||84;
const productSwatches=product=>manufacturerOverrides[product.id]?.swatches||window.productDetails?.[product.id]?.swatches||product.swatches;
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function renderProducts(filter=activeFilter){activeFilter=filter;let list=filter==='all'?[...products]:products.filter(p=>p.scope===filter||p.category===filter);if(activeSort==='low')list.sort((a,b)=>(a.contactOnly?Number.MAX_SAFE_INTEGER:a.price)-(b.contactOnly?Number.MAX_SAFE_INTEGER:b.price));if(activeSort==='high')list.sort((a,b)=>b.price-a.price);$('#productCount').textContent=`${list.length} sản phẩm`;$('#productGrid').innerHTML=list.map(p=>`<article class="product-card" data-product-line="${productLineSlug(p.scope)}" style="--product-image-scale:${productImageScale(p)}%"><div class="product-visual">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}<button class="product-image-button" data-product="${p.id}" type="button" aria-label="Xem chi tiết ${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy"></button><button class="quick-add" ${p.contactOnly?`data-contact="${p.id}"`:`data-add="${p.id}"`} type="button" aria-label="${p.contactOnly?'Liên hệ tư vấn':'Thêm '+p.name+' vào giỏ'}">${p.contactOnly?'↗':'＋'}</button></div><div class="product-meta"><div class="product-copy"><button class="product-title" data-product="${p.id}" type="button">${p.name}</button><span class="product-price">${priceText(p)}</span><p>${p.detail}</p><div class="swatches" aria-label="Màu hoàn thiện">${productSwatches(p).map(color=>`<span style="--swatch:${color}"></span>`).join('')}</div></div><button class="add-button" ${p.contactOnly?`data-contact="${p.id}"`:`data-add="${p.id}"`} type="button">${p.contactOnly?'Liên hệ tư vấn ↗':'Thêm vào giỏ <span>＋</span>'}</button></div></article>`).join('');$$('[data-add]').forEach(b=>b.onclick=()=>addToCart(b.dataset.add));$$('[data-contact]').forEach(b=>b.onclick=()=>requestQuote(b.dataset.contact));$$('[data-product]').forEach(b=>b.onclick=()=>openProductDetail(b.dataset.product));window.applyI18n?.();}
function saveCart(){localStorage.setItem('tfw-demo-cart',JSON.stringify(cart));renderCart();}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();showToast('Đã thêm vào giỏ hàng');}
function requestQuote(id){const product=products.find(p=>p.id===id);if(!product)return;location.href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Tư vấn sản phẩm '+product.name)}`;}
function cartData(){return products.filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]}));}
function total(){return cartData().reduce((s,p)=>s+p.price*p.qty,0)}
function renderCart(){const data=cartData();$('#cartCount').textContent=data.reduce((s,p)=>s+p.qty,0);$('#cartSubtotal').textContent=money(total());$('#cartItems').innerHTML=data.length?data.map(p=>`<article class="cart-line"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-minus="${p.id}" aria-label="Giảm ${p.name}">−</button><span>${p.qty}</span><button data-plus="${p.id}" aria-label="Tăng ${p.name}">+</button></div></div><strong>${money(p.price*p.qty)}</strong></article>`).join(''):'<div class="empty-cart"><p>Giỏ hàng đang trống.</p><a class="arrow-link" href="#shop" id="emptyShopLink">Khám phá sản phẩm →</a></div>';$$('[data-minus]').forEach(b=>b.onclick=()=>{cart[b.dataset.minus]--;if(cart[b.dataset.minus]<=0)delete cart[b.dataset.minus];saveCart()});$$('[data-plus]').forEach(b=>b.onclick=()=>{cart[b.dataset.plus]++;saveCart()});$('#checkoutButton').disabled=!data.length;window.applyI18n?.();}
function openCart(){renderCart();$('#overlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>$('#closeCart').focus(),50)}
function closeCart(){ $('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').hidden=true;document.body.style.overflow='';}
function openCheckout(){if(!cartData().length)return;closeCart();const data=cartData();$('#checkoutItems').innerHTML=data.map(p=>`<article class="checkout-line"><div><h3>${p.name} × ${p.qty}</h3><p>${p.detail}</p></div><strong>${money(p.price*p.qty)}</strong></article>`).join('');$('#summaryTotal').textContent=$('#checkoutTotal').textContent=money(total());$('#checkout').classList.add('open');$('#checkout').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';window.applyI18n?.();setTimeout(()=>$('#closeCheckout').focus(),50)}
function closeCheckout(){ $('#checkout').classList.remove('open');$('#checkout').setAttribute('aria-hidden','true');document.body.style.overflow='';}
let activeProductId=null;
function openProductDetail(id){
 const product=products.find(p=>p.id===id);if(!product)return;
 const source={...(window.productDetails?.[id]||{}),...(manufacturerOverrides[id]||{})};const gallery=source.images?.length?source.images.slice(0,8):[product.image];const galleryCells=gallery.length>1&&gallery.length<8?[...gallery,...gallery.slice(1,1+(8-gallery.length))]:gallery;const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 activeProductId=id;$('#detailTitle').textContent=product.name;$('#detailPrice').textContent=priceText(product);$('#detailAddButton').innerHTML=product.contactOnly?'Liên hệ tư vấn ↗':`Thêm vào giỏ · <span id="detailAddPrice">${money(product.price)}</span>`;$('#detailBadge').textContent=product.badge||product.scope||'thefirstworkshop';const origin=source.specifications?.match(/Xuất xứ thương hiệu:\s*([^\n]+)/i)?.[1]?.trim();$('#detailOrigin').textContent=origin||'TFW SELECTED';
 $('#detailHighlights').innerHTML=(source.highlights||[]).map(item=>`<li>${safe(item)}</li>`).join('');$('#detailHighlights').hidden=!source.highlights?.length;
 $('#detailGallery').style.setProperty('--detail-image-scale',`${Math.min(92,source.imageScale||productImageScale(product)+2)}%`);$('#detailGallery').innerHTML=galleryCells.map((image,index)=>`<figure class="detail-image${index===0?' primary':''}${index>=gallery.length?' closeup':''}"><img src="${image}" alt="${index===0?product.name:index>=gallery.length?`${product.name} · chi tiết ${index-gallery.length+1}`:`${product.name} · ${index+1}`}" loading="${index===0?'eager':'lazy'}"></figure>`).join('');
 const allInfo=`${source.specifications||''}\n${source.description||''}`;const dimension=allInfo.split(/\n+/).find(line=>/kích thước|dimension/i.test(line));const facts=[['Thương hiệu',source.brand],['Dòng sản phẩm',source.productType||product.scope],['Kích thước',dimension?.replace(/^.*?(kích thước|dimension)\s*:?\s*/i,'')]].filter(([,value])=>value);
 $('#detailFacts').innerHTML=facts.map(([label,value])=>`<div><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('');
 $('#detailDescription').textContent=source.description||product.detail;$('#detailSpecifications').textContent=source.specifications||'Thông số chi tiết được xác nhận theo cấu hình và báo giá.';$('#specificationsPanel').hidden=false;
 const variants=(source.variants||[]).filter(Boolean);const optionGroups=source.optionGroups||((variants.length)?[{label:'Tùy chọn sản phẩm',values:variants}]:[]);$('#productOptions').innerHTML=optionGroups.map((group,groupIndex)=>`<div class="config-group"><div class="config-heading"><span>${safe(group.label)}</span><strong data-option-selection="${groupIndex}">${safe(group.values[0]||'')}</strong></div><div class="choice-grid detail-variants" data-option-group="${groupIndex}">${group.values.map((value,index)=>`<button class="${index===0?'selected':''}" type="button" data-option-value="${safe(value)}">${safe(value)}</button>`).join('')}</div></div>`).join('');$$('[data-option-group] button').forEach(button=>button.onclick=()=>{const group=button.closest('[data-option-group]');$$('[data-option-group="'+group.dataset.optionGroup+'"] button').forEach(x=>x.classList.remove('selected'));button.classList.add('selected');$('[data-option-selection="'+group.dataset.optionGroup+'"]').textContent=button.dataset.optionValue});
 const bundleItems=(source.bundleItems||[]).map(item=>item.id?{...item,product:products.find(candidate=>candidate.id===item.id)}:item).filter(item=>!item.id||item.product);$('#detailAddons').hidden=!bundleItems.length;$('#detailAddonGrid').innerHTML=bundleItems.map(item=>{const addon=item.product;const label=addon?.name||item.label;const detail=addon?(addon.contactOnly?'Liên hệ':money(addon.price)):item.detail;return `<article class="detail-addon-card">${addon?`<img src="${addon.image}" alt="${safe(label)}" loading="lazy">`:`<div class="detail-addon-placeholder">SCREEN</div>`}<div><strong>${safe(label)}</strong><span>${safe(detail||'')}</span></div><button type="button" ${addon&&!addon.contactOnly?`data-bundle-add="${addon.id}"`:`data-bundle-contact="${addon?.id||''}" data-bundle-label="${safe(label)}"`} aria-label="Thêm ${safe(label)}">${addon&&!addon.contactOnly?'＋':'↗'}</button></article>`}).join('');$$('[data-bundle-add]').forEach(button=>button.onclick=()=>addToCart(button.dataset.bundleAdd));$$('[data-bundle-contact]').forEach(button=>button.onclick=()=>{const addonId=button.dataset.bundleContact;if(addonId)return requestQuote(addonId);location.href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Tư vấn '+button.dataset.bundleLabel+' cho '+product.name)}`});
 const experience=source.experience;$('#detailExperience').hidden=!experience;if(experience){$('#experienceEyebrow').textContent=experience.eyebrow;$('#experienceTitle').textContent=experience.title;$('#experienceCopy').textContent=experience.copy;$('#experienceImage').src=gallery[1]||gallery[0];$('#experienceImage').alt=`${product.name} · không gian sử dụng`;$('#featureTitle').textContent=experience.featureTitle;$('#featureGrid').innerHTML=experience.features.map(([title,copy],index)=>`<article class="pod-feature"><span>${String(index+1).padStart(2,'0')}</span><h4>${safe(title)}</h4><p>${safe(copy)}</p></article>`).join('')}
 $('#productDetail').classList.add('open');$('#productDetail').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';location.hash=`product-${id}`;window.applyI18n?.();setTimeout(()=>$('#closeProductDetail').focus(),40)
}
function closeProductDetail(){activeProductId=null;$('#productDetail').classList.remove('open');$('#productDetail').setAttribute('aria-hidden','true');document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search+'#shop')}
function showToast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1800)}
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter)});$$('[data-filter-link]').forEach(a=>a.onclick=()=>{const filter=a.dataset.filterLink;const b=$(`.filter[data-filter="${filter}"]`);if(b)b.click();else{$$('.filter').forEach(x=>x.classList.remove('active'));renderProducts(filter)}});
$$('[data-hotspot]').forEach(button=>button.onclick=()=>openProductDetail(button.dataset.hotspot));
$('#sortProducts').onchange=e=>{activeSort=e.target.value;renderProducts()};$('#readMoreButton').onclick=()=>{const expanded=$('#expandedIntro');expanded.hidden=!expanded.hidden;$('#readMoreButton').textContent=expanded.hidden?'Đọc thêm':'Thu gọn'};
$('#cartButton').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=closeCart;$('#checkoutButton').onclick=openCheckout;$('#closeCheckout').onclick=closeCheckout;
$('#closeProductDetail').onclick=closeProductDetail;$('#detailAddButton').onclick=()=>{if(!activeProductId)return;const product=products.find(p=>p.id===activeProductId);product?.contactOnly?requestQuote(product.id):addToCart(activeProductId)};$('#detailLangToggle').onclick=()=>$('#langToggle').click();
$('.detail-brand').onclick=closeProductDetail;
$('#paymentForm').onchange=e=>{if(e.target.name==='payment'){const card=e.target.value==='card';$('#cardFields').hidden=!card;$$('#cardFields input').forEach(i=>i.required=card)}};
$('#paymentForm').onsubmit=e=>{e.preventDefault();$('#paymentForm').hidden=true;$('#successState').hidden=false;$('#orderNumber').textContent='TFW-'+Math.floor(100000+Math.random()*900000);cart={};saveCart()};
$('#continueShopping').onclick=()=>{closeCheckout();$('#paymentForm').reset();$('#paymentForm').hidden=false;$('#successState').hidden=true;location.hash='shop'};
function renderSearch(q=''){const v=q.trim().toLowerCase();const list=v?products.filter(p=>(p.name+' '+p.category+' '+p.scope+' '+p.detail).toLowerCase().includes(v)):products.slice(0,3);$('#searchResults').innerHTML=list.map(p=>`<button class="search-result" data-search-product="${p.id}"><strong>${p.name}</strong><br><span>${priceText(p)}</span></button>`).join('')||'<p>Không tìm thấy sản phẩm phù hợp.</p>';$$('[data-search-product]').forEach(b=>b.onclick=()=>{$('#closeSearch').click();openProductDetail(b.dataset.searchProduct)});window.applyI18n?.()}
$('#searchButton').onclick=()=>{$('#searchPanel').hidden=false;document.body.style.overflow='hidden';renderSearch();setTimeout(()=>$('#searchInput').focus(),50)};$('#closeSearch').onclick=()=>{$('#searchPanel').hidden=true;document.body.style.overflow=''};$('#searchInput').oninput=e=>renderSearch(e.target.value);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#productDetail').classList.contains('open'))closeProductDetail();else if(!$('#searchPanel').hidden)$('#closeSearch').click();else if($('#checkout').classList.contains('open'))closeCheckout();else closeCart()}});
renderProducts();renderCart();
const hashProduct=location.hash.match(/^#product-(.+)$/)?.[1];if(hashProduct)setTimeout(()=>openProductDetail(hashProduct),0);

function registerCommerceTools(){
 const context=typeof document==='undefined'?undefined:document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});
 register({name:'list_products',title:'List products',description:'List the products currently offered in the thefirstworkshop demo store, optionally filtered by category.',inputSchema:{type:'object',properties:{category:{type:'string',enum:['Smart Pods','Loose Furniture','Storage Solutions','System Furniture','Seatings','Monitor Arm & Docking','Glass Partition','Milliken Flooring','Acoustic Wall Panel','Accessories']}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input={}){const list=input.category?products.filter(p=>p.scope===input.category||p.category===input.category):products;return{products:list.map(({id,name,category,scope,price,contactOnly,detail})=>({id,name,category,scope,priceVnd:price,contactOnly:Boolean(contactOnly),detail}))}}});
 register({name:'add_product_to_cart',title:'Add product to cart',description:'Add a specified quantity of one priced product to the visible shopping cart.',inputSchema:{type:'object',properties:{productId:{type:'string'},quantity:{type:'integer',minimum:1,maximum:20}},required:['productId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const product=products.find(p=>p.id===input.productId);if(!product)throw new Error('Unknown productId');if(product.contactOnly)throw new Error('This product requires a quotation');const quantity=input.quantity??1;if(!Number.isInteger(quantity)||quantity<1||quantity>20)throw new Error('Quantity must be an integer from 1 to 20');cart[product.id]=(cart[product.id]||0)+quantity;saveCart();return{added:{productId:product.id,quantity},cartItemCount:cartData().reduce((sum,p)=>sum+p.qty,0),subtotalVnd:total()}}});
 register({name:'start_checkout',title:'Start checkout',description:'Open the visible checkout for the current cart. This prepares checkout but does not place or pay for an order.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(){if(!cartData().length)throw new Error('The cart is empty');openCheckout();return{status:'checkout_open',items:cartData().reduce((sum,p)=>sum+p.qty,0),totalVnd:total(),paymentMode:'demo'}}});
}
registerCommerceTools();
