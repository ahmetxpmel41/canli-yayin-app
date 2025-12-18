// Firebase kütüphanelerini çekiyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// SENİN FİREBASE BİLGİLERİN
const firebaseConfig = {
  apiKey: "AIzaSyDLdI1jgFTYHflL_xKr6RiI6EObqEVkqew",
  authDomain: "santiyecanli.firebaseapp.com",
  databaseURL: "https://santiyecanli-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "santiyecanli",
  storageBucket: "santiyecanli.firebasestorage.app",
  messagingSenderId: "642463154004",
  appId: "1:642463154004:web:b01c264e110ebe8b6a52c1"
};

// 1. Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const chatRef = ref(db, 'mesajlar');

// Elementleri Seç
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

// Renk Seçimi
const colors = ['text-yellow-500', 'text-blue-400', 'text-green-400', 'text-pink-400', 'text-purple-400', 'text-orange-400'];
const myColor = colors[Math.floor(Math.random() * colors.length)];

// --- YENİ EKLENEN KISIM: RASTGELE İSİM ---
// 1000 ile 9999 arasında sayı üretir (Örn: 4521)
const randomNum = Math.floor(Math.random() * 9000) + 1000;
const myName = "Anon" + randomNum; // Sonuç: Anon4521

// 2. MESAJ GÖNDERME
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text === "") return;

    push(chatRef, {
        isim: myName,  // ARTIK BURADA "Misafir" YERİNE "myName" VAR
        mesaj: text,
        renk: myColor,
        zaman: Date.now() 
    });

    chatInput.value = ''; 
});

// 3. MESAJLARI DİNLEME VE SİLME MANTIĞI
onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    const mesajZamani = data.zaman;
    
    const suAn = Date.now();
    
    // Mesajın ne kadar önce atıldığını hesapla
    const gecenSure = suAn - mesajZamani;
    const omur = 30000; // 30 saniye

    // EĞER MESAJ ÇOK ESKİYSE (30 saniyeyi geçtiyse) HİÇ GÖSTERME
    if (gecenSure >= omur) {
        return; 
    }

    // Mesaj taze ise ekrana bas
    const mesajElementi = addMessageToScreen(data.isim, data.mesaj, data.renk);

    // KALAN SÜRE KADAR BEKLE VE SİL
    const kalanSure = omur - gecenSure;

    setTimeout(() => {
        // Efektli silinme
        mesajElementi.style.transition = "opacity 0.5s ease";
        mesajElementi.style.opacity = "0";
        
        // Animasyon bitince tamamen kaldır
        setTimeout(() => mesajElementi.remove(), 500);
        
    }, kalanSure);
});

// Ekrana HTML Ekleme
function addMessageToScreen(isim, mesaj, renk) {
    const div = document.createElement('div');
    div.className = "flex gap-2 mb-2 group animate-fade-in";
    div.innerHTML = `
        <span class="font-bold ${renk} text-sm whitespace-nowrap">${isim}:</span>
        <span class="text-sm text-gray-300 break-words">${mesaj}</span>
    `;
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return div;
}

// CSS Animasyonları
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);