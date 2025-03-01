// Ramazan İftar/Sahur Bot
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
const croxydb = require('croxydb');
const axios = require('axios');
const moment = require('moment-timezone');
const config = require('./config.js');
require('dotenv').config();

// Zaman dilimini ayarla
moment.locale('tr');
moment.tz.setDefault(config.zamanDilimi);

// Yeni bir client oluştur
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.User
  ]
});

// Veritabanı başlatma
if (!croxydb.has('kanallar')) {
  croxydb.set('kanallar', {});
}

// Rastgele Ramazan sözü seç
function rastgeleSoz() {
  const sozler = config.ramazanSozleri;
  return sozler[Math.floor(Math.random() * sozler.length)];
}

// Hazır olduğunda
client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
  console.log(`Node.js v${process.versions.node}`);
  console.log('Ramazan İftar/Sahur Bot aktif!');
  
  // Bot durumunu ayarla
  client.user.setActivity('.iftarkur | Ramazan Mübarek', { type: 'PLAYING' });
  
  // Kayıtlı kanallara günlük vakit bilgisi gönderme
  setInterval(async () => {
    const kanallar = croxydb.get('kanallar');
    const simdi = moment();
    
    // Saat 00:01'de günlük vakit bilgisi gönder
    if (simdi.hour() === 0 && simdi.minute() === 1) {
      for (const [kanalId, sehir] of Object.entries(kanallar)) {
        const kanal = client.channels.cache.get(kanalId);
        if (kanal) {
          try {
            const vakitler = await getVakitler(sehir);
            if (vakitler) {
              const embed = createVakitEmbed(sehir, vakitler);
              kanal.send({ embeds: [embed] });
            }
          } catch (error) {
            console.error(`${sehir} için vakit bilgisi gönderilirken hata:`, error);
          }
        }
      }
    }
  }, 60000); // Her dakika kontrol et
});

// Namaz vakitlerini getir
async function getVakitler(sehir) {
  try {
    const response = await axios.get(`${config.apiUrl}?data.city=${encodeURIComponent(sehir)}`, {
      headers: config.apiHeaders
    });
    
    if (response.data && response.data.result && response.data.result.length > 0) {
      return response.data.result[0];
    }
    
    return null;
  } catch (error) {
    console.error('API hatası:', error);
    return null;
  }
}

// Vakit embed'i oluştur
function createVakitEmbed(sehir, vakitler) {
  const simdi = moment();
  const iftarVakti = moment(vakitler.iftar, 'HH:mm');
  const sahurVakti = moment(vakitler.imsak, 'HH:mm');
  
  // İftar veya sahur vaktine kalan süreyi hesapla
  let kalanSure;
  let embedRenk;
  let baslik;
  
  if (simdi.isBefore(iftarVakti) && simdi.isAfter(sahurVakti)) {
    // İftar vaktine kalan süre
    kalanSure = moment.duration(iftarVakti.diff(simdi));
    embedRenk = config.renkler.iftar;
    baslik = `🌙 ${sehir} - İftar Vakti`;
  } else {
    // Sahur vaktine kalan süre (eğer iftar geçtiyse, ertesi günün sahuruna)
    if (simdi.isAfter(iftarVakti)) {
      sahurVakti.add(1, 'day');
    }
    kalanSure = moment.duration(sahurVakti.diff(simdi));
    embedRenk = config.renkler.sahur;
    baslik = `🌅 ${sehir} - Sahur Vakti`;
  }
  
  const saatler = Math.floor(kalanSure.asHours());
  const dakikalar = Math.floor(kalanSure.minutes());
  
  const embed = new EmbedBuilder()
    .setTitle(baslik)
    .setColor(embedRenk)
    .addFields(
      { name: '📅 Tarih', value: moment().format('DD MMMM YYYY'), inline: true },
      { name: '🌅 Sahur (İmsak)', value: vakitler.imsak, inline: true },
      { name: '🌙 İftar', value: vakitler.iftar, inline: true },
      { name: '⏱️ Kalan Süre', value: `${saatler} saat ${dakikalar} dakika`, inline: false },
      { name: '💫 Ramazan Sözü', value: rastgeleSoz(), inline: false }
    )
    .setTimestamp()
    .setFooter({ text: 'Ramazan Mübarek Olsun', iconURL: client.user.displayAvatarURL() });
  
  return embed;
}

// Mesaj olayı
client.on('messageCreate', async (message) => {
  // Bot mesajlarını yoksay
  if (message.author.bot) return;
  
  // /iftar-kur komutu
  if (message.content.startsWith('.iftarkur')) {
    const args = message.content.slice('/iftar-kur'.length).trim().split(/ +/);
    const sehir = args[0];
    
    if (!sehir) {
      return message.reply('Lütfen bir şehir adı belirtin. Örnek: `/iftar-kur Ankara`');
    }
    
    // Kanalı kaydet
    const kanallar = croxydb.get('kanallar') || {};
    kanallar[message.channel.id] = sehir;
    croxydb.set('kanallar', kanallar);
    
    message.channel.send(`✅ Bu kanala ${sehir} için iftar ve sahur vakitleri gönderilecek.`);
    
    // Hemen vakit bilgisi gönder
    try {
      const vakitler = await getVakitler(sehir);
      
      if (vakitler) {
        const embed = createVakitEmbed(sehir, vakitler);
        message.channel.send({ embeds: [embed] });
      } else {
        message.reply(`❌ ${sehir} için vakit bilgisi bulunamadı. Lütfen geçerli bir şehir adı girdiğinizden emin olun.`);
      }
    } catch (error) {
      console.error('Vakit bilgisi hatası:', error);
      message.reply('❌ Vakit bilgisi alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  }
  
  // /iftar-kaldir komutu
  if (message.content === '.iftarkaldir') {
    // Yetki kontrolü
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('Bu komutu kullanmak için "Kanalları Yönet" yetkisine sahip olmanız gerekiyor.');
    }
    
    const kanallar = croxydb.get('kanallar') || {};
    
    if (kanallar[message.channel.id]) {
      delete kanallar[message.channel.id];
      croxydb.set('kanallar', kanallar);
      message.reply('✅ Bu kanal için iftar ve sahur bildirimleri kapatıldı.');
    } else {
      message.reply('❌ Bu kanalda aktif bir iftar/sahur bildirimi bulunmuyor.');
    }
  }
  
  // /iftar-yardim komutu
  if (message.content === '.iftaryardim') {
    const embed = new EmbedBuilder()
      .setTitle('🌙 Ramazan İftar/Sahur Bot - Yardım')
      .setColor('#00FF00')
      .setDescription('Ramazan ayında iftar ve sahur vakitlerini gösteren bot.')
      .addFields(
        { name: '.iftarkur [şehir]', value: 'Belirtilen şehir için iftar ve sahur vakitlerini gösterir ve kanala kaydeder.' },
        { name: '.iftarkaldir', value: 'Kanaldan iftar ve sahur bildirimlerini kaldırır.' },
        { name: '.iftaryardim', value: 'Yardım menüsünü gösterir.' }
      )
      .setTimestamp()
      .setFooter({ text: 'Ramazan Mübarek Olsun', iconURL: client.user.displayAvatarURL() });
    
    message.channel.send({ embeds: [embed] });
  }
});

// Discord'a giriş yap
client.login(config.token);