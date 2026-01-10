const { pool } = require('../config/database');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getAISummary = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Önce database'de var mı kontrol et
    const existingSummary = await pool.query(
      'SELECT summary FROM case_ai_summaries WHERE case_id = $1',
      [caseId]
    );

    if (existingSummary.rows.length > 0) {
      return res.json({ summary: existingSummary.rows[0].summary });
    }

    return res.json({ summary: null });
  } catch (error) {
    console.error('Error getting AI summary:', error);
    res.status(500).json({ error: 'Failed to get AI summary' });
  }
};

const generateAISummary = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { processTree, force } = req.body;

    if (!processTree) {
      return res.status(400).json({ error: 'Process tree is required' });
    }

    // Eğer force=true değilse, önce database'de var mı kontrol et
    if (!force) {
      const existingSummary = await pool.query(
        'SELECT summary FROM case_ai_summaries WHERE case_id = $1',
        [caseId]
      );

      if (existingSummary.rows.length > 0) {
        return res.json({ summary: existingSummary.rows[0].summary });
      }
    }

    // Force=true ise yeni GPT isteği yapılacak
    console.log(`Generating new AI summary for case ${caseId} (force: ${force})`);

    // OpenAI'ya istek gönder
    const prompt = `
      
      ${JSON.stringify(processTree)}
      GÖREVLER:

        1. **GENEL DEĞERLENDİRME**
        - Process tree'nin genel durumu
        - En kritik bulgular (2-3 cümle)

        2. **ŞÜPHELİ PROCESS'LER** (suspicious: true olanlar ve diğer anormallikler)
        Her şüpheli process için:
        - Process adı ve PID
        - Neden şüpheli olduğu (detaylı)
        - Potansiyel tehdit türü (malware/ransomware/trojan vb.)
        - Risk seviyesi (CRITICAL/HIGH/MEDIUM/LOW)
        - MITRE ATT&CK tekniği (varsa)

        3. **ANORMAL DAVRANIŞ PATTERNLERİ**
        - Sıradışı parent-child ilişkileri
        - Beklenmeyen process spawn'ları
        - Privilege escalation işaretleri
        - Persistence göstergeleri

        4. **ACİL AKSİYONLAR**
        Öncelik sırasına göre:
        - Hangi process'ler derhal sonlandırılmalı
        - Hangi dosyalar karantinaya alınmalı
        - Hangi network bağlantıları bloklanmalı
        - Hangi registry key'leri kontrol edilmeli

        5. **DERİNLEMESİNE ARAŞTIRMA ÖNERİLERİ**
        - VirusTotal, Any.Run gibi platformlarda kontrol edilmesi gerekenler
        - Incelenecek log dosyaları
        - Memory dump alınması gereken process'ler
        - Network forensics adımları

        6. **GENEL RİSK SKORU**
        1-10 arası puan ver ve gerekçesini açıkla.

        FORMAT: Markdown kullan. Başlıklar için ##, önemli noktalar için **bold**, kod/dosya isimleri için backtick kullan.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Sen bir SOC (Security Operations Center) analisti ve malware uzmanısın. Windows process tree\'lerini analiz ederek güvenlik tehditlerini tespit ediyorsun.\n\n' +
            'UZMANLIKLARIN:\n' +
            '- Malware ve ransomware tespiti\n' +
            '- Process injection ve hollowing teknikleri\n' +
            '- Privilege escalation girişimleri\n' +
            '- Lateral movement aktiviteleri\n' +
            '- Persistence mekanizmaları\n' +
            '- Fileless malware analizi\n' +
            '- Parent-child process ilişkilerinin değerlendirilmesi\n\n' +
            'ANALİZ STANDARTLARIN:\n' +
            '- Her şüpheli durumu açık ve net açıkla\n' +
            '- Teknik terimleri Türkçe açıkla ama İngilizce karşılığını parantez içinde belirt\n' +
            '- Risk seviyelerini net belirle: CRITICAL/HIGH/MEDIUM/LOW\n' +
            '- Concrete eylem önerileri sun\n' +
            '- MITRE ATT&CK framework referansları ver'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const summary = completion.choices[0].message.content;

    // Database'e kaydet veya güncelle
    await pool.query(
      `INSERT INTO case_ai_summaries (case_id, summary) 
       VALUES ($1, $2) 
       ON CONFLICT (case_id) 
       DO UPDATE SET summary = $2, updated_at = CURRENT_TIMESTAMP`,
      [caseId, summary]
    );

    console.log(`AI summary saved/updated for case ${caseId}`);

    res.json({ summary });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({ error: 'Failed to generate AI summary', details: error.message });
  }
};

module.exports = {
  getAISummary,
  generateAISummary
};
