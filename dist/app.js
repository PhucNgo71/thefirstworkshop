const catalogDetails={
 'Smart Pods':'Buồng làm việc cách âm',
 'Loose Furniture':'Nội thất rời cho không gian linh hoạt',
 'Storage Solutions':'Giải pháp lưu trữ văn phòng',
 'System Furniture':'Nội thất hệ thống cho văn phòng',
 'Seatings':'Ghế công thái học và ghế tác vụ',
 'Monitor Arm & Docking':'Tay màn hình và giải pháp kết nối',
 'Glass Partition':'Hệ vách kính văn phòng',
 'Flooring Solutions':'Giải pháp sàn · Milliken',
 'Acoustic Wall Panel':'Tấm tiêu âm · Acoufelt',
 'Accessories':'Phụ kiện không gian làm việc'
};
const catalogEntries=[
 ['simpl-screens','SIMPL Screens / Zenith','Accessories',0,'assets/products/zenith-simpl-main.jpg','simpl-screens'],
 ['precinct-screens','PRECINCT Screens / Zenith','Accessories',0,'assets/products/zenith-precinct-screen-cutout.png','precinct-screens'],
 ['screen-fabric-1400','Tabletop-Mounted Screen / Standard Fabric','Accessories',2500000,'assets/products/screen-fabric-1400-angle.png','screen-fabric-1400'],
 ['modesty-mfc-1400','MFC Modesty Panel / 1400 mm Tabletop','Accessories',1363636,'assets/products/modesty-mfc-1400-dark-wood.png','modesty-mfc-1400'],
 ['anchor','Anchor Staff Chair','Seatings',4700000,'assets/products/anchor-main.jpg','anchor'],
 ['niro','Niro / Zenith','Seatings',0,'assets/products/niro-green.jpg','niro'],
["furnipower-pixel","PIXEL Modular Socket EU / Furnipower","Accessories",0,"assets/products/furnipower-pixel.jpg","furnipower-pixel"],
["furnipower-flip","GaN USB Flip Cover / Furnipower","Accessories",0,"assets/products/furnipower-flip.jpg","furnipower-flip"],
["furnipower-apex","APEX GaN USB Charger Series / Furnipower","Accessories",0,"assets/products/furnipower-apex.jpg","furnipower-apex"],
["furnipower-oecz090w","OECZ090W Clamp Socket / Furnipower","Accessories",0,"assets/products/furnipower-oecz090w.jpg","furnipower-oecz090w"],
 ["intra-chair","Intra / Wilkhahn","Seatings",0,"assets/products/wilkhahn-intra-grey-highback.png","intra-chair"],
 ["graph-chair","Graph Chair / Wilkhahn","Seatings",0,"https://www.wilkhahn.com/fileadmin/_processed_/5/f/csm_Wilkhahn-302_7-Graph-cutout_a0082e04a5.jpg","graph-chair"],
 ["confair-folding-table","Confair Folding Table / Wilkhahn","System Furniture",0,"https://www.wilkhahn.com/fileadmin/_processed_/4/c/csm_Wilkhahn-440-Confair-cutout_897f3d01f6.jpg","confair-folding-table"],
 ['dress01','Dress-1','Loose Furniture',3300000,'assets/cutouts/dress01-green-front.png','dress-01'],
 ['dress04','Dress-4','Loose Furniture',3500000,'assets/cutouts/dress04-green-front.png','dress-04'],
 ['dress05','Dress-5','Loose Furniture',4200000,'assets/cutouts/dress05-green-front.png','dress-05'],
 ['dress06','Dress-6','Loose Furniture',3500000,'assets/cutouts/dress06-green-front.png','dress-06'],
 ["kissen-folding","Kissen Folding Table / Zenith","System Furniture",16000000,"https://product.hstatic.net/200000617147/product/chair_website__3__f51cdd7a94d040b18ce35f34ead95cf8.png","kissen-folding-table"],
 ["shirly","Shirly","System Furniture",10000000,"https://product.hstatic.net/200000617147/product/5_4x-100_ebeeeca1e459420587d2e3331c04d023.jpg","matchman-series-table"],
 ["graph-table","Graph Table / Wilkhahn","System Furniture",215490000,"https://product.hstatic.net/200000617147/product/6_4x-100_5faaf111ba4d4340a65c6a382d3ab88a.jpg","range-graph-table"],
 ['framery-one-compact','FRAMERY ONE COMPACT','Smart Pods',0,'https://framery.com/wp-content/uploads/2025/11/framery-one-compact-white-1.webp','framery-one-compact'],
 ['framery-one-premium','FRAMERY ONE','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/framery-one-white-1.webp','framery-one'],
 ['framery-four','FRAMERY FOUR','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/four-white-1.png','framery-four'],
 ['framery-six','FRAMERY SIX','Smart Pods',0,'https://framery.com/wp-content/uploads/2026/01/framery-six-white.png','framery-six','Mới'],
 ['spod3','S POD 3.0 PLUS','Smart Pods',220000000,'https://winpodacoustics.com/wp-content/uploads/2026/06/S-Pod-3.0-Plus_White_Certification-1-1024x1024.avif','s-pod-3-0-plus-series','Mới'],
 ['wpod3','W POD 3.0 PLUS','Smart Pods',295000000,'https://winpodacoustics.com/wp-content/uploads/2026/06/W-Pod-3.0-Plus_Middle_Logo-1024x1024.avif','w-pod-3-0-plus-series'],
 ['dpod3','D POD 3.0 PLUS','Smart Pods',346700000,'https://winpodacoustics.com/wp-content/uploads/2026/06/D-Pod-3.0-Plus_Logo-1024x1024.avif','d-pod3-0-plus-series'],
 ['parco','Parco Sofa','Loose Furniture',19500000,'assets/products/parco-single.jpg','parco-series'],
 ['easychair','Easy Chair','Loose Furniture',3300000,'https://cdn.hstatic.net/products/200000617147/6_19__171b6d7811424588bb4a02ab3c7a6a4e_large.png','easy-chair'],
 ['maris','MARIS HIGH BACK SOFA','Loose Furniture',35000000,'https://cdn.hstatic.net/products/200000617147/22_5ebaa9b15be546f094c209d6deb7ccbe_large.png','maris-high-back-sofa'],
 ['noah800','NOAH 800 CAFE TABLE','Loose Furniture',10000000,'https://cdn.hstatic.net/products/200000617147/18_09c5dc9236c046969ec4dec7891f1475_large.png','noah-800-cafe-table'],
 ['turtle','TURTLE POUF','Loose Furniture',6000000,'https://cdn.hstatic.net/products/200000617147/13_1__7419697da1074cc0b196268a78139fab_large.png','turtle-pouf'],
 ['john','JOHN HIGH BACK SOFA','Loose Furniture',38000000,'https://cdn.hstatic.net/products/200000617147/9_2__39f531986d574275b915cfc7d3e26052_large.png','high-back-sofa'],
 ['swing','Swing Chair','Loose Furniture',16100000,'https://cdn.hstatic.net/products/200000617147/6_1__04cb884dcd674f318125a0e175871829_large.png','swing-chair'],
 ['jac','JAC Stool','Loose Furniture',0,'https://product.hstatic.net/200000617147/product/15_48e16d292b364ad9bc48721b089f9c3f_large.png','jac-stool'],
 ['occo','OCCO Chair','Loose Furniture',0,'https://product.hstatic.net/200000617147/product/5_3ec632a26e6546588fbee76c047bf393_large.png','occo-chair'],
 ['hours-lounge','HOURS LOUNGE','Loose Furniture',0,'https://www.zenithinteriors.com/media/wq3lumt3/hcp_250528_zenith_012.jpg?anchor=center&mode=crop&width=720&height=1002&rnd=133954181943870000','hours-lounge','Mới'],
 ['precinct','PRECINCT POD & LOUNGE','Loose Furniture',0,'https://www.zenithinteriors.com/media/rwlprjlb/thumbnail.jpg?anchor=center&mode=crop&width=720&height=1002&rnd=132739289362070000','precinct-lounge-modules'],
 ['precinct-focus-workpod','PRECINCT FOCUS Workpod / Zenith','Loose Furniture',0,'assets/products/precinct-focus-high-cutout.png','precinct-focus-workpod'],
 ['precinct-focus-lounge','PRECINCT FOCUS Lounge / Zenith','Loose Furniture',0,'assets/products/precinct-focus-lounge-main.jpg','precinct-focus-lounge'],
 ['precinct-meet-booth','PRECINCT MEET Booth / Zenith','Loose Furniture',0,'assets/products/precinct-meet-booth-main.jpg','precinct-meet-booth'],
 ['activity-stool','Activity Stool / Actiforce','Loose Furniture',0,'assets/cutouts/activity-stool-main.png','activity-stool'],
 ['repo','REPO Pedestal','Storage Solutions',3500000,'https://cdn.hstatic.net/products/200000617147/1_2__708824e55ad84f00a73fe2a27a023ce5_large.png','repo-pedestal'],
 ['repo-tambour','REPO tambour','Storage Solutions',7700000,'https://cdn.hstatic.net/products/200000617147/2_1__7d76c51930304449acbf8a64137b77de_large.png','repo-tambour-2'],
 ['cableriser','Cable Riser / Sâu Điện','System Furniture',350000,'https://cdn.hstatic.net/products/200000617147/s_u_di_n_02_549028b7c34f435e8bf1b74e80308255_large.png','cable-riser-sau-dien'],
 ['cabletray','Cable Tray / Máng Điện','System Furniture',650000,'https://cdn.hstatic.net/products/200000617147/chatgpt_image_jul_20__2026__03_54_08_pm__2__3c3fc56466424e98a2f1a320411e0633_large.png','cable-tray-mang-dien'],
 ['meeting','Meeting Table Genese / Bàn Họp','System Furniture',56000000,'https://www.holmrisb8.com/wp-content/uploads/2021/12/HOLMRIS-B8-Genese-meeting-table-1.png','genese'],
 ['q20','Q20 / Holmris B8','System Furniture',24000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__9__2997fc9d0f154984b928b58494b2169b_large.png','q20-recrafted'],
 ['teddy-tables','TEDDY TABLES','System Furniture',0,'https://www.zenithinteriors.com/media/xhai4kuw/teddy_table_-thumb.png?anchor=center&mode=crop&width=720&height=1002&rnd=133917728938370000','teddy-table','Mới'],
 ['orbis','ORBIS WORKSTATION','System Furniture',0,'https://www.zenithinteriors.com/media/fdhnztgn/hcp_221214_zenith_orbis_002_v1.jpg','orbis-workstation'],
 ['precinct-pod-fixed-height','PRECINCT Pod Fixed Height','System Furniture',0,'assets/products/precinct-pod-fixed-cutout.png','precinct-pod-fixed-height'],
 ['kissen','KISSEN TABLES','System Furniture',0,'https://www.zenithinteriors.com/media/2b4ajsqi/zenith_kissen_table_01.jpg?anchor=center&mode=crop&width=720&height=1002&rnd=132739289057000000','kissen-table'],
 ['sls1050','SLS 1050','System Furniture',14000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__9__e499c03a86e54e6fbbdb07389ea82904_large.png','steelforce-1050-tfw'],
 ['sls770','SLS 770 PRO','System Furniture',15000000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__8__526e52550344473690b6add29e3cb468_large.png','sls-770-pro-tfw','Nổi bật'],
 ['sls-470-pro','SLS 470 PRO','System Furniture',16000000,'assets/products/sls-470-pro-cutout.png','sls-470-pro','Mới'],
 ['sls470','SLS 670 PRO','System Furniture',17000000,'https://product.hstatic.net/200000617147/product/54_f198c19fea50400da9c0fe84500fbe1a_large.png','sls-670-pro','Bán chạy'],
 ['sls470bench','SLS 670 BENCH PRO','System Furniture',32000000,'assets/products/sls-670-bench-cutout.png','sls-670-pro-bench'],
 ['at-chair','AT Chair / Wilkhahn','Seatings',36980000,'https://product.hstatic.net/200000617147/product/fixed_1_4x-100_3b907028760740b9bed4f27bc11e9f8e_large.jpg','at-chair'],
 ['freedom','Freedom Chair / Humanscale','Seatings',36600000,'https://product.hstatic.net/200000617147/product/1_4x-100_e5507a410b524b5aa48fafeff583e49d_large.jpg','freedom-chair'],
 ['smart-chair','Smart Chair / Humanscale','Seatings',33000000,'https://product.hstatic.net/200000617147/product/them_tieu_de__1__4be2295487f44317b743d75a04b7e852_large.png','smart-chair'],
 ['liberty','Liberty Chair / Humanscale','Seatings',29650000,'https://product.hstatic.net/200000617147/product/them_tieu_de__4__78523b997f3d4b338711a8e2f27dd5c4_large.png','liberty-chair'],
 ['world-chair','World Chair / Humanscale','Seatings',24200000,'https://product.hstatic.net/200000617147/product/them_tieu_de__5__84703126540d43baa309fc75707080e9_large.png','world-chair'],
 ['worldone','WORLD LM / Humanscale','Seatings',13500000,'assets/products/worldone-grey-seat.png','world-one-chair'],
 ['vox','VOX TASK CHAIR','Seatings',11500000,'https://product.hstatic.net/200000617147/product/15_db98a04259924bc787047b7707ac52d5_large.png','vox-chair'],
 ['khyn','KHYN TASK CHAIR','Seatings',9700000,'https://cdn.hstatic.net/products/200000617147/website_ergogen__28__b031c543111e43e6862b5b1ac894b6dc_large.png','khyn-chair'],
 ['k10m','K10M Chair / Krede','Seatings',9890000,'https://product.hstatic.net/200000617147/product/1_4x-100_87b1380d1aae4a31b50fde8be1af8316_large.jpg','k10m-chair'],
 ['jac-chairs','JAC CHAIR COLLECTION','Loose Furniture',0,'https://www.zenithinteriors.com/media/gw3ntefm/schamburg_alvisse_jac_star_01.jpg?anchor=center&mode=crop&width=720&height=1002&rnd=132739290915130000','jac-4-star-chair'],
 ['tori','Tori / Flokk','Seatings',8500000,'https://cdn.hstatic.net/products/200000617147/6_1__2010bc0bd11349439171e814c6546630_large.png','tori'],
 ['hag-capisco','HÅG Capisco 8106 / Flokk','Seatings',0,'assets/products/hag-capisco-8106-front.jpg','hag-capisco'],
 ['wichair','WiChair / Wilkhahn','Seatings',0,'assets/products/wilkhahn-wichair-oak.jpg','wichair'],
 ['ae5','AE5-FF100','Monitor Arm & Docking',2200000,'https://cdn.hstatic.net/products/200000617147/ae5-5_ad788b5f33704e3084cc3e2a1b8e05b8_large.png','ae5-100'],
 ['ct206','CT 206','Monitor Arm & Docking',5500000,'https://cdn.hstatic.net/products/200000617147/image_2025-08-25_144515_441_db419cce294f42dcb0d89b1bf861ea68_large.png','ct-206'],
 ['mconnect3','M/Connect 3','Monitor Arm & Docking',21000000,'https://product.hstatic.net/200000617147/product/mc3_environmental_6734634215824594bc15054d4c9d7dec_large.jpg','m-connect-3'],
 ['m2pro','M2 Pro','Monitor Arm & Docking',6900000,'https://product.hstatic.net/200000617147/product/6_4x-100_08ae60e989204f02be2cfd6cd012dd7e_large.jpg','monitor-arm-m21'],
 ['m8pro','M8 Pro','Monitor Arm & Docking',18000000,'https://product.hstatic.net/200000617147/product/m81_learnpage_3_f222591c3cd7473e89a1e88c3804ae22_large.jpg','m8-1-dual'],
 ['mflex','MFlex','Monitor Arm & Docking',15900000,'https://product.hstatic.net/200000617147/product/mflex_2_m2.1_3_654c4e8f2d864a8390954a03d26e1127_large.jpg','m-flex'],
 ['spiralis-e100','SPIRALIS E100','Glass Partition',0,'assets/spiralis-e100-01.jpg','spiralis-e100','Mới'],
 ['retrofit','Retrofit Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__10__6daea0acf8fb4baca08c60c391a7865d_large.png','retrofit-collection'],
 ['building-blocks','Building Blocks 2.0 Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__13__14f1b24192134cc5ab44ab138728ccd2_large.png','building-blocks-2-0-collection'],
 ['natural-supply','Natural Supply Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/1_5__7f4db3535b3e48dbbbec87807ea23ede_large.png','natural-supply-collection'],
 ['airborn','Air Born Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__12__7a69f706885247cdbc5d4aea50314fa4_large.png','air-born-collection'],
 ['cornerstone','Cornerstone Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/1_4__dcf3054e2f8048ec8779e3dce3c10a39_large.png','cornerstone-collection'],
 ['heavy-meta','Heavy Meta Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/1_9__513895adddf54eab84960b5272abe294_large.png','heavy-meta-collection'],
 ['living-facades','Living Facades Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/1_11__5b4d99cd0f0e447ca5eb11780756ff43_large.png','living-facades-collection'],
 ['patina','Patina Collection','Flooring Solutions',0,'https://cdn.hstatic.net/products/200000617147/1_2__e44236a9cc25443b8beff032565fa216_large.png','patina-collection'],
 ['moments-in-time','Moments in Time Collection','Flooring Solutions',0,'assets/products/milliken-moments-in-time-1.webp','moments-in-time'],
 ['pattern-play','Pattern Play Collection','Flooring Solutions',0,'assets/products/milliken-pattern-play-1.webp','pattern-play'],
 ['coastline','Coastline Collection','Flooring Solutions',0,'assets/products/milliken-coastline-2.jpg','coastline'],
 ['passage','Passage Collection','Flooring Solutions',0,'assets/products/milliken-passage-1.png','passage'],
 ['fracture','Fracture Two-Tone','Acoustic Wall Panel',0,'https://product.hstatic.net/200000617147/product/acoufelt-n-w-panels-fracture-two-tone-shard-talc-amaryllis1_f9cfb5b1c7d2485dbdae56111a9ac4fe_large.jpg','fracture-two-tone'],
 ['pixel','Pixel','Acoustic Wall Panel',0,'https://product.hstatic.net/200000617147/product/acoufelt-n-w-panel-pixel-rectangle-limestone-balsam1_1d60d0cb353f477485d57b609496f858_large.jpg','pixel'],
 ['athena','Athena','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_8__506b7ec19007435ebe0c75447d52b5b1_large.png','athena'],
 ['acticase-actihook','ActiCase ActiHook / Actiforce','Accessories',0,'assets/products/actihook-main.jpg','acticase-actihook'],
 ['centra','Centra','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_16__98fc1ba57c2347c7844420c9e490b103_large.png','centra'],
 ['ck06','CK06','Accessories',3500000,'https://cdn.hstatic.net/products/200000617147/4_2__7d5c69dcdebc43ef9bca4e6f4209b081_large.png','ck06'],
 ['nova-viva','Nova & Viva','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_9__d3e35596876f4196a948cb65495754bf_large.png','nova-viva'],
 ['nw-series','NW Series','Accessories',0,'https://cdn.hstatic.net/products/200000617147/website_ergogen__6__fe7663fd00f647e7973792bccc11533c_large.png','nw'],
 ['sw-series','SW Series','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_5__6c7fc71c2e0a48f0b5f274480b5507e6_large.png','sw'],
 ['zeus','Zeus','Accessories',0,'https://cdn.hstatic.net/products/200000617147/1_11__a6f0e40081ad4418a4b9669c5d4783dd_large.png','zeus']
];
const products=catalogEntries.map(([id,name,scope,price,image,handle,badge])=>({id,name,category:scope,scope,...window.tfwPricing.productPrice(price),image:window.productImageUrl(window.productGalleryOverrides?.[id]?.images?.[0]||image),badge,contactOnly:price===0,detail:window.carpetCollection?.summaries?.[id]||window.slsListingDetails?.[id]||catalogDetails[scope],sourceUrl:`https://tfw.space/products/${handle}`,swatches:['#111312','#f4f5f3','#8b8f8c']}));
const orderProducts=window.tfwProductOptions?.cartProducts(products)||products;
const productLineProfiles={
 'Smart Pods':76,'Loose Furniture':84,'Storage Solutions':80,'System Furniture':86,'Seatings':80,
 'Monitor Arm & Docking':76,'Glass Partition':84,'Flooring Solutions':92,'Acoustic Wall Panel':88,'Accessories':74
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
 orbis:{
  imageScale:100,
  images:[
   'https://www.zenithinteriors.com/media/fdhnztgn/hcp_221214_zenith_orbis_002_v1.jpg',
   'https://www.zenithinteriors.com/media/u4th3010/hcp_230221_zenith_015.jpg'
  ],
  swatches:['#f3f2ee','#e9e4da','#a6a7a3','#787a75','#3c3d3a','#171817','#6c5548','#6e4031','#c99691','#aa5136','#88a9b8','#31425d','#6e7551'],
  brand:'Zenith',productType:'Hệ workstation linh hoạt',
  description:'Orbis là hệ workstation có thiết kế chân tinh gọn, hỗ trợ cả chế độ làm việc cá nhân và theo nhóm. Hệ bàn có thể cấu hình nâng hạ điện, chiều cao cố định, tech-adjust hoặc winder-adjust; đồng thời tương thích với CTRL, Precinct, Glovebox và các dòng vách Framed để tạo nên trạm làm việc phù hợp với từng dự án.',
  specifications:'Cấu hình: bàn đơn hoặc cụm workstation\nCơ chế điều chỉnh: sit–stand điện, chiều cao cố định, tech-adjust hoặc winder-adjust\nHệ vách tương thích: Precinct, Framed, Slide-On Divider, Simpl và Modesty Panel\nQuản lý dây cáp: tùy chọn Cable Management / Cable Hub\nTay màn hình: hỗ trợ cấu hình đơn, đôi hoặc nhiều màn hình\nPhụ kiện: Work Shapes, CTRL và công nghệ tích hợp\nKích thước: theo cấu hình và tài liệu kỹ thuật\nThời gian giao hàng tham khảo: 6–10 tuần',
  highlights:['Bàn đơn hoặc cụm làm việc nhóm','Bốn cơ chế điều chỉnh chiều cao','Hệ vách và phụ kiện cấu hình linh hoạt'],
  optionGroups:[
   {label:'Cấu hình',values:['Bàn đơn','Cụm workstation']},
   {label:'Điều chỉnh chiều cao',values:['Sit–stand điện','Chiều cao cố định','Tech-adjust','Winder-adjust']},
   {label:'Hệ vách',values:['Precinct','Framed','Slide-On Divider','Simpl','Modesty Panel']}
  ],
 bundleItems:[{id:'m2pro'},{id:'cabletray'},{label:'Cable Hub',detail:'Quản lý và che giấu dây cáp',contact:true}],
  sourceUrl:'https://www.zenithinteriors.com/asia/products/orbis-workstation/'
 },
 'spiralis-e100':{
  imageScale:100,
  images:['assets/spiralis-e100-01.jpg','assets/spiralis-e100-02.jpg','assets/spiralis-e100-03.jpg','assets/spiralis-e100-04.jpg'],
  galleryModes:['photo','photo','photo','photo'],
  swatches:['#e7e9e7','#bec8c3','#3d4743','#101312'],
  brand:'Spiralis',productType:'Hệ vách kính văn phòng tích hợp',
  description:'E100 là hệ vách kính văn phòng nhẹ, tinh gọn và có đường nét tối giản. Khung nhôm mảnh giúp tăng độ trong suốt, rút gọn thời gian đo đạc và lắp đặt, đồng thời hỗ trợ hiệu năng âm học cho phòng họp, văn phòng riêng và không gian làm việc phân khu.',
  specifications:'Độ dày hệ vách: 100 mm\nKính đơn: kính cường lực 10 hoặc 12 mm\nKính đôi: kính dán 5+5 hoặc 6+6 mm\nCấu hình: vách kính đơn hoặc kính đôi\nCửa tương thích: cửa kính đơn không khung/có khung, cửa kính đôi khung 60 mm, cửa kính đôi phẳng 100 mm và cửa đặc\nKhung: nhôm định hình nhẹ\nLắp đặt: thanh khung giao sẵn theo chiều dài, giảm đo cắt tại công trường\nỨng dụng: phòng họp, văn phòng riêng và phân khu không gian',
  highlights:['Khung mảnh, tăng độ trong suốt','Vách kính đơn hoặc kính đôi','Nhiều cấu hình cửa đồng bộ'],
  optionGroups:[{label:'Cấu hình kính',values:['Kính đơn','Kính đôi']},{label:'Loại cửa',values:['Cửa kính đơn','Cửa kính đôi 60 mm','Cửa kính đôi phẳng 100 mm','Cửa đặc']}],
  sourceUrl:'assets/spiralis-e100-catalogue.pdf'
 },
 m2pro:{
  imageScale:74,
  swatches:['#f4f5f3','#b8b9b7','#111312'],
  brand:'Humanscale',productType:'M2 Pro Single Monitor Arm',
  description:'M2 Pro là tay màn hình đơn gọn nhẹ của Humanscale, cho phép điều chỉnh tức thời để đặt màn hình đúng tầm nhìn, giải phóng diện tích mặt bàn và hỗ trợ tư thế làm việc lành mạnh.',
  specifications:'Cấu hình: 01 màn hình\nTải trọng màn hình: 5–22 lb (2,3–10 kg)\nKích thước màn hình: tối đa 43 inch\nĐiều chỉnh: nâng hạ, xoay và thay đổi chiều sâu\nQuản lý cáp: tích hợp\nLắp đặt: kẹp bàn hoặc xuyên bàn, tùy cấu hình',
  highlights:['Màn hình đến 43 inch','Tải trọng 2,3–10 kg','Quản lý cáp tích hợp'],
  optionGroups:[{label:'Cấu hình',values:['Single Monitor','Dual Mount']},{label:'Màu hoàn thiện',values:['White','Silver','Black']}],
  sourceUrl:'https://www.humanscale.com/products/monitor-arms'
 },
 m8pro:{
  imageScale:88,
  swatches:['#f4f5f3','#b8b9b7','#111312'],
  brand:'Humanscale',productType:'M8 Pro Monitor Arm',
  description:'M8 Pro là tay màn hình tải trọng cao dành cho màn hình lớn. Cơ cấu điều chỉnh mượt giúp thay đổi độ cao, khoảng cách và góc nhìn nhanh chóng, đồng thời giữ mặt bàn gọn gàng.',
  specifications:'Cấu hình đơn: tải trọng 9–50 lb (4,1–22,7 kg)\nKích thước màn hình đơn: tối đa 65 inch\nCấu hình đôi tiêu chuẩn: 1–12,5 lb mỗi màn hình\nKích thước màn hình đôi: tối đa 28 inch mỗi màn hình\nQuản lý cáp: tích hợp\nTùy chọn: tay cầm cho cấu hình đôi',
  highlights:['Màn hình đơn đến 65 inch','Tải trọng đến 22,7 kg','Có cấu hình đơn và đôi'],
  optionGroups:[{label:'Cấu hình',values:['Single Monitor','Dual Monitor','Dual Monitor + Handle']},{label:'Màu hoàn thiện',values:['White','Silver','Black']}],
  sourceUrl:'https://www.humanscale.com/products/monitor-arms'
 },
 mflex:{
  imageScale:90,
  swatches:['#f4f5f3','#b8b9b7','#111312'],
  brand:'Humanscale',productType:'M/Flex Multi-Monitor System',
  description:'M/Flex là hệ tay màn hình mô-đun trên một trụ, được thiết kế để mở rộng linh hoạt cho nhiều màn hình. Hệ thống kết hợp tay M2 Pro hoặc M8 Pro để tạo cấu hình đôi, xếp tầng, ba, bốn hoặc sáu màn hình.',
  specifications:'Số màn hình: tối đa 6 trên một trụ\nTay tương thích: M2 Pro hoặc M8 Pro\nCấu hình: đôi, xếp tầng, ba, bốn hoặc sáu màn hình\nTải trọng: phụ thuộc số lượng và loại tay màn hình\nKích thước màn hình: tối đa 65 inch ở một số cấu hình M8 Pro\nSlider tùy chọn: điều chỉnh ngang 4,5 inch mỗi hướng\nQuản lý cáp: tích hợp',
  highlights:['Tối đa 6 màn hình','Hệ mô-đun mở rộng linh hoạt','Tương thích M2 Pro và M8 Pro'],
  optionGroups:[{label:'Số màn hình',values:['2 màn hình','3 màn hình','4 màn hình','6 màn hình']},{label:'Loại tay',values:['M2 Pro','M8 Pro']}],
  sourceUrl:'https://www.humanscale.com/products/monitor-arms'
 },
 mconnect3:{
  imageScale:92,
  swatches:['#f4f5f3','#111312'],
  brand:'Humanscale',productType:'Docking & Connectivity Hub',
  description:'M/Connect 3 là hub kết nối tập trung cho dữ liệu và nguồn điện, giúp laptop và thiết bị cầm tay kết nối gọn gàng tại trạm làm việc. Thiết kế mô-đun hỗ trợ bảo trì và nâng cấp thuận tiện khi nhu cầu công nghệ thay đổi.',
  specifications:'Chức năng: kết nối dữ liệu và cấp nguồn tập trung\nThiết bị: laptop và thiết bị cầm tay\nPhiên bản: M/Power Charging Hub, USB Data Hub và Pro Dock\nTích hợp: dùng cùng hệ tay màn hình Humanscale\nThiết kế: mô-đun, dễ bảo trì và nâng cấp\nQuản lý cáp: gom kết nối về một điểm trên bàn',
  highlights:['Dữ liệu và nguồn điện tập trung','Ba cấu hình hub/dock','Thiết kế mô-đun dễ nâng cấp'],
  optionGroups:[{label:'Phiên bản',values:['M/Power Charging Hub','USB Data Hub','Pro Dock']}],
  sourceUrl:'https://www.humanscale.com/products/monitor-arms'
 },
 sls470:{
  imageScale:82,
  swatches:['#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce · SLS Collection',productType:'Bàn nâng hạ điện hoàn chỉnh',
  description:'SLS 670 PRO là bàn nâng hạ điện hoàn chỉnh dành cho không gian làm việc chuyên nghiệp, đã bao gồm mặt bàn Actiforce. Kết cấu thép ổn định, vận hành êm và điều chỉnh độ cao liên tục giúp chuyển đổi linh hoạt giữa tư thế ngồi và đứng. Bộ điều khiển ActiSwitch Eco-Memory, chức năng ghi nhớ độ cao, chống va chạm và tùy chọn quản lý dây cáp tạo nên một trạm làm việc gọn gàng, an toàn và dễ sử dụng.',
  specifications:'Khối lượng: 31 kg\nKích thước khung: 110 × 75 × 61 cm\nKích thước cột: 6 × 9 cm\nChiều cao điều chỉnh: 61,5–127,5 cm\nChiều rộng điều chỉnh: 110–170 cm\nHành trình nâng: 66 cm\nTốc độ nâng: 39 mm/s\nTải trọng nâng động: 120 kg\nTruyền động: động cơ điện\nHệ chống va chạm: có\nỔ cắm tích hợp: không\nQuản lý dây cáp: 01 cable tray + 01 cable riser tiêu chuẩn\nVật liệu: kim loại\nBộ điều khiển: ActiSwitch Eco-Memory',
  highlights:['Điều chỉnh điện êm và chính xác','Tải trọng nâng động 120 kg','ActiSwitch Eco-Memory đi kèm'],
  optionGroups:[{label:'Kích thước mặt bàn',values:['1600 × 800 × 25 mm','1800 × 800 × 25 mm','2000 × 800 × 25 mm']},{label:'Màu mặt bàn',values:['Trắng','Xám nhạt','Sồi']},{label:'Màu khung',values:['Đen','Bạc','Trắng']}],
  bundleItems:[{id:'m2pro'},{id:'freedom'},{id:'cabletray',included:true,detail:'Tiêu chuẩn · 01 bộ'},{id:'cableriser',included:true,detail:'Tiêu chuẩn · 01 bộ'}],
  sourceUrl:'https://actiforce.com/en/produkt/sls-670-pro-table-frame/'
 },
 sls470bench:{
  imageScale:90,
  galleryMode:'spec',
  images:['assets/products/sls-670-bench-cutout.png','assets/products/sls-670-bench-side-actiforce.jpg'],
  galleryModes:['cutout','contain'],
  galleryLabels:[['SLS 670 BENCH PRO','Khung đen · Mặt sồi'],['SLS 670 BENCH PRO','Khung đen · Góc bên']],
  gallerySpecs:[['Cấu hình','02 người'],['Mặt bàn','02 bộ'],['Cable tray','02 bộ · Tiêu chuẩn'],['Cable riser','02 bộ · Tiêu chuẩn']],
  swatches:['#111312','#a7aaa8','#f4f5f3'],
  brand:'Actiforce · SLS Collection',productType:'Bàn bench nâng hạ điện hoàn chỉnh',
  description:'SLS 670 Bench PRO là hệ bàn đôi nâng hạ điện hoàn chỉnh dành cho văn phòng hiện đại và không gian coworking, đã bao gồm hai mặt bàn Actiforce. Hai vị trí làm việc được tổ chức trên một kết cấu chung để tiết kiệm diện tích, trong khi mỗi người dùng vẫn có thể điều chỉnh độ cao phù hợp với tư thế ngồi hoặc đứng. Kết cấu thép chắc chắn, chống va chạm và bộ điều khiển ActiSwitch Eco-Memory hỗ trợ vận hành an toàn, linh hoạt.',
  specifications:'Khối lượng: 70 kg\nKích thước khung: 110 × 140 × 61 cm\nKích thước cột: 6 × 9 cm\nTải trọng nâng động: 120 kg\nTruyền động: động cơ điện\nHệ chống va chạm: có\nỔ cắm tích hợp: không\nQuản lý dây cáp: 02 cable tray + 02 cable riser tiêu chuẩn\nVật liệu: kim loại\nBộ điều khiển: ActiSwitch Eco-Memory',
  highlights:['Hệ bench tiết kiệm diện tích','Điều chỉnh độ cao cho từng vị trí','Tải trọng nâng động 120 kg'],
  optionGroups:[{label:'Kích thước mỗi mặt bàn',values:['1600 × 800 × 25 mm','1800 × 800 × 25 mm','2000 × 800 × 25 mm']},{label:'Màu mặt bàn',values:['Trắng','Xám nhạt','Sồi']},{label:'Màu khung',values:['Đen','Bạc','Trắng']}],
  bundleItems:[
   {label:'Vách ngăn bàn',detail:'Vách ngăn trung tâm cho bàn bench',contact:true},
   {id:'m2pro'},{id:'freedom'},{id:'cabletray',included:true,detail:'Tiêu chuẩn · 02 bộ'},{id:'cableriser',included:true,detail:'Tiêu chuẩn · 02 bộ'}
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
window.applySlsDetails?.(manufacturerOverrides);
let cart=JSON.parse(localStorage.getItem('tfw-demo-cart')||'{}');let activeFilter='all';let activeSort='featured';
const money=n=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
const priceText=p=>p.contactOnly?(window.carpetCollection?.priceText(p.id)||'Liên hệ'):`Từ ${money(p.price)} (đã gồm 10% VAT)`;
const productImageScale=product=>manufacturerOverrides[product.id]?.imageScale||window.productDetails?.[product.id]?.imageScale||productLineProfiles[product.scope]||84;
const productSwatches=product=>manufacturerOverrides[product.id]?.swatches||window.productDetails?.[product.id]?.swatches||product.swatches;
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function featuredBrandPriority(product){
 const brand=String(window.productGalleryOverrides?.[product.id]?.brand||manufacturerOverrides[product.id]?.brand||window.productDetails?.[product.id]?.brand||'').trim().toLowerCase();
 if(brand==='zenith')return 0;
 if(['thefirstworkshop','tfw','tfw collection'].includes(brand))return 1;
 return 2;
}
function catalogViewProducts(filter='all',sort='featured'){
 const list=filter==='all'?[...products]:products.filter(p=>p.scope===filter||p.category===filter);
 if(sort==='low')return list.sort((a,b)=>(a.contactOnly?Number.MAX_SAFE_INTEGER:a.price)-(b.contactOnly?Number.MAX_SAFE_INTEGER:b.price));
 if(sort==='high')return list.sort((a,b)=>b.price-a.price);
 return list.sort((a,b)=>featuredBrandPriority(a)-featuredBrandPriority(b));
}
function renderPricedOptions(product){
 const variants=window.tfwProductOptions?.variantsFor(product)||[];
 if(!variants.length)return;
 $('#productOptions').innerHTML=`<div class="config-group"><div class="config-heading"><span>Tựa đầu</span><strong id="pricedOptionSelection"></strong></div><div class="choice-grid detail-variants">${variants.map(variant=>`<button type="button" data-priced-option="${variant.id}" aria-pressed="false"><span>${variant.configurationLabel}</span>${variant.surcharge?` <span>+${money(variant.price-product.price)}</span>`:''}</button>`).join('')}</div><p>Giá tùy chọn đã bao gồm 10% VAT.</p></div>`;
 const select=variant=>{
  activePurchaseId=variant.id;
  $('#pricedOptionSelection').textContent=variant.configurationLabel;
  $$('[data-priced-option]').forEach(button=>{const selected=button.dataset.pricedOption===variant.id;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
  $('#detailPrice').textContent=priceText(variant);
  $('#detailAddButton').innerHTML=`Thêm vào giỏ · <span id="detailAddPrice">${money(variant.price)}</span>`;
  window.applyI18n?.();
 };
 $$('[data-priced-option]').forEach(button=>button.onclick=()=>select(variants.find(variant=>variant.id===button.dataset.pricedOption)));
 select(variants[0]);
}
// Black-finish previews are limited to shop cards; detail galleries retain original photography.
const armCardImages={ae5:'assets/arm-card-ae5-black.png',ct206:'assets/arm-card-ct206-black.png',m2pro:'assets/arm-card-m2pro-black.png',m8pro:'assets/monitor-arm-black-preview.png',mflex:'assets/arm-card-mflex-black.png'};
function renderProducts(filter=activeFilter){activeFilter=filter;const list=catalogViewProducts(filter,activeSort);$('#productCount').textContent=`${list.length} sản phẩm`;$('#productGrid').innerHTML=list.map(p=>`<article class="product-card" data-product-line="${productLineSlug(p.scope)}" style="--product-image-scale:${productImageScale(p)}%"><div class="product-visual">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}<button class="product-image-button" data-product="${p.id}" type="button" aria-label="Xem chi tiết ${p.name}"><img src="${armCardImages[p.id]||p.image}" alt="${p.name}" loading="lazy"></button><button class="quick-add" ${p.contactOnly?`data-contact="${p.id}"`:`data-add="${p.id}"`} type="button" aria-label="${p.contactOnly?'Liên hệ tư vấn':'Thêm '+p.name+' vào giỏ'}">${p.contactOnly?'↗':'＋'}</button></div><div class="product-meta"><div class="product-copy"><button class="product-title" data-product="${p.id}" type="button">${p.name}</button><span class="product-price">${priceText(p)}</span><p>${p.detail}</p><div class="swatches" aria-label="Màu hoàn thiện">${productSwatches(p).map(color=>`<span style="--swatch:${color}"></span>`).join('')}</div></div><button class="add-button" ${p.contactOnly?`data-contact="${p.id}"`:`data-add="${p.id}"`} type="button">${p.contactOnly?'Liên hệ tư vấn ↗':'Thêm vào giỏ <span>＋</span>'}</button></div></article>`).join('');$$('[data-add]').forEach(b=>b.onclick=()=>addToCart(b.dataset.add));$$('[data-contact]').forEach(b=>b.onclick=()=>requestQuote(b.dataset.contact));$$('[data-product]').forEach(b=>b.onclick=()=>openProductDetail(b.dataset.product));window.carpetCollection?.decorateGrid(filter);window.applyI18n?.();}
function saveCart(){localStorage.setItem('tfw-demo-cart',JSON.stringify(cart));renderCart();}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();openCart();showToast('Đã thêm vào giỏ hàng');}
function requestQuote(id){const product=products.find(p=>p.id===id);if(!product)return;location.href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Tư vấn sản phẩm '+product.name)}`;}
function cartData(){return orderProducts.filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]}));}
function total(){return cartData().reduce((s,p)=>s+p.price*p.qty,0)}
function renderCart(){const data=cartData();$('#cartCount').textContent=data.reduce((s,p)=>s+p.qty,0);$('#cartSubtotal').textContent=money(total());$('#cartItems').innerHTML=data.length?data.map(p=>`<article class="cart-line"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-minus="${p.id}" aria-label="Giảm ${p.name}">−</button><span>${p.qty}</span><button data-plus="${p.id}" aria-label="Tăng ${p.name}">+</button></div></div><strong>${money(p.price*p.qty)}</strong></article>`).join(''):'<div class="empty-cart"><p>Giỏ hàng đang trống.</p><a class="arrow-link" href="#shop" id="emptyShopLink">Khám phá sản phẩm →</a></div>';$$('[data-minus]').forEach(b=>b.onclick=()=>{cart[b.dataset.minus]--;if(cart[b.dataset.minus]<=0)delete cart[b.dataset.minus];saveCart()});$$('[data-plus]').forEach(b=>b.onclick=()=>{cart[b.dataset.plus]++;saveCart()});$('#checkoutButton').disabled=!data.length;window.applyI18n?.();}
function openCart(){renderCart();$('#overlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>$('#closeCart').focus(),50)}
function closeCart(){ $('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').hidden=true;document.body.style.overflow=$('#productDetail').classList.contains('open')?'hidden':'';}
function openCheckout(){if(!cartData().length)return;closeCart();const data=cartData();$('#checkoutItems').innerHTML=data.map(p=>`<article class="checkout-line"><div><h3>${p.name} × ${p.qty}</h3><p>${p.configurationLabel||p.detail}</p></div><strong>${money(p.price*p.qty)}</strong></article>`).join('');$('#summaryTotal').textContent=$('#checkoutTotal').textContent=money(total());$('#checkout').classList.add('open');$('#checkout').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';window.applyI18n?.();setTimeout(()=>$('#closeCheckout').focus(),50)}
function closeCheckout(){ $('#checkout').classList.remove('open');$('#checkout').setAttribute('aria-hidden','true');document.body.style.overflow=$('#productDetail').classList.contains('open')?'hidden':'';}
let activeProductId=null;let activePurchaseId=null;
function openProductDetail(id){
 const product=products.find(p=>p.id===id);if(!product)return;
 const source={...(window.productDetails?.[id]||{}),...(manufacturerOverrides[id]||{}),...(window.productGalleryOverrides?.[id]||{})};const gallery=[...new Set((source.images?.length?source.images:[product.image]).map(window.productImageUrl))].slice(0,8);const isSpecGallery=source.galleryMode==='spec';const galleryCells=gallery;const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 $('#productDetail').classList.toggle('carpet-detail',!!window.carpetCollection?.collectionLinks?.[id]);
 activeProductId=id;activePurchaseId=id;$('#detailTitle').textContent=product.name;$('#detailPrice').textContent=priceText(product);$('#detailAddButton').innerHTML=product.contactOnly?'Liên hệ tư vấn ↗':`Thêm vào giỏ · <span id="detailAddPrice">${money(product.price)}</span>`;$('#detailBadge').textContent=product.badge||product.scope||'thefirstworkshop';const origin=source.specifications?.match(/Xuất xứ thương hiệu:\s*([^\n]+)/i)?.[1]?.trim();$('#detailOrigin').textContent=origin||'';$('#detailOrigin').hidden=!origin;
 $('#detailHighlights').innerHTML=(source.highlights||[]).map(item=>`<li>${safe(item)}</li>`).join('');$('#detailHighlights').hidden=!source.highlights?.length;
 $('#productDetail').classList.toggle('lean-detail',isSpecGallery);$('#detailGallery').style.setProperty('--detail-image-scale',`${Math.min(92,source.imageScale||productImageScale(product)+2)}%`);const galleryMarkup=galleryCells.map((image,index)=>{const label=source.galleryLabels?.[index];const requestedMode=source.galleryModes?.[index];const cutoutClass=requestedMode==='cutout'?' cutout':'';const photoClass=!isSpecGallery&&(requestedMode==='photo'||(!requestedMode&&index>=2))?' photo':'';return `<figure class="detail-image${index===0?' primary':''}${photoClass}${cutoutClass}"><img style="${window.carpetCollection?.imageStyle(id,index)||''}" src="${image}" alt="${index===0?product.name:`${product.name} · ${index+1}`}" loading="${index===0?'eager':'lazy'}">${label?`<figcaption><strong>${safe(label[0])}</strong><span>${safe(label[1])}</span></figcaption>`:''}</figure>`}).join('');const specMarkup=isSpecGallery&&source.gallerySpecs?.length?`<div class="detail-spec-rail" aria-label="Thông số cấu hình">${source.gallerySpecs.map(([label,value])=>`<div><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('')}</div>`:'';$('#detailGallery').innerHTML=galleryMarkup+specMarkup;
 const allInfo=`${source.specifications||''}\n${source.description||''}`;const dimension=allInfo.split(/\n+/).find(line=>/^(?:kích thước|dimensions?)(?:\s|:)/i.test(line.trim()));const facts=[['Thương hiệu',source.brand],['Dòng sản phẩm',source.productType||product.scope],['Kích thước',dimension?.replace(/^.*?(kích thước|dimension)\s*:?\s*/i,'')]].filter(([,value])=>value);
 $('#detailFacts').innerHTML=facts.map(([label,value])=>`<div><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('');
 const millikenLink=$('#detailMillikenLink');const millikenUrl=window.carpetCollection?.collectionLinks?.[id];millikenLink.hidden=!millikenUrl;if(millikenUrl)millikenLink.href=millikenUrl;else millikenLink.removeAttribute('href');
 $('#detailDescription').textContent=source.description||product.detail;$('#detailSpecifications').textContent=source.specifications||'Thông số chi tiết được xác nhận theo cấu hình và báo giá.';$('#specificationsPanel').hidden=false;
 const renderBundleItems=(items,title=source.setTitle||'Hoàn thiện setup',subtitle=source.setSubtitle||'Recommended add-ons')=>{const bundleItems=(items||[]).map(item=>item.id?{...item,product:products.find(candidate=>candidate.id===item.id)}:item).filter(item=>!item.id||item.product);$('#detailAddons').hidden=!bundleItems.length;$('#detailAddonsTitle').textContent=title;$('#detailAddonsSubtitle').textContent=subtitle;$('#detailAddonGrid').innerHTML=bundleItems.map(item=>{const addon=item.product;const label=item.label||addon?.name;const detail=item.detail||(addon?(addon.contactOnly?'Liên hệ':money(addon.price)):'');return `<article class="detail-addon-card${item.included?' included':''}">${addon?`<img src="${addon.image}" alt="${safe(label)}" loading="lazy">`:`<div class="detail-addon-placeholder">${item.included?'SET':'SCREEN'}</div>`}<div><strong>${safe(label)}</strong><span>${safe(detail||'')}</span></div>${item.included?`<span class="included-badge">✓</span>`:`<button type="button" ${addon&&!addon.contactOnly?`data-bundle-add="${addon.id}"`:`data-bundle-contact="${addon?.id||''}" data-bundle-label="${safe(label)}"`} aria-label="Thêm ${safe(label)}">${addon&&!addon.contactOnly?'＋':'↗'}</button>`}</article>`}).join('');$$('[data-bundle-add]').forEach(button=>button.onclick=()=>addToCart(button.dataset.bundleAdd));$$('[data-bundle-contact]').forEach(button=>button.onclick=()=>{const addonId=button.dataset.bundleContact;if(addonId)return requestQuote(addonId);location.href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Tư vấn '+button.dataset.bundleLabel+' cho '+product.name)}`});};
 const variants=(source.variants||[]).filter(Boolean);const optionGroups=source.optionGroups||((variants.length)?[{label:'Tùy chọn sản phẩm',values:variants}]:[]);$('#productOptions').innerHTML=optionGroups.map((group,groupIndex)=>`<div class="config-group"><div class="config-heading"><span>${safe(group.label)}</span><strong data-option-selection="${groupIndex}">${safe(group.values[0]||'')}</strong></div><div class="choice-grid detail-variants" data-option-group="${groupIndex}">${group.values.map((value,index)=>`<button class="${index===0?'selected':''}" type="button" data-option-value="${safe(value)}">${safe(value)}</button>`).join('')}</div></div>`).join('');$$('[data-option-group] button').forEach(button=>button.onclick=()=>{const group=button.closest('[data-option-group]');$$('[data-option-group="'+group.dataset.optionGroup+'"] button').forEach(x=>x.classList.remove('selected'));button.classList.add('selected');$('[data-option-selection="'+group.dataset.optionGroup+'"]').textContent=button.dataset.optionValue;const profile=source.configurationProfiles?.[button.dataset.optionValue];if(profile)renderBundleItems(profile.bundleItems,profile.setTitle,source.setSubtitle);window.applyI18n?.()});
 renderBundleItems(source.bundleItems);
 renderPricedOptions(product);
 const experience=source.experience;$('#detailExperience').hidden=!experience;if(experience){$('#experienceEyebrow').textContent=experience.eyebrow;$('#experienceTitle').textContent=experience.title;$('#experienceCopy').textContent=experience.copy;$('#experienceImage').src=gallery[1]||gallery[0];$('#experienceImage').alt=`${product.name} · không gian sử dụng`;$('#featureTitle').textContent=experience.featureTitle;$('#featureGrid').innerHTML=experience.features.map(([title,copy],index)=>`<article class="pod-feature"><span>${String(index+1).padStart(2,'0')}</span><h4>${safe(title)}</h4><p>${safe(copy)}</p></article>`).join('')}
 $('#productDetail').scrollTop=0;$('#detailGallery').dataset.count=String(gallery.length);$('#productDetail').classList.add('open');$('#productDetail').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';location.hash=`product-${id}`;window.applyI18n?.();setTimeout(()=>$('#closeProductDetail').focus({preventScroll:true}),40)
}
function closeProductDetail(){activeProductId=null;activePurchaseId=null;$('#productDetail').classList.remove('open');$('#productDetail').setAttribute('aria-hidden','true');document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search+'#shop')}
function showToast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1800)}
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter)});$$('[data-filter-link]').forEach(a=>a.onclick=()=>{const filter=a.dataset.filterLink;const b=$(`.filter[data-filter="${filter}"]`);if(b)b.click();else{$$('.filter').forEach(x=>x.classList.remove('active'));renderProducts(filter)}});
$$('[data-hotspot]').forEach(button=>button.onclick=()=>openProductDetail(button.dataset.hotspot));
$('#sortProducts').onchange=e=>{activeSort=e.target.value;renderProducts()};$('#readMoreButton').onclick=()=>{const expanded=$('#expandedIntro');expanded.hidden=!expanded.hidden;$('#readMoreButton').textContent=expanded.hidden?'Đọc thêm':'Thu gọn'};
$('#cartButton').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=closeCart;$('#checkoutButton').onclick=openCheckout;$('#closeCheckout').onclick=closeCheckout;
$('#closeProductDetail').onclick=closeProductDetail;$('#detailAddButton').onclick=()=>{if(!activeProductId)return;const product=products.find(p=>p.id===activeProductId);product?.contactOnly?requestQuote(product.id):addToCart(activePurchaseId||activeProductId)};$('#detailLangToggle').onclick=()=>$('#langToggle').click();
$('.detail-brand').onclick=closeProductDetail;
$('#paymentForm').onchange=e=>{if(e.target.name==='payment'){const card=e.target.value==='card';$('#cardFields').hidden=!card;$('#bankDetails').hidden=e.target.value!=='bank';$$('#cardFields input').forEach(i=>i.required=card)}};
// Fail closed if the real checkout module is unavailable; never fabricate an order.
$('#paymentForm').onsubmit=e=>{e.preventDefault();showToast('Online ordering is unavailable. Please contact hi@tfw.space. Your cart is unchanged.');};
$('#continueShopping').onclick=()=>{closeCheckout();$('#paymentForm').reset();$('#cardFields').hidden=false;$('#bankDetails').hidden=true;$$('#cardFields input').forEach(i=>i.required=true);$('#paymentForm').hidden=false;$('#successState').hidden=true;location.hash='shop'};
function updateWorkstationConfiguration(input){
 const selected=input.value;
 const renderStates={
  'Single Desk':{src:'assets/products/sls-670-desk-actiforce.jpg',mode:'direct',transform:'none',number:'01',meta:'01 người · Không screen',alt:'Single Desk · Actiforce SLS 670 PRO'},
  'Bench':{src:'assets/products/sls-670-bench-actiforce.jpg',mode:'direct',transform:'none',number:'02',meta:'02 người · Khung bench dùng chung',alt:'Bench · Actiforce SLS 670 BENCH PRO'},
  'Single Desk + Screen':{src:'assets/configurator/single-desk-screen-reference.jpg',mode:'direct',transform:'none',number:'03',meta:'Rapidline · Cấu hình tham khảo',alt:'Single Desk + Screen · Rapidline configuration reference'},
  'Bench + Screen':{src:'assets/configurator/bench-screen-reference.jpg',mode:'direct',transform:'none',number:'04',meta:'Rapidline · Cấu hình tham khảo',alt:'Bench + Screen · Rapidline two-person configuration reference'}
 };
 const render=renderStates[selected];
 $$('.configurator-card').forEach(card=>card.classList.toggle('selected',card.contains(input)));
 if(render){const image=$('#configuratorImage');image.className=render.mode;image.src=render.src;image.style.transform=render.transform;image.alt=render.alt;$('#configuratorImageNumber').textContent=render.number;$('#configuratorImageTitle').textContent=selected;$('#configuratorImageMeta').textContent=render.meta;}
 $('#configuratorSelected').textContent=selected;
 const tabletopCount=selected.startsWith('Bench')?2:1;
 const requestBody=`Configuration: ${selected}\nStandard tabletops: ${tabletopCount} × 1400 × 700 mm (each)\nIncluded cable trays: ${tabletopCount}\nIncluded cable risers: ${tabletopCount}\nPlease confirm finishes, any optional accessories and the quotation.`;
 $('#configuratorCta').href=`mailto:hi@tfw.space?subject=${encodeURIComponent('Tư vấn cấu hình workstation · '+selected)}&body=${encodeURIComponent(requestBody)}`;
 window.applyI18n?.();
}
$$('[name="workstationConfiguration"]').forEach(input=>input.onchange=()=>updateWorkstationConfiguration(input));
updateWorkstationConfiguration($('[name="workstationConfiguration"]:checked'));
function renderSearch(q=''){const v=q.trim().toLowerCase();const featured=catalogViewProducts();const list=v?featured.filter(p=>(p.name+' '+p.category+' '+p.scope+' '+p.detail).toLowerCase().includes(v)):featured.slice(0,3);$('#searchResults').innerHTML=list.map(p=>`<button class="search-result" data-search-product="${p.id}"><strong>${p.name}</strong><br><span>${priceText(p)}</span></button>`).join('')||'<p>Không tìm thấy sản phẩm phù hợp.</p>';$$('[data-search-product]').forEach(b=>b.onclick=()=>{$('#closeSearch').click();openProductDetail(b.dataset.searchProduct)});window.applyI18n?.()}
$('#searchButton').onclick=()=>{$('#searchPanel').hidden=false;document.body.style.overflow='hidden';renderSearch();setTimeout(()=>$('#searchInput').focus(),50)};$('#closeSearch').onclick=()=>{$('#searchPanel').hidden=true;document.body.style.overflow=''};$('#searchInput').oninput=e=>renderSearch(e.target.value);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#checkout').classList.contains('open'))closeCheckout();else if($('#cartDrawer').classList.contains('open'))closeCart();else if($('#productDetail').classList.contains('open'))closeProductDetail();else if(!$('#searchPanel').hidden)$('#closeSearch').click()}});
renderProducts();renderCart();
const hashProduct=location.hash.match(/^#product-(.+)$/)?.[1];if(hashProduct)setTimeout(()=>openProductDetail(hashProduct),0);

function registerCommerceTools(){
 const context=typeof document==='undefined'?undefined:document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});
 register({name:'list_products',title:'List products',description:'List the products currently offered in the thefirstworkshop store, optionally filtered by category.',inputSchema:{type:'object',properties:{category:{type:'string',enum:['Smart Pods','Loose Furniture','Storage Solutions','System Furniture','Seatings','Monitor Arm & Docking','Glass Partition','Flooring Solutions','Acoustic Wall Panel','Accessories']}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input={}){const list=input.category?products.filter(p=>p.scope===input.category||p.category===input.category):products;return{products:list.map(({id,name,category,scope,price,contactOnly,detail})=>({id,name,category,scope,priceVnd:price,contactOnly:Boolean(contactOnly),detail}))}}});
 register({name:'add_product_to_cart',title:'Add product to cart',description:'Add a specified quantity of one priced product to the visible shopping cart.',inputSchema:{type:'object',properties:{productId:{type:'string'},quantity:{type:'integer',minimum:1,maximum:20}},required:['productId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const product=products.find(p=>p.id===input.productId);if(!product)throw new Error('Unknown productId');if(product.contactOnly)throw new Error('This product requires a quotation');const quantity=input.quantity??1;if(!Number.isInteger(quantity)||quantity<1||quantity>20)throw new Error('Quantity must be an integer from 1 to 20');cart[product.id]=(cart[product.id]||0)+quantity;saveCart();return{added:{productId:product.id,quantity},cartItemCount:cartData().reduce((sum,p)=>sum+p.qty,0),subtotalVnd:total()}}});
 register({name:'start_checkout',title:'Start checkout',description:'Open the visible checkout for the current cart. This prepares checkout but does not place or pay for an order.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(){if(!cartData().length)throw new Error('The cart is empty');openCheckout();return{status:'checkout_open',items:cartData().reduce((sum,p)=>sum+p.qty,0),totalVnd:total(),paymentMode:'order-request'}}});
}
registerCommerceTools();

