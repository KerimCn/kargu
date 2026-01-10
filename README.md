# 🚨 KARGU - Incident Management Platform

KARGU, siber güvenlik olaylarını yönetmek ve takip etmek için geliştirilmiş modern bir Incident Management Platform'udur. Case yönetimi, playbook'lar, görev takibi ve gerçek zamanlı bildirimler gibi özellikler sunar.

![KARGU](https://img.shields.io/badge/KARGU-Incident%20Management-red)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Yetkilendirme
- JWT tabanlı güvenli kimlik doğrulama
- Rol tabanlı erişim kontrolü (Admin, User)
- Oturum yönetimi

### 📋 Case Yönetimi
- Case oluşturma, düzenleme ve silme
- Case durumu takibi (Open, In Progress, Resolved)
- Case detay sayfası ile kapsamlı bilgi görüntüleme
- Case filtreleme (Tümü, Devam Eden, Tamamlanmış)

### 📝 Görev Yönetimi
- Case'lere görev atama
- Görev durumu takibi (Pending, In Progress, Completed, Failed)
- Görev detayları ve yorumlar
- Görev atama ve takip

### 📚 Playbook Yönetimi
- Playbook oluşturma ve düzenleme
- Adım adım playbook yürütme
- Checklist desteği
- Playbook execution takibi

### 💬 Yorum Sistemi
- Case'lere yorum ekleme
- Yorum düzenleme ve silme
- Gerçek zamanlı yorum takibi

### 🔔 Bildirim Sistemi
- Gerçek zamanlı bildirimler
- Okunmamış bildirim sayacı
- Bildirim kategorileri (Comment, Task, Playbook, Case)
- Bildirim geçmişi

### 📊 Dashboard
- Sistem istatistikleri
- Toplam case sayısı
- Açık case'ler
- Kritik case'ler
- Bugün çözülen case'ler

### 🤖 AI-Powered Process Tree Analysis
- OpenAI entegrasyonu ile process tree analizi
- Güvenlik tehditleri ve anomali tespiti
- Şüpheli process'lerin otomatik analizi
- Risk skorlama ve önceliklendirme
- MITRE ATT&CK framework referansları
- AI özeti yenileme ve güncelleme
- Database'de özet saklama (token tasarrufu)

### 👥 Kullanıcı Yönetimi
- Kullanıcı oluşturma ve düzenleme
- Kullanıcı listesi görüntüleme
- Rol yönetimi

### 🎨 Kullanıcı Arayüzü
- Modern ve responsive tasarım
- Dark/Light mode desteği
- Kullanıcı dostu arayüz
- Smooth animasyonlar ve geçişler

## 🛠️ Teknolojiler

### Frontend
- **React 19.2.3** - UI framework
- **React Router** - Sayfa yönlendirme
- **Lucide React** - İkon kütüphanesi
- **React Icons** - Ek ikon desteği
- **Context API** - State yönetimi (Auth, Theme)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Veritabanı
- **JWT** - Kimlik doğrulama
- **bcryptjs** - Şifre hashleme
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **OpenAI API** - AI-powered process tree analysis

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/KerimCn/kargu.git
cd kargu
```

### 2. Backend Kurulumu

```bash
cd kargu-backend
npm install
```

### 3. Backend Ortam Değişkenlerini Ayarlayın

`kargu-backend` klasöründe `.env` dosyası mevcuttur. Gerekirse kendi değerlerinizle güncelleyin:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kargu_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key_here
```

**Önemli:** 
- Production ortamında `JWT_SECRET` değerini mutlaka güçlü bir değerle değiştirin!
- `OPENAI_API_KEY` için [OpenAI Platform](https://platform.openai.com/api-keys) üzerinden API key oluşturun
- `.env` dosyası `.gitignore` içinde olduğu için repository'ye push edilmez

### 4. Veritabanını Oluşturun

PostgreSQL'de veritabanını oluşturun:

```sql
CREATE DATABASE kargu_db;
```

### 5. Backend'i Başlatın

```bash
npm start
# veya development için
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacaktır.

### 6. Frontend Kurulumu

Yeni bir terminal açın:

```bash
cd kargu-frontend
npm install
```

### 7. Frontend Ortam Değişkenlerini Ayarlayın

`kargu-frontend` klasöründe `.env` dosyası mevcuttur. İhtiyacınıza göre güncelleyin:

**Local Development için (varsayılan):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Production (Render) için:**
```env
REACT_APP_API_URL=https://kargu.onrender.com/api
```

**Vercel Deployment için:**
Vercel'de environment variable olarak ekleyin:
1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. Settings > Environment Variables bölümüne gidin
4. Yeni variable ekleyin:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://kargu.onrender.com/api`
5. Deploy'u yeniden yapın

**Not:** `.env` dosyaları repository'de örnek değerlerle bulunmaktadır. Production ortamında mutlaka güvenli değerlerle güncelleyin!

### 8. Frontend'i Başlatın

```bash
npm start
```

Frontend `http://localhost:3000` adresinde çalışacaktır.

## 🚀 Kullanım

### İlk Giriş

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Varsayılan admin kullanıcısı ile giriş yapın (veritabanında oluşturulmuş olmalı)
3. Dashboard'da sistem istatistiklerini görüntüleyin

### Case Oluşturma

1. **Cases** sayfasına gidin
2. **+ ADD CASE** butonuna tıklayın
3. Case bilgilerini doldurun
4. Case'i kaydedin

### Görev Atama

1. Bir case'in detay sayfasına gidin
2. **Tasks** sekmesine tıklayın
3. **+ ADD TASK** butonuna tıklayın
4. Görev bilgilerini doldurun ve bir kullanıcıya atayın

### Playbook Yürütme

1. Case detay sayfasında **Playbooks** sekmesine gidin
2. Mevcut playbook'ları görüntüleyin veya yeni bir playbook ekleyin
3. Playbook'u çalıştırın ve adımları takip edin

### AI Process Tree Analizi

1. Case detay sayfasında **Process** sekmesine gidin
2. Process tree verilerini görüntüleyin
3. **AI Özet** bölümünde:
   - Eğer özet yoksa **"AI'ya Sor"** butonuna tıklayın
   - Mevcut özeti yenilemek için yenileme (🔄) ikonuna tıklayın
4. AI analizi şunları içerir:
   - Genel değerlendirme ve kritik bulgular
   - Şüpheli process'ler ve risk seviyeleri
   - Anormal davranış pattern'leri
   - Acil aksiyon önerileri
   - Derinlemesine araştırma önerileri
   - Genel risk skoru (1-10)

## 📁 Proje Yapısı

```
kargu/
├── kargu-backend/          # Backend API
│   ├── config/             # Veritabanı konfigürasyonu
│   ├── controllers/        # İş mantığı kontrolcüleri
│   ├── middleware/         # Middleware'ler (auth, vb.)
│   ├── models/             # Veritabanı modelleri
│   ├── routes/             # API route'ları
│   ├── services/           # Servis katmanı
│   └── server.js           # Ana server dosyası
│
└── kargu-frontend/         # Frontend React uygulaması
    ├── public/             # Statik dosyalar
    ├── src/
    │   ├── components/    # React bileşenleri
    │   │   ├── case-detail/  # Case detay bileşenleri
    │   │   ├── cases/        # Case bileşenleri
    │   │   ├── common/       # Ortak bileşenler
    │   │   ├── tasks/        # Görev bileşenleri
    │   │   └── users/        # Kullanıcı bileşenleri
    │   ├── context/       # Context API (Auth, Theme)
    │   ├── pages/         # Sayfa bileşenleri
    │   ├── services/      # API servisleri
    │   └── styles/        # CSS stilleri
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/verify` - Token doğrulama

### Cases
- `GET /api/cases` - Tüm case'leri getir
- `GET /api/cases/:id` - Case detayını getir
- `GET /api/cases/:id/detail` - Case detay bilgileri
- `POST /api/cases` - Yeni case oluştur
- `PATCH /api/cases/:id` - Case güncelle
- `DELETE /api/cases/:id` - Case sil

### Users
- `GET /api/users` - Tüm kullanıcıları getir
- `GET /api/users/:id` - Kullanıcı detayını getir
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil

### Tasks
- `GET /api/tasks/:caseId` - Case'e ait görevleri getir
- `POST /api/tasks` - Yeni görev oluştur
- `PATCH /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

### Comments
- `GET /api/comments/:caseId` - Case'e ait yorumları getir
- `POST /api/comments` - Yeni yorum ekle
- `PUT /api/comments/:id` - Yorum güncelle
- `DELETE /api/comments/:id` - Yorum sil

### Playbooks
- `GET /api/playbooks` - Tüm playbook'ları getir
- `POST /api/playbooks` - Yeni playbook oluştur
- `PUT /api/playbooks/:id` - Playbook güncelle
- `DELETE /api/playbooks/:id` - Playbook sil

### Notifications
- `GET /api/notifications` - Tüm bildirimleri getir
- `GET /api/notifications/unread-count` - Okunmamış bildirim sayısı
- `PUT /api/notifications/:id/read` - Bildirimi okundu işaretle
- `PUT /api/notifications/read-all` - Tüm bildirimleri okundu işaretle

### AI Analysis
- `GET /api/ai/cases/:caseId/summary` - Case için AI özetini getir
- `POST /api/ai/cases/:caseId/summary` - Process tree için yeni AI özeti oluştur
  - Body: `{ "processTree": [...], "force": false }`
  - `force: true` ile mevcut özeti yeniden oluşturur

## 🎨 Özellikler Detayı

### Dark/Light Mode
- Kullanıcı tercihine göre tema seçimi
- Sistem tercihini otomatik algılama
- Tema tercihi localStorage'da saklanır
- Smooth geçiş animasyonları

### Bildirim Sistemi
- Gerçek zamanlı bildirimler
- Okunmamış bildirim sayacı
- Bildirim kategorileri
- Bildirim geçmişi görüntüleme

### Responsive Tasarım
- Mobil uyumlu arayüz
- Tablet ve desktop desteği
- Modern ve kullanıcı dostu tasarım

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Bir Pull Request oluşturun

## 📝 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 👤 Geliştirici

**Kerim**

- GitHub: [@KerimCn](https://github.com/KerimCn)

## 🙏 Teşekkürler


