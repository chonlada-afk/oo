/**
 * ShopSabaai - Main Logic
 */

// --- Constants & State ---
const DB_VERSION = 1;
const TAX_RATE = 0; // No tax for simple shop
const SHIPPING_COST = 50; // THB
const PROMPTPAY_ID = "093-510-0632"; // Change this to your promptpay number
const PROMPTPAY_NO_HYPHEN = PROMPTPAY_ID.replace(/-/g, '');

const state = {
    users: [],
    currentUser: null,
    products: [],
    cart: [],
    orders: []
};

// --- Mock Data ---
const initialProducts = [
    // Category 1: Stationery (เครื่องเขียน)
    {
        id: 's1',
        name: 'ปากกามูจิ Muji Gel',
        price: 45,
        category: 'stationery',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkQBw4QDg0PFRQOEQ0NEBANEg8PFRIXFhkRFRMkHiggGholGxMTITEhJyorOi4uGB8zODwsNygtLisBCgoKDQ0OFw0PFisdFR03Ky0tLSstKzIrLS0uLSs3LS0tLSsrKysrKystKysrNysrKysrODcrKzcrKy0rKzcrK//AABEIAQMAwgMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABAUGAwcIAgH/xAA5EAEAAQICBgYGCQUAAAAAAAAAAQIDBBEFITRxcrESM0GBssEGEzE1UZEHIiMlMoLC0fAUQmGh4f/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAABAhH/2gAMAwEAAhEDEQA/APcQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVHpZpS9oX0cx+Jw0U1XLNHSpi5EzTNWcRriJictfxBbjxC59LHpFh8RPSowtdMRE9GbVdOffFb26JziAf0AAAAAAAAAAAAAAAAAAAAABmfpKiqr0H0tFETMzRTERTEzM53KexplNjKJqtTFPt18gfOWPw9+bleVuuc6dX1Kterc+pafww87u6Lxs4vPoTlq7Y/dvNGxNOBsRPtiBOpIAoAAAAAAAAAAAAAAAAAAAAr71Eeqie3pZd2SwQrvUxxeQI9VEZwn4SMsNb3IdeWcJuF2ejckHUBQAAAAAAAAAAAAAAAAAAAAQb3UxxeScg3upji8gcrsZUp2F2e3uQr34E3C7Pb3IjqAqgAAAAAAAAAAAAAAAAAAACBfn7P8AN7e5PQtI5UWqMtWdXkDliIyp1JuF2e3uV+Iq+zhPwmzW9yQdgFAAAAAAAAAAAAAAAAAAAABX6anLD0cXlKwVundmo4vKQZ+nH3qsX0KpzjV7WrwWvCWt0MPRP3lH5W4wOx2eGOS1I7gIoAAAAAAAAAAAAAAAAAAAArNPbNb4v0ys1Zp7Z7fF+mQZGifvON9LdYHY7PDHJg7fvSN9LeYHY7HDTyWsx3ARoAAAAAAAAAAAAAAAAAAAAVenuot8U+GVoq9P9Rb3z4ZBj7XvXvp5N7gtjscNPJgrPvXvjk3uB2Oxw08lrOXcBGgAAAAAAAAAAAAAAAAAAABVaf6m1vnwytVVp/qbW+rwgx9jXpTvjk3+C2Oxw08oYDD+9e+OTf4LY7HBT4YWs5dgEaAAAAAAAAAAAAAAAAAAAAFVp/qrW+rwrVV6djOMPxTyCshh7ddOk5mYyjOOTe4LY7HBT4YZL1Uf1d2fh+zW4PZLHDT4YWpHYBFAAAAAAAAAAAAAAAAAAAAFbpmM5w++fJZK/S9P1bNXwnL5x/wFJEROIvfzsabC7LZ4aeUMxTXM4m9nHt+EtTZp6Fm3E9kRHygSP2AKAAAAAAAAAAAAAAAAAAAAI2kaelhKv8ZVfKUl+btHrLdcT2xMfMGdw1NFeNmKf7ppz3Z62kVGjsLcpxs1XKOjTEapn45ZZf7lbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==',
        description: 'ปากกาเจลคุณภาพสูงจาก Muji ที่ให้สัมผัสการเขียนที่ลื่นไหลไม่สะดุด เหมาะสำหรับการจดบันทึกและการเรียนรู้ในทุกๆ วัน ด้วยดีไซน์ที่เรียบง่ายแบบมินิมอลช่วยให้โต๊ะทำงานของคุณดูสะอาดตา หมึกเจลสีเข้มคมชัด แห้งไว ไม่เลอะมือ ทำให้งานเขียนของคุณดูเป็นระเบียบเรียบร้อย ตัวด้ามจับกระชับมือ น้ำหนักเบา เขียนได้นานโดยไม่เมื่อยล้า',
        model: '0.5mm Black'
    },
    {
        id: 's2',
        name: 'สมุดโน้ตปกแข็ง',
        price: 120,
        category: 'stationery',
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSWITp87kI25KUJ1nI_wH7sm52HO0RL11_o3RCyiPKXTkee7MnJQMpFX2UJkb_hizsQnlr3fCPgTSu-djd286OSDzBAlLXdMjNdxdhxA6WOl4QYKhyj2ZbLu4sJ&usqp=CAc',
        description: 'สมุดโน้ตปกแข็งคุณภาพพรีเมียมที่ออกแบบมาเพื่อปกป้องบันทึกสำคัญของคุณ ภายในใช้กระดาษถนอมสายตาหนา 100 แผ่น ช่วยลดแสงสะท้อนและทำให้เขียนได้สบายตามากขึ้น เข้าเล่มแบบเย็บกี่ที่แข็งแรงทนทาน สามารถกางออกได้ 180 องศา สะดวกต่อการเขียน เส้นบรรทัดพิมพ์ด้วยหมึกสีอ่อนที่ไม่รบกวนสายตา เหมาะสำหรับใช้เป็นไดอารี่หรือสมุดจดงาน',
        model: 'A5 Grid'
    },
    {
        id: 's3',
        name: 'กล่องดินสอพาสเทล',
        price: 89,
        category: 'stationery',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAeEm3JP4C-A-1MCNKSjPHf8bsSqV6TJGS_A&s',
        description: 'กล่องดินสอสีพาสเทลสุดน่ารักที่จะเพิ่มความสดใสให้กับวันเรียนของคุณ ทำจากวัสดุพลาสติกคุณภาพดีที่มีความทนทานและทำความสะอาดง่าย ออกแบบมาให้มีพื้นที่จัดเก็บกว้างขวาง สามารถใส่ปากกา ดินสอ ยางลบ และไม้บรรทัดได้อย่างครบครัน ฝาเปิดปิดง่ายพร้อมตัวล็อคที่แน่นหนาป้องกันของตกหล่น ขนาดกะทัดรัดพกพาสะดวก ใส่ในกระเป๋าเป้ได้ไม่กินที่',
        model: 'Pink Pastel'
    },
    {
        id: 's4',
        name: 'ชุดไฮไลท์ 6 สี',
        price: 150,
        category: 'stationery',
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ6Y99Ex0-IelJO2q_sW0_Uf8vaWSYXCumTlzg8R5A8g1WR8GYoZeVdQuVZxEIv_t-GusfJA4PsGpzqhqv-8kNw63Z-s7qUn4bxMPPD9Ps1smMIoy9Kqm8pAX770dgLWysc5KCAqA&usqp=CAc',
        description: 'Deli Highlighter ลาย SpongeBob Squarepants ลิขสิทธิ์แท้ ในชุดมี 6 สีโทนนีออน ได้แก่ เหลือง, ส้ม, ชมพู, ม่วง, เขียว, ฟ้า  มีคุณสมบัติหมึกแห้งเร็ว ไม่เลอะกระดาษ และน้ำหมึกเยอะใช้งานได้นาน  ปลายหัวตัดขนาด 1-5 มม. จับถนัดมือและพกพาสะดวก   เป็นปากกาแบบปลอก 2 หัว มีทั้งหัวแหลมและหัวตัดในด้ามเดียว',
        model: 'Soft Color Set'
    },
    {
        id: 's5',
        name: 'เทปตกแต่ง Washi',
        price: 35,
        category: 'stationery',
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR-6XEqEltXP_wfXLiMXYMEGFTn7Z3CWi_54JU-toXwbhJu8Akk4xQwi5Rh6tffTGzlADplOHxIKYAz1hTPRwvffyMTeFAT6gqlSjNWTz-n2Bhnk6tRU9CT-X46&usqp=CAc',
        description: 'เทปตกแต่ง Washi Tape ลวดลายน่ารักที่ช่วยเพิ่มความคิดสร้างสรรค์ให้กับงานฝีมือของคุณ ผลิตจากกระดาษญี่ปุ่นคุณภาพดีที่ฉีกได้ด้วยมือและลอกออกได้โดยไม่ทิ้งคราบกาว เหมาะสำหรับใช้ตกแต่งสมุดบันทึก แพลนเนอร์ การ์ดอวยพร หรือแม้แต่ของใช้ส่วนตัว มีลวดลายให้เลือกหลากหลาย ทั้งลายสัตว์น่ารัก ลายดอกไม้ และลายกราฟิกเก๋ๆ ม้วนยาวจุใจใช้ได้นาน',
        model: 'Cute Animals'
    },

    // Category 2: Daily Use (ของใช้)
    {
        id: 'd1',
        name: 'แก้วเก็บความเย็น',
        price: 290,
        category: 'daily',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh5NcDqkJX4Mi7liNnOOc_TvE0BaN_cCbLMg&s',
        description: 'แก้วเก็บความเย็นคุณภาพสูงที่สามารถเก็บอุณหภูมิได้ยาวนานถึง 24 ชั่วโมง ผลิตจากสแตนเลส Food Grade ที่ปลอดภัยต่อสุขภาพและไม่เป็นสนิม ผนังสูญญากาศสองชั้นช่วยป้องกันไม่ให้ไอน้ำเกาะรอบแก้ว ไม่ทำให้โต๊ะเปียกเลอะเทอะ มาพร้อมฝาปิดแบบกันหกและช่องใส่หลอดที่สะดวกสบาย ดีไซน์เรียบหรูทันสมัย พกพาไปได้ทุกที่ ไม่ว่าจะทำงาน เรียน หรือท่องเที่ยว',
        model: 'Tumbler 30oz'
    },
    {
        id: 'd2',
        name: 'กระเป๋าผ้าแคนวาส',
        price: 199,
        category: 'daily',
        image: 'https://img.lazcdn.com/g/p/37513c26fe6e7badf16fe144b8751e51.jpg_720x720q80.jpg',
        description: 'กระเป๋าผ้าแคนวาสเนื้อหนาที่ออกแบบมาเพื่อความทนทานและการใช้งานที่คุ้มค่า ตัดเย็บอย่างประณีตด้วยด้ายคุณภาพสูง รองรับน้ำหนักได้ดี สามารถใส่สมุด หนังสือ คอมพิวเตอร์แล็ปท็อป และของใช้ส่วนตัวได้จุใจ สายสะพายมีความยาวพอเหมาะ ไม่เจ็บไหล่เมื่อสะพายนานๆ ดีไซน์มินิมอลสีขาวสะอาดตา แมทช์ได้กับทุกชุดและทุกโอกาส ช่วยลดโลกร้อนแทนถุงพลาสติก',
        model: 'Minimal White'
    },
    {
        id: 'd3',
        name: 'ร่มพับ 3 ตอน',
        price: 159,
        category: 'daily',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgyZk5tqGPYajhwRikDyFPT-B42H2Q3LA_PA&s',
        description: 'ร่มพับ 3 ตอนน้ำหนักเบาที่เหมาะสำหรับการพกพาติดกระเป๋าไปทุกที่ โครงสร้างทำจากอลูมิเนียมและไฟเบอร์กลาสที่แข็งแรง สามารถต้านทานลมแรงได้โดยไม่หักงอ ผ้าร่มเคลือบสารกัน UV ช่วยปกป้องผิวจากแสงแดดจัดและกันน้ำฝนได้อย่างดีเยี่ยม ด้ามจับออกแบบมาให้กระชับมือพร้อมสายคล้องข้อมือ เมื่อพับเก็บจะมีขนาดเล็กกะทัดรัด ไม่เปลืองเนื้อที่ในกระเป๋า',
        model: 'UV Protect'
    },
    {
        id: 'd4',
        name: 'กล่องข้าว 2 ชั้น',
        price: 250,
        category: 'daily',
        image: 'https://www.memberplus.co.th/premium/wp-content/uploads/2019/08/eco.jpg',
        description: 'กล่องข้าว 2 ชั้นดีไซน์ทันสมัยที่ช่วยให้คุณแบ่งสัดส่วนอาหารได้อย่างลงตัว ผลิตจากวัสดุ PP Food Grade หนาพิเศษที่ทนความร้อน สามารถนำเข้าไมโครเวฟได้โดยปลอดภัย ฝาปิดมียางซิลิโคนกันรั่วซึม มั่นใจได้ว่าน้ำแกงจะไม่หกเลอะเทอะ มาพร้อมช้อนส้อมในตัวและสายรัดกล่องที่แน่นหนา เหมาะสำหรับพนักงานออฟฟิศ นักเรียน หรือผู้ที่ต้องการคุมอาหาร',
        model: 'Bento Box'
    },
    {
        id: 'd5',
        name: 'หมอนรองคอ',
        price: 180,
        category: 'daily',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh-SsdWXYgjfYshBbDTGC_zKdkEQqwVO_T2A&s',
        description: 'หมอนรองคอเมมโมรี่โฟมคุณภาพเยี่ยมที่ออกแบบตามสรีรศาสตร์ ช่วยรองรับคอและศีรษะได้อย่างนุ่มนวล ลดอาการปวดเมื่อยจากการนั่งนานๆ ตัวเมมโมรี่โฟมมีความยืดหยุ่นสูง คืนตัวได้ดี ไม่ยุบตัวง่าย ปลอกหมอนทำจากผ้ากำมะหยี่เนื้อนุ่มระบายอากาศได้ดี สามารถถอดซักทำความสะอาดได้ เหมาะสำหรับการเดินทางไกล นั่งเครื่องบิน หรือใช้งีบพักผ่อนในออฟฟิศ',
        model: 'Travel Pillow'
    },

    // Category 3: Decoration (ของตกแต่ง)
    {
        id: 'h1',
        name: 'โคมไฟดวงจันทร์',
        price: 320,
        category: 'decoration',
        image: 'https://sc04.alicdn.com/kf/H7c9cba7715034ca193b2efdde650c20bz.jpg',
        description: 'โคมไฟรูปดวงจันทร์ 3 มิติที่จะเนรมิตบรรยากาศห้องของคุณให้ดูโรแมนติกและอบอุ่น ผิวสัมผัสจำลองพื้นผิวดวงจันทร์จริงได้อย่างสวยงามสมจริง สามารถปรับแสงได้ 3 ระดับ ทั้งแสงสีขาว แสงสีส้ม และแสงสีเหลืองนวล ควบคุมการทำงานด้วยระบบสัมผัสที่ใช้งานง่าย มาพร้อมขาตั้งไม้ดีไซน์เก๋ ใช้งานได้ทั้งแบบเสียบสายและไร้สาย เป็นของขวัญที่ประทับใจผู้รับแน่นอน',
        model: '3D Moon Light'
    },
    {
        id: 'h2',
        name: 'แจกันเซรามิก',
        price: 129,
        category: 'decoration',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXxyKCASaAwkm1colhOS4fMxAP8cpnvxOoeA&s',
        description: 'แจกันเซรามิกสีขาวรูปทรงมินิมอลสไตล์นอร์ดิก ที่จะช่วยเพิ่มความหรูหราให้กับมุมห้องของคุณ ผิวสัมผัสแบบด้านให้ความรู้สึกเรียบง่ายแต่ดูดี เหมาะสำหรับใส่ดอกไม้แห้ง กิ่งไม้ หรือดอกไม้สด เพื่อเพิ่มพื้นที่สีเขียวและความสดชื่นในบ้าน วางตกแต่งได้ทั้งบนโต๊ะทำงาน ชั้นวางของ หรือโต๊ะข้างเตียง งานแฮนด์เมดคุณภาพดีที่มีเอกลักษณ์เฉพาะตัวในแต่ละชิ้น',
        model: 'Nordic White'
    },
    {
        id: 'h3',
        name: 'นาฬิกาตั้งโต๊ะ',
        price: 199,
        category: 'decoration',
        image: 'https://img.lazcdn.com/g/p/6a3b6ed3e0e903889495c97d0f91b951.jpg_720x720q80.jpg',
        description: 'นาฬิกาดิจิตอล LED ดีไซน์ลายไม้ที่ผสมผสานความทันสมัยกับธรรมชาติได้อย่างลงตัว หน้าจอแสดงผลขนาดใหญ่เห็นชัดเจน บอกเวลา วันที่ และอุณหภูมิได้ในเครื่องเดียว สามารถตั้งปลุกได้ 3 เวลาและมีโหมดประหยัดพลังงานที่จะดับหน้าจออัตโนมัติเมื่อไม่มีเสียงรบกวน ใช้งานได้ทั้งแบบใส่ถ่านและเสียบสาย USB เหมาะสำหรับตกแต่งห้องนอนหรือโต๊ะทำงานให้ดูโมเดิร์น',
        model: 'Wooden Style'
    },
    {
        id: 'h4',
        name: 'ต้นไม้ปลอม มอนสเตอร่า',
        price: 450,
        category: 'decoration',
        image: 'https://homehub.co.th/wp-content/uploads/2021/12/9007022173891.jpeg',
        description: 'ต้นมอนสเตอร่าปลอมขนาด 70 ซม. ที่สวยงามเหมือนจริงจนแทบแยกไม่ออก ใบทำจากพลาสติกเกรดพรีเมียมที่มีรายละเอียดเส้นใบชัดเจน สีเขียวสดใสช่วยพักสายตาและเพิ่มความสดชื่นให้กับห้อง ไม่ต้องกังวลเรื่องการรดน้ำ ใส่ปุ๋ย หรือแมลงรบกวน เหมาะสำหรับผู้ที่ไม่มีเวลาดูแลต้นไม้แต่ชื่นชอบธรรมชาติ มาพร้อมกระถางสีดำเรียบง่ายที่เข้าได้กับการตกแต่งทุกสไตล์',
        model: '70cm Pot'
    },
    {
        id: 'h5',
        name: 'พรมแต่งห้อง',
        price: 250,
        category: 'decoration',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpW6svzye7b4TGn4DFAdQPRFDf6sxhnlc1Tg&s',
        description: 'พรมปูพื้นขนยาวนุ่มฟูที่จะเปลี่ยนพื้นห้องแข็งๆ ให้กลายเป็นมุมพักผ่อนแสนสบาย ผลิตจากเส้นใยสังเคราะห์คุณภาพดีที่ให้สัมผัสนุ่มละมุนเท้า ขนพรมแน่นไม่หลุดร่วงง่าย ด้านล่างมีเม็ดกันลื่นช่วยยึดเกาะกับพื้นได้ดี ป้องกันการลื่นไถล ทำความสะอาดง่ายด้วยเครื่องดูดฝุ่นหรือซักมือ เหมาะสำหรับวางหน้าเตียงนอน ห้องนั่งเล่น หรือห้องแต่งตัวเพื่อเพิ่มความอบอุ่น',
        model: 'Fluffy Rug'
    }
];

// --- Initialization ---
function initApp() {
    loadData();
    setupEventListeners();
    updateAuthUI();

    // Check hash for initial routing
    const hash = window.location.hash.slice(1);
    if (hash) {
        navigate(hash);
    } else {
        navigate('home');
    }

    renderProducts();
}

function loadData() {
    // Users
    const storedUsers = localStorage.getItem('sabaai_users');
    if (storedUsers) state.users = JSON.parse(storedUsers);

    // Products - Load from LocalStorage to allow Admin updates
    const storedProducts = localStorage.getItem('sabaai_products');
    if (storedProducts) {
        state.products = JSON.parse(storedProducts);
    } else {
        state.products = initialProducts;
        localStorage.setItem('sabaai_products', JSON.stringify(state.products));
    }

    // Current User
    const simpleUser = sessionStorage.getItem('sabaai_current_user');
    if (simpleUser) state.currentUser = JSON.parse(simpleUser);

    // Orders
    const storedOrders = localStorage.getItem('sabaai_orders');
    if (storedOrders) state.orders = JSON.parse(storedOrders);

    // Cart
    const storedCart = localStorage.getItem('sabaai_cart');
    if (storedCart) state.cart = JSON.parse(storedCart);
}

function saveData(key) {
    if (key === 'users') localStorage.setItem('sabaai_users', JSON.stringify(state.users));
    if (key === 'orders') localStorage.setItem('sabaai_orders', JSON.stringify(state.orders));
    if (key === 'cart') localStorage.setItem('sabaai_cart', JSON.stringify(state.cart));
    if (key === 'products') localStorage.setItem('sabaai_products', JSON.stringify(state.products));
}

