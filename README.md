# .iftaryardim yazarak komutlara bakabilirsiniz. Wineryy tarafından yapıldı.


# Ramazan İftar/Sahur Bot

Discord sunucunuz için Ramazan ayında iftar ve sahur vakitlerini gösteren bot.

## Özellikler

- Türkiye'deki şehirler için iftar ve sahur vakitlerini gösterme
- Otomatik günlük vakit bildirimleri
- Ramazan sözleri
- İftar ve sahur vaktine kalan süre hesaplama
- Türkçe arayüz

## Kurulum

1. [Discord Geliştirici Portalı](https://discord.com/developers/applications)'ndan bir bot oluşturun
2. Botu sunucunuza gerekli izinlerle davet edin
3. [CollectAPI](https://collectapi.com/)'den bir hesap oluşturun ve namaz vakitleri API'si için anahtar alın
4. `.env` dosyasını düzenleyin:
   ```
   TOKEN=discord_bot_tokeniniz
   API_KEY=collectapi_anahtariniz
   ```
5. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
6. Token'ınızı test edin:
   ```
   node test-connection.js
   ```
7. Botu başlatın:
   ```
   npm start
   ```

## Token Alma Adımları

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Botunuza bir isim verin (örn. "Ramazan Bot") ve "Create" butonuna tıklayın
4. Sol menüden "Bot" sekmesine tıklayın
5. "Add Bot" butonuna tıklayın ve onaylayın
6. "Reset Token" butonuna tıklayın ve yeni token'ı kopyalayın
7. Bu token'ı `.env` dosyasındaki `TOKEN=` kısmının karşısına yapıştırın

## Botu Sunucunuza Ekleme

1. Sol menüden "OAuth2" > "URL Generator" sekmesine tıklayın
2. "Scopes" bölümünden "bot" seçeneğini işaretleyin
3. "Bot Permissions" bölümünden şu izinleri seçin:
   - Read Messages/View Channels
   - Send Messages
   - Embed Links
   - Read Message History
4. Oluşturulan URL'yi kopyalayın ve tarayıcınızda açın
5. Botu eklemek istediğiniz sunucuyu seçin ve "Authorize" butonuna tıklayın

## Kullanım

- `/iftar-kur [şehir]` - Belirtilen şehir için iftar ve sahur vakitlerini gösterir ve kanala kaydeder
- `/iftar-kaldir` - Kanaldan iftar ve sahur bildirimlerini kaldırır
- `/iftar-yardim` - Yardım menüsünü gösterir

## Gereksinimler

- Node.js v20 veya üstü
- Discord.js v14
- CollectAPI hesabı ve API anahtarı

## Sorun Giderme

- **"Invalid token" hatası alıyorsanız:** `.env` dosyasındaki token'ı Discord Developer Portal'dan aldığınız gerçek token ile değiştirin.
- **API hatası alıyorsanız:** CollectAPI anahtarınızın doğru olduğundan ve hesabınızın aktif olduğundan emin olun.
- **Şehir bulunamadı hatası alıyorsanız:** Türkçe karakter kullanımına dikkat edin ve geçerli bir şehir adı girdiğinizden emin olun.