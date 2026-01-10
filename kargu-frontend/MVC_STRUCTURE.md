# MVC Yapısı Dokümantasyonu

Bu proje, backend'teki MVC yapısına benzer şekilde frontend'te de MVC (Model-View-Controller) mimarisi kullanmaktadır.

## Klasör Yapısı

```
src/
├── models/          # Veri modelleri ve validasyonlar
├── controllers/     # İş mantığı (business logic)
├── services/        # API çağrıları
├── components/      # UI bileşenleri (View)
├── pages/           # Sayfa bileşenleri (View)
└── context/         # React Context'ler
```

## Model Katmanı (`models/`)

Model katmanı, veri doğrulama, dönüştürme ve formatlama işlemlerini içerir.

### Özellikler:
- **Validasyon**: Veri girişlerini doğrular
- **Transformasyon**: API'ye gönderilecek veriyi dönüştürür
- **Formatlama**: API'den gelen veriyi görüntüleme için formatlar

### Örnek Kullanım:

```javascript
import { validateCase, transformCaseForAPI, formatCase } from '../models/caseModel';

// Validasyon
const validation = validateCase(caseData);
if (!validation.isValid) {
  console.error(validation.errors);
}

// API için dönüştürme
const apiData = transformCaseForAPI(caseData);

// Görüntüleme için formatlama
const formatted = formatCase(caseData);
```

## Controller Katmanı (`controllers/`)

Controller katmanı, tüm iş mantığını içerir. API çağrılarını yönetir, veri işleme yapar ve sonuçları döndürür.

### Özellikler:
- **API Yönetimi**: Service katmanı üzerinden API çağrıları yapar
- **Hata Yönetimi**: Hataları yakalar ve standart formatta döndürür
- **Veri Filtreleme**: Listeleme ve arama işlemleri
- **İş Kuralları**: Business logic uygular

### Örnek Kullanım:

```javascript
import { CaseController } from '../controllers/caseController';

// Tüm case'leri getir
const result = await CaseController.getAllCases();
if (result.success) {
  setCases(result.data);
} else {
  alert(result.error);
}

// Case oluştur
const createResult = await CaseController.createCase(formData, file);
if (createResult.success) {
  // Başarılı
} else {
  alert(createResult.error);
}

// Filtreleme
const filtered = CaseController.filterCasesByStatus(cases, 'open');
```

### Controller Response Formatı:

Tüm controller metodları aşağıdaki formatta response döner:

```javascript
{
  success: boolean,    // İşlem başarılı mı?
  data: any,          // Başarılı ise veri
  error: string | null // Hata varsa mesaj
}
```

## Service Katmanı (`services/`)

Service katmanı, API çağrılarını yönetir. HTTP isteklerini yapar ve response'ları işler.

### Özellikler:
- **HTTP İstekleri**: Fetch API kullanarak API çağrıları
- **Authentication**: Token yönetimi
- **Error Handling**: HTTP hatalarını yakalar

## View Katmanı (`pages/` ve `components/`)

View katmanı, sadece görüntüleme ve kullanıcı etkileşimlerini yönetir.

### Özellikler:
- **UI Rendering**: React bileşenleri
- **State Management**: Yerel state yönetimi
- **Event Handling**: Kullanıcı etkileşimleri

### Best Practices:

1. **Controller Kullanımı**: Tüm API çağrıları controller üzerinden yapılmalı
2. **Model Validasyonu**: Veri girişlerinde model validasyonu kullanılmalı
3. **Hata Yönetimi**: Controller'dan gelen hatalar kullanıcıya gösterilmeli
4. **Separation of Concerns**: İş mantığı view katmanında olmamalı

## Örnek: Yeni Bir Özellik Ekleme

### 1. Model Oluştur (`models/exampleModel.js`)

```javascript
export const validateExample = (data) => {
  const errors = {};
  if (!data.name) errors.name = 'Name is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const transformExampleForAPI = (data) => {
  return { name: data.name.trim() };
};
```

### 2. Controller Oluştur (`controllers/exampleController.js`)

```javascript
import { exampleAPI } from '../services/api';
import { validateExample, transformExampleForAPI } from '../models/exampleModel';

export class ExampleController {
  static async getAll() {
    try {
      const data = await exampleAPI.getAll();
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  }

  static async create(exampleData) {
    const validation = validateExample(exampleData);
    if (!validation.isValid) {
      return { success: false, data: null, error: Object.values(validation.errors).join(', ') };
    }

    try {
      const transformed = transformExampleForAPI(exampleData);
      const data = await exampleAPI.create(transformed);
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }
}
```

### 3. View'da Kullan (`pages/ExamplePage.js`)

```javascript
import { ExampleController } from '../controllers/exampleController';

const ExamplePage = () => {
  const [examples, setExamples] = useState([]);

  const fetchData = async () => {
    const result = await ExampleController.getAll();
    if (result.success) {
      setExamples(result.data);
    } else {
      alert(result.error);
    }
  };

  const handleCreate = async (formData) => {
    const result = await ExampleController.create(formData);
    if (result.success) {
      fetchData();
    } else {
      alert(result.error);
    }
  };

  // ... UI rendering
};
```

## Avantajlar

1. **Separation of Concerns**: Her katman kendi sorumluluğuna odaklanır
2. **Test Edilebilirlik**: Controller ve model katmanları kolayca test edilebilir
3. **Yeniden Kullanılabilirlik**: Controller metodları farklı view'larda kullanılabilir
4. **Bakım Kolaylığı**: Kod daha organize ve bakımı kolay
5. **Performans**: Veri işleme ve validasyon merkezi olarak yönetilir
6. **Standart Yapı**: Backend ile tutarlı mimari

## Notlar

- Tüm controller metodları static olarak tanımlanmıştır
- Controller metodları her zaman `{ success, data, error }` formatında response döner
- Model validasyonları controller içinde kullanılır
- View katmanında direkt API çağrısı yapılmamalıdır