// --- Navigation ---
function navigate(pageId, param = null) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('fade-in');
    });

    // Guards
    if (['checkout', 'profile'].includes(pageId) && !state.currentUser) {
        showToast('กรุณาเข้าสู่ระบบก่อนดำเนินการต่อ', 'error');
        navigate('login');
        return;
    }

    // Show target
    const target = document.getElementById(pageId + '-page');
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
        window.location.hash = pageId;
        window.scrollTo(0, 0);

        // Specific page renderers
        if (pageId === 'cart') renderCart();
        if (pageId === 'profile') renderOrders();
        if (pageId === 'checkout') renderCheckout();
        if (pageId === 'shop') renderProducts(param);
    }
}

// --- Auth System ---
function register(e) {
    e.preventDefault();
    const form = e.target;
    // Fix: Login overlapping text issues addressed in CSS, here just logic
    const newUser = {
        id: 'u_' + Date.now(),
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        password: form.password.value, // In real app, hash this!
    };

    if (state.users.find(u => u.email === newUser.email)) {
        showToast('อีเมลนี้ถูกใช้งานแล้ว', 'error');
        return;
    }

    state.users.push(newUser);
    saveData('users');
    showToast('สมัครสมาชิกจำเร็จ! กรุณาเข้าสู่ระบบ');
    navigate('login');
}

function login(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // Admin Login Check
    if (email === 'admin@admin.com' && password === '123') {
        const adminUser = { id: 'admin', name: 'Admin', email: 'admin@admin.com', role: 'admin' };
        sessionStorage.setItem('sabaai_current_user', JSON.stringify(adminUser));
        window.location.href = 'admin.html';
        return;
    }

    const user = state.users.find(u => u.email === email && u.password === password);

    if (user || (email === 'test@test.com' && password === '1234')) { // Backdoor for easy testing
        state.currentUser = user || { id: 'test', name: 'Test User', email: 'test@test.com', phone: '0812345678' };
        sessionStorage.setItem('sabaai_current_user', JSON.stringify(state.currentUser));
        updateAuthUI();
        showToast(`ยินดีต้อนรับคุณ ${state.currentUser.name}`);
        navigate('home');
    } else {
        showToast('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
}

function logout() {
    state.currentUser = null;
    sessionStorage.removeItem('sabaai_current_user');
    updateAuthUI();
    navigate('home');
    showToast('ออกจากระบบแล้ว');
}

function updateAuthUI() {
    const loggedInEls = document.querySelectorAll('.auth-logged-in');
    const loggedOutEls = document.querySelectorAll('.auth-logged-out');

    if (state.currentUser) {
        loggedInEls.forEach(el => el.classList.remove('hidden'));
        loggedOutEls.forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.user-name-display').forEach(el => el.textContent = state.currentUser.name);

        // Show Admin Button if admin
        const adminEls = document.querySelectorAll('.admin-only');
        if (state.currentUser.role === 'admin') {
            adminEls.forEach(el => el.classList.remove('hidden'));
        } else {
            adminEls.forEach(el => el.classList.add('hidden'));
        }
    } else {
        loggedInEls.forEach(el => el.classList.add('hidden'));
        loggedOutEls.forEach(el => el.classList.remove('hidden'));
    }
}

// --- Product System ---
function renderProducts(filter = null) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    // Group products by category
    let categories = [
        { id: 'stationery', name: 'เครื่องเขียน' },
        { id: 'daily', name: 'ของใช้' },
        { id: 'decoration', name: 'ของตกแต่ง' }
    ];

    // Filter categories if a specific filter is provided
    if (filter && filter !== 'all') {
        categories = categories.filter(c => c.id === filter);
    }

    container.innerHTML = categories.map(cat => {
        const productsInCat = state.products.filter(p => p.category === cat.id);
        if (productsInCat.length === 0) return '';

        let gridContent = productsInCat.map(p => `
            <div class="product-card bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex flex-col h-full cursor-pointer p-2" onclick="showProductDetail('${p.id}')">
                <div class="h-48 overflow-hidden rounded-xl bg-gray-100 relative group">
                    <img src="${p.image}" class="w-full h-full object-cover transition-transform group-hover:scale-110" alt="${p.name}">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                </div>
                <div class="p-3 flex-1 flex flex-col">
                    <div class="text-xs text-purple-500 font-bold mb-1 uppercase tracking-wider">${categoryName(p.category)}</div>
                    <h3 class="font-bold text-gray-800 text-lg mb-1 leading-tight">${p.name}</h3>
                    <div class="mt-auto pt-3 flex items-center justify-between">
                        <span class="text-xl font-bold text-purple-600">฿${p.price}</span>
                        <button onclick="event.stopPropagation(); addToCart('${p.id}')" class="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="category-section mb-12">
                <div class="flex items-center mb-6 pl-2">
                     <div class="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                     <h3 class="text-2xl font-bold text-gray-800">${cat.name}</h3>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${gridContent}
                </div>
            </div>
        `;
    }).join('');

    // Should update title based on filter?
    const titleEl = document.querySelector('#shop-page h2');
    if (titleEl) {
        if (filter && filter !== 'all') {
            const catName = categories[0].name;
            titleEl.innerHTML = `<i class="fa-solid fa-layer-group text-purple-500 mr-2"></i>หมวดหมู่: ${catName}`;
        } else {
            titleEl.innerHTML = 'สินค้าทั้งหมด';
        }
    }
}

function showProductDetail(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById('detail-img').src = p.image;
    document.getElementById('detail-category').innerText = categoryName(p.category);
    document.getElementById('detail-name').innerText = p.name;
    document.getElementById('detail-model').innerText = 'รุ่น: ' + p.model;
    document.getElementById('detail-desc').innerText = p.description;
    document.getElementById('detail-price').innerText = `฿${p.price}`;

    // Set Add to Cart button logic
    const btn = document.getElementById('detail-add-btn');
    btn.onclick = () => {
        addToCart(p.id);
        navigate('cart');
    };

    navigate('product-detail');
}

function categoryName(cat) {
    const map = { 'stationery': 'เครื่องเขียน', 'daily': 'ของใช้', 'decoration': 'ของตกแต่ง' };
    return map[cat] || cat;
}

// --- Cart System ---
function addToCart(productId) {
    const existing = state.cart.find(i => i.productId === productId);
    if (existing) {
        existing.qty++;
    } else {
        state.cart.push({ productId, qty: 1 });
    }
    saveData('cart');
    updateCartIcon();
    showToast('เพิ่มสินค้าลงตะกร้าแล้ว');
}

function updateCartIcon() {
    const count = state.cart.reduce((a, b) => a + b.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = count);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (state.cart.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-gray-400">ตะกร้าว่างเปล่า <br> <a href="#shop" onclick="navigate(\'shop\')" class="text-purple-500 underline">ไปช้อปกันเถอะ</a></div>';
        document.getElementById('cart-total').innerText = '0';
        return;
    }

    let total = 0;
    container.innerHTML = state.cart.map((item, idx) => {
        const p = state.products.find(x => x.id === item.productId);
        if (!p) return '';
        const lineTotal = p.price * item.qty;
        total += lineTotal;
        return `
            <div class="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm mb-3">
                <img src="${p.image}" class="w-16 h-16 rounded-lg object-cover bg-gray-100">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-700">${p.name}</h4>
                    <p class="text-sm text-gray-500">รุ่น: ${p.model}</p>
                    <div class="text-purple-600 font-bold">฿${p.price}</div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateCartQty(${idx}, -1)" class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">-</button>
                    <span class="w-6 text-center font-bold">${item.qty}</span>
                    <button onclick="updateCartQty(${idx}, 1)" class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">+</button>
                </div>
                <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-600 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = total;
}

function updateCartQty(idx, change) {
    if (state.cart[idx].qty + change <= 0) {
        removeFromCart(idx);
    } else {
        state.cart[idx].qty += change;
        saveData('cart');
        renderCart();
        updateCartIcon();
    }
}

function removeFromCart(idx) {
    state.cart.splice(idx, 1);
    saveData('cart');
    renderCart();
    updateCartIcon();
}

// --- Checkout System ---
function renderCheckout() {
    const total = state.cart.reduce((sum, item) => {
        const p = state.products.find(x => x.id === item.productId);
        return sum + (p ? p.price * item.qty : 0);
    }, 0);
    const grandTotal = total + SHIPPING_COST;

    document.getElementById('checkout-subtotal').innerText = total;
    document.getElementById('checkout-shipping').innerText = SHIPPING_COST;
    document.getElementById('checkout-grand-total').innerText = grandTotal;

    // Pre-fill user data
    if (state.currentUser) {
        document.getElementById('addr-name').value = state.currentUser.name;
        document.getElementById('addr-phone').value = state.currentUser.phone;
    }

    // Initialize QR Code with correct amount
    // Assuming PROMPTPAY_NO_HYPHEN is defined at top of file
    if (document.getElementById('qr-image')) {
        document.getElementById('qr-image').src = `https://promptpay.io/${PROMPTPAY_NO_HYPHEN}/${grandTotal}.png`;
        document.getElementById('promptpay-display').innerText = PROMPTPAY_ID;
    }

    // Ensure visibility toggle works on initial load
    togglePaymentMethod();
}

function togglePaymentMethod() {
    const radios = document.getElementsByName('payment');
    const infoDiv = document.getElementById('payment-transfer-info');
    let selected = 'transfer';
    radios.forEach(r => { if (r.checked) selected = r.value; });

    if (selected === 'transfer') {
        infoDiv.classList.remove('hidden');
    } else {
        infoDiv.classList.add('hidden');
    }
}

function placeOrder(e) {
    e.preventDefault();
    if (state.cart.length === 0) {
        showToast('ตะกร้าสินค้าว่างเปล่า', 'error');
        return;
    }

    if (!state.currentUser) {
        showToast('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ', 'error');
        navigate('login');
        return;
    }

    try {
        const form = e.target;

        const nameEl = document.getElementById('addr-name');
        const phoneEl = document.getElementById('addr-phone');

        if (!nameEl || !phoneEl) throw new Error('Input fields not found');

        const nameVal = nameEl.value;
        const phoneVal = phoneEl.value;

        const grandTotalEl = document.getElementById('checkout-grand-total');
        const grandTotal = grandTotalEl ? parseInt(grandTotalEl.innerText.replace(/[^0-9]/g, '')) : 0;

        // Handle Slip
        let slipName = null;
        const paymentMethodSource = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = paymentMethodSource ? paymentMethodSource.value : 'transfer';

        if (paymentMethod === 'transfer') {
            const slipInput = document.getElementById('payment-slip');
            if (slipInput && slipInput.files.length > 0) {
                // In a real app we would upload this. Here we just fake saving the name.
                slipName = slipInput.files[0].name;
            }
        }

        const orderData = {
            id: 'ORDER-' + Date.now().toString().slice(-6),
            userId: state.currentUser.id,
            date: new Date().toISOString(),
            items: [...state.cart],
            shippingAddress: form.address.value,
            paymentMethod: paymentMethod,
            status: 'pending',
            total: grandTotal,
            shippingName: nameVal,
            shippingPhone: phoneVal,
            slip: slipName
        };

        state.orders.unshift(orderData);
        state.cart = []; // Clear cart
        saveData('orders');
        saveData('cart');
        updateCartIcon();

        showToast('สั่งซื้อเรียบร้อย! ขอบคุณที่ใช้บริการ');

        setTimeout(() => {
            navigate('profile');
        }, 300);

    } catch (err) {
        console.error('Order placement failed:', err);
        showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    }
}

// --- Profile / Orders System ---
function renderOrders() {
    const container = document.getElementById('order-history');
    if (!container) return; // Guard

    // Check login
    if (!state.currentUser) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">กรุณาเข้าสู่ระบบ</div>';
        return;
    }

    const myOrders = state.orders.filter(o => o.userId === state.currentUser.id);

    if (myOrders.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">คุณยังไม่มีประวัติการสั่งซื้อ</div>';
        return;
    }

    container.innerHTML = myOrders.map(order => {
        const dateStr = new Date(order.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Check for slip
        const slipHtml = order.slip ? `<div class="text-xs text-green-600 mt-1"><i class="fa-solid fa-paperclip"></i> แนบสลิปแล้ว: ${order.slip}</div>` : '';

        return `
            <div class="bg-white rounded-xl shadow-sm border border-purple-100 p-4 mb-4">
                <div class="flex justify-between items-start border-b border-gray-100 pb-2 mb-2">
                    <div>
                        <span class="font-bold text-purple-600 block">#${order.id}</span>
                        <span class="text-xs text-gray-500">${dateStr}</span>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-2 py-1 rounded text-xs font-bold ${getStatusBadge(order.status)}">
                            ${getStatusText(order.status)}
                        </span>
                    </div>
                </div>
                <div class="mb-3">
                     ${order.items.map(item => {
            const p = state.products.find(x => x.id === item.productId);
            return `<div class="flex justify-between text-sm text-gray-600 py-1"><span>${p ? p.name : 'Unknown'} x ${item.qty}</span></div>`;
        }).join('')}
                     ${slipHtml}
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div class="font-bold text-lg">ยอดรวม ฿${order.total}</div>
                    ${order.status === 'pending' ?
                `<button onclick="confirmCancelOrder('${order.id}', this)" class="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-bold transition">ยกเลิกคำสั่งซื้อ</button>`
                : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getStatusBadge(status) {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
}
function getStatusText(status) {
    if (status === 'pending') return 'รอโอน/รอตรวจสอบ';
    if (status === 'cancelled') return 'ยกเลิกแล้ว';
    return 'สำเร็จ';
}

function confirmCancelOrder(id, btn) {
    if (btn.dataset.confirm === 'true') {
        cancelOrder(id);
    } else {
        btn.dataset.confirm = 'true';
        btn.textContent = 'ยืนยันการยกเลิก?';
        btn.className = 'bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold transition shadow-md';

        // Auto reset button state after 3 seconds if not confirmed
        setTimeout(() => {
            if (btn && btn.isConnected) { // Check if element still exists
                btn.dataset.confirm = 'false';
                btn.textContent = 'ยกเลิกคำสั่งซื้อ';
                btn.className = 'bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-bold transition';
            }
        }, 3000);
    }
}

function cancelOrder(id) {
    const order = state.orders.find(o => o.id === id);
    if (order) {
        order.status = 'cancelled';
        saveData('orders');
        renderOrders();
        showToast('ยกเลิกคำสั่งซื้อ เรียบร้อยแล้ว');
    } else {
        showToast('ไม่พบคำสั่งซื้อ', 'error');
    }
}

// --- Utilities ---
function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast show ${type === 'error' ? 'border-red-500' : 'border-purple-500'}`;
    toast.innerHTML = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function setupEventListeners() {
    // Nav
    document.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(el.dataset.nav);
        });
    });

    // Mobile Menu Toggle (Sidebar)
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('close-mobile-menu');

    function toggleMenu(show) {
        if (show) {
            menu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const isOpen = menu && menu.classList.contains('active');
            toggleMenu(!isOpen);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleMenu(false));
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close menu when clicking a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

}

// Global exposure for HTML onclick attributes
window.navigate = navigate;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.showProductDetail = showProductDetail;
window.register = register;
window.login = login;
window.logout = logout;
window.placeOrder = placeOrder;
window.cancelOrder = cancelOrder;
window.confirmCancelOrder = confirmCancelOrder;
window.togglePaymentMethod = togglePaymentMethod;
window.togglePassword = togglePassword;

// Start
document.addEventListener('DOMContentLoaded', initApp);
