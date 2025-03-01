module.exports = {
  // Bot yapılandırması
  token: "TOKEN_GIR", // Bot token'ı 
  
  // API yapılandırması
  apiUrl: "ApiUrl_Gir", // Namaz vakitleri API'si
  apiHeaders: {
    "content-type": "application/json",
    "authorization": "API_GIR" // API anahtarı 
  },
  
  // Embed renkleri
  renkler: {
    iftar: "#FF9933", // Turuncu
    sahur: "#3366FF", // Mavi
    hata: "#FF0000"   // Kırmızı
  },
  
  // Ramazan sözleri
  ramazanSozleri: [
    "Ramazan, sabır ayıdır. Sabreden, mükafatını sınırsız alır.",
    "Rahmet, mağfiret ve cehennemden kurtuluş ayı olan Ramazan-ı Şerif'iniz mübarek olsun.",
    "Ramazan, kalplerin arındığı aydır.",
    "Oruç bir kalkandır. Kötülüklerden ve günahlardan korur.",
    "Ramazan ayı, on bir ayın sultanıdır.",
    "Kim inanarak ve sevabını Allah'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.",
    "Ramazan ayı geldiği zaman cennet kapıları açılır, cehennem kapıları kapanır ve şeytanlar zincire vurulur.",
    "Oruç tutmak, sabır eğitimidir.",
    "İftar vakti, duaların kabul olduğu mübarek bir vakittir.",
    "Ramazan, Kur'an ayıdır. Kur'an, Ramazan ayında indirilmeye başlanmıştır.",
    "Ramazan, yardımlaşma ve dayanışma ayıdır.",
    "Oruç, nefsi terbiye eder ve iradeyi güçlendirir.",
    "Ramazan, berekettir, rahmettir, mağfirettir.",
    "Sahur berekettir, sahura kalkmayı ihmal etmeyin.",
    "Ramazan, infak ayıdır. Veren el, alan elden üstündür."
  ],
  
  // Zaman dilimi
  zamanDilimi: "Europe/Istanbul"
};