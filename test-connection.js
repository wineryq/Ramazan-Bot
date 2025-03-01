// Simple test script to verify Discord bot token
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a minimal client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Log when ready
client.once('ready', () => {
  console.log(`✅ Bağlantı başarılı! ${client.user.tag} olarak giriş yapıldı.`);
  console.log('Token geçerli ve bot çalışıyor.');
  
  // Exit after successful connection
  setTimeout(() => {
    console.log('Test tamamlandı, çıkış yapılıyor...');
    process.exit(0);
  }, 3000);
});

// Handle connection errors
client.on('error', (error) => {
  console.error('❌ Bağlantı hatası:', error);
});

// Login with token
console.log('Discord botuna bağlanmaya çalışılıyor...');
client.login(process.env.TOKEN).catch(error => {
  console.error('❌ Giriş hatası:', error.message);
  
  if (error.code === 'TokenInvalid') {
    console.error('\n🔑 TOKEN HATASI: .env dosyasındaki TOKEN değeri geçersiz.');
    console.error('Lütfen .env dosyasını düzenleyip gerçek Discord bot tokeninizi girin:');
    console.error('TOKEN=gerçek_discord_bot_tokeniniz');
    console.error('\nDiscord Developer Portal\'dan token almanız gerekiyor:');
    console.error('https://discord.com/developers/applications\n');
  }
});