let appliances = JSON.parse(localStorage.getItem('appliances') || '[]');
let symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');

function showApplianceForm() {
  const brand = prompt('Бренд (Bosch, Indesit, Atlant):');
  const model = prompt('Модель:');
  const type = prompt('Тип (стиралка, холодильник и т.д.):');
  if (brand && model) {
    appliances.push({ brand, model, type, date: new Date().toISOString() });
    localStorage.setItem('appliances', JSON.stringify(appliances));
    alert('✅ Техника добавлена!');
  }
}

function showSymptomForm() {
  const desc = prompt('Опишите симптом:');
  if (desc) {
    if ('webkitSpeechRecognition' in window) {
      const useVoice = confirm('🎙️ Использовать голосовой ввод?');
      if (useVoice) {
        startVoiceInput(text => {
          symptoms.push({ description: text, date: new Date().toISOString() });
          localStorage.setItem('symptoms', JSON.stringify(symptoms));
          alert('✅ Симптом сохранён (голосом)!');
        });
        return;
      }
    }
    symptoms.push({ description: desc, date: new Date().toISOString() });
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
    alert('✅ Симптом сохранён!');
  }
}

function startVoiceInput(callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { return; }
  const recognition = new SpeechRecognition();
  recognition.lang = 'ru-RU';
  recognition.start();
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    callback(text);
  };
  recognition.onerror = () => alert('Ошибка распознавания');
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('Fixa — Отчёт', 20, 20);
  let y = 40;
  doc.setFontSize(14);
  doc.text('Техника:', 20, y);
  y += 10;
  appliances.forEach(a => {
    doc.text(`- ${a.brand} ${a.model} (${a.type})`, 25, y);
    y += 8;
    if (y > 280) { doc.addPage(); y = 20; }
  });
  y += 10;
  doc.text('Симптомы:', 20, y);
  y += 10;
  symptoms.forEach(s => {
    doc.text(`- ${s.description}`, 25, y);
    y += 8;
    if (y > 280) { doc.addPage(); y = 20; }
  });
  doc.save('fixa-report.pdf');
}

document.getElementById('status').innerText = 
  `Техника: ${appliances.length} | Симптомы: ${symptoms.length}`;
