document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const welcomeStartBtn = document.getElementById('welcomeStartBtn');
  const gameScreen = document.getElementById('gameScreen');
  const endScreen = document.getElementById('endScreen');
  const restartBtn = document.getElementById('restartBtn');
  const stageHeader = document.getElementById('stageHeader');
  const stageImage = document.getElementById('stageImage');
  const interventionsDiv = document.getElementById('interventions');
  const feedbackEl = document.getElementById('feedback');
  const nextStageBtn = document.getElementById('nextStageBtn');
  const finalScoreEl = document.getElementById('finalScore');
  const languageToggle = document.getElementById('languageToggle');
  const stageProgress = document.getElementById('stageProgress');

  // Modal elements for image zoom
  const imageModal = document.getElementById('imageModal');
  const imageModalImg = document.getElementById('imageModalImg');
  const imageModalClose = document.getElementById('imageModalClose');

  // Certificate elements
  const userNameInput = document.getElementById('userNameInput');
  const generateCertBtn = document.getElementById('generateCertBtn');
  const downloadCertLink = document.getElementById('downloadCertLink');

  // Make sure game and end screens are hidden at the start
  gameScreen.style.display = 'none';
  endScreen.style.display = 'none';

  let currentLanguage = 'en';

  const translations = {
    en: {
      languageButton: 'العربية',
      stages: {
        1: {
          header: 'Stage 1: Non-blanchable erythema',
          interventions: [
            { text: 'Apply moisturizing cream and inspect skin every 2 hours', correct: true },
            { text: 'Leave patient in same position and monitor next week', correct: false },
            { text: 'Use tight bandages to protect area', correct: false }
          ]
        },
        2: {
          header: 'Stage 2: Partial thickness skin loss',
          interventions: [
            { text: 'Clean wound gently and apply appropriate dressing', correct: true },
            { text: 'Expose wound to air without dressing', correct: false },
            { text: 'Apply heat packs to accelerate healing', correct: false }
          ]
        },
        3: {
          header: 'Stage 3: Full thickness skin loss',
          interventions: [
            { text: 'Debride necrotic tissue and provide pressure relief', correct: true },
            { text: 'Massage the ulcer vigorously', correct: false },
            { text: 'Ignore pain and continue activity', correct: false }
          ]
        },
        4: {
          header: 'Stage 4: Full thickness tissue loss',
          interventions: [
            { text: 'Seek medical treatment and use advanced wound care', correct: true },
            { text: 'Cover ulcer with thick cotton only', correct: false },
            { text: 'Increase patient mobility without care', correct: false }
          ]
        }
      },
      feedback: {
        correct: '✅ Correct intervention! +10 points',
        incorrect: '❌ Incorrect intervention. 0 points'
      },
      finalScore: 'Your final score: ',
      stageOf: (current, total) => `Stage ${current} of ${total}`,
      certLabel: 'Enter your name to get a certificate:',
      certButton: 'Generate Certificate',
      certDownload: 'Download Certificate'
    },
    ar: {
      languageButton: 'English',
      stages: {
        1: {
          header: 'المرحلة 1: احمرار غير قابل للتبييض',
          interventions: [
            { text: 'ضع كريم مرطب وافحص الجلد كل ساعتين', correct: true },
            { text: 'اترك المريض في نفس الوضع وراقبه الأسبوع القادم', correct: false },
            { text: 'استخدم ضمادات ضيقة لحماية المنطقة', correct: false }
          ]
        },
        2: {
          header: 'المرحلة 2: فقدان جزئي لسمك الجلد',
          interventions: [
            { text: 'نظف الجرح بلطف وضع الضمادة المناسبة', correct: true },
            { text: 'اترك الجرح معرضاً للهواء بدون ضمادة', correct: false },
            { text: 'ضع كمادات ساخنة لتسريع الشفاء', correct: false }
          ]
        },
        3: {
          header: 'المرحلة 3: فقدان كامل لسمك الجلد',
          interventions: [
            { text: 'أزل الأنسجة الميتة ووفر تخفيف الضغط', correct: true },
            { text: 'دلك القرحة بقوة', correct: false },
            { text: 'تجاهل الألم واستمر في النشاط', correct: false }
          ]
        },
        4: {
          header: 'المرحلة 4: فقدان كامل لسمك الأنسجة',
          interventions: [
            { text: 'اطلب العلاج الطبي واستخدم العناية المتقدمة بالجروح', correct: true },
            { text: 'غطِ القرحة بالقطن السميك فقط', correct: false },
            { text: 'زد حركة المريض دون عناية', correct: false }
          ]
        }
      },
      feedback: {
        correct: '✅ تدخل صحيح! +10 نقاط',
        incorrect: '❌ تدخل خاطئ. 0 نقاط'
      },
      finalScore: 'نتيجتك النهائية: ',
      stageOf: (current, total) => `المرحلة ${current} من ${total}`,
      certLabel: 'اكتب اسمك للحصول على شهادة:',
      certButton: 'إنشاء الشهادة',
      certDownload: 'تحميل الشهادة'
    }
  };

  let score = 0;
  let answered = false;
  const stageOrder = [1, 2, 3, 4];
  let stageIndex = 0;

  // Language toggle
  languageToggle.onclick = () => {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    updateLanguage();

    if (gameScreen.style.display === 'flex' || gameScreen.style.display === 'block') {
      showInterventions(stageOrder[stageIndex]);
    } else if (endScreen.style.display === 'flex' || endScreen.style.display === 'block') {
      finalScoreEl.textContent =
        translations[currentLanguage].finalScore +
        score + ' ' +
        (currentLanguage === 'ar' ? 'نقطة' : 'points');
      updateCertificateTexts();
    }
  };

  function updateLanguage() {
    const lang = currentLanguage;
    languageToggle.textContent = translations[lang].languageButton;

    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // placeholder for input
    if (userNameInput) {
      const phAttr = lang === 'en' ? 'data-en-placeholder' : 'data-ar-placeholder';
      const ph = userNameInput.getAttribute(phAttr);
      if (ph) userNameInput.placeholder = ph;
    }

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }

    updateCertificateTexts();
  }

  function updateCertificateTexts() {
    if (!userNameInput) return;
    const lang = currentLanguage;
    const certLabel = document.querySelector('#certificateSection label');
    if (certLabel) certLabel.textContent = translations[lang].certLabel;
    if (generateCertBtn) generateCertBtn.textContent = translations[lang].certButton;
    if (downloadCertLink && downloadCertLink.style.display !== 'none') {
      downloadCertLink.textContent = translations[lang].certDownload;
    }
  }

  // Start game
  welcomeStartBtn.onclick = () => {
    welcomeScreen.style.display = 'none';
    endScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    score = 0;
    stageIndex = 0;
    showInterventions(stageOrder[stageIndex]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restart from end screen
  restartBtn.onclick = () => {
    endScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper: shuffle an array
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showInterventions(stage) {
    const langBundle = translations[currentLanguage];

    feedbackEl.textContent = '';
    nextStageBtn.style.display = 'none';
    answered = false;

    const stageData = langBundle.stages[stage];
    const totalStages = stageOrder.length;
    const currentStageNumber = stageIndex + 1;

    stageHeader.textContent = stageData.header;
    stageProgress.textContent = langBundle.stageOf(currentStageNumber, totalStages);

    stageImage.src = `stage_${stage}_final.png`;
    stageImage.alt = `Stage ${stage} image`;

    const shuffledInterventions = shuffleArray(stageData.interventions);

    interventionsDiv.innerHTML = '';

    shuffledInterventions.forEach(({ text, correct }) => {
      const b = document.createElement('button');
      b.classList.add('intervention-btn');
      b.textContent = text;
      b.dataset.correct = String(correct);
      b.onclick = handleIntervention;
      interventionsDiv.appendChild(b);
    });
  }

  function handleIntervention(e) {
    if (answered) return;
    answered = true;

    const btn = e.target;
    const correct = btn.dataset.correct === 'true';
    const buttons = document.querySelectorAll('.intervention-btn');

    if (correct) {
      btn.classList.add('correct');
      feedbackEl.textContent = translations[currentLanguage].feedback.correct;
      score += 10;
    } else {
      btn.classList.add('wrong');
      feedbackEl.textContent = translations[currentLanguage].feedback.incorrect;
      // no minus points
    }

    buttons.forEach(b => {
      b.disabled = true;
      if (b.dataset.correct === 'true' && b !== btn) {
        b.classList.add('correct');
      }
    });

    nextStageBtn.style.display = 'inline-block';
  }

  nextStageBtn.onclick = () => {
    stageIndex++;
    if (stageIndex >= stageOrder.length) {
      endGame();
    } else {
      showInterventions(stageOrder[stageIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function endGame() {
    gameScreen.style.display = 'none';
    endScreen.style.display = 'flex';

    finalScoreEl.textContent =
      translations[currentLanguage].finalScore +
      score + ' ' +
      (currentLanguage === 'ar' ? 'نقطة' : 'points');

    // reset certificate download link
    downloadCertLink.style.display = 'none';
    downloadCertLink.href = '#';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // IMAGE ZOOM
  stageImage.addEventListener('click', () => {
    if (!stageImage.src) return;
    imageModalImg.src = stageImage.src;
    imageModal.style.display = 'flex';
    imageModal.setAttribute('aria-hidden', 'false');
  });

  imageModalClose.addEventListener('click', () => {
    imageModal.style.display = 'none';
    imageModal.setAttribute('aria-hidden', 'true');
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      imageModal.setAttribute('aria-hidden', 'true');
    }
  });

  // ===== CERTIFICATE GENERATION =====

  generateCertBtn.addEventListener('click', () => {
    const name = (userNameInput.value || '').trim();
    if (!name) {
      alert(currentLanguage === 'ar'
        ? 'من فضلك اكتب اسمك أولاً'
        : 'Please enter your name first');
      return;
    }
    generateCertificate(name);
  });

  // Detect if entered name is Arabic
  function isArabicName(name) {
    return /[\u0600-\u06FF]/.test(name);
  }

  function generateCertificate(name) {
    const useArabic = isArabicName(name);
    const templateSrc = useArabic ? 'certificate_ar.png' : 'certificate_en.png';

    const img = new Image();
    img.src = templateSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Draw background certificate
      ctx.drawImage(img, 0, 0);

      // FONT SETTINGS
      if (useArabic) {
        ctx.font = "bold 120px 'Amiri', 'Cairo', serif";
        ctx.direction = "rtl";
        ctx.textAlign = "center";
        ctx.fillStyle = "#C49A3A";
      } else {
        ctx.font = "bold 105px 'Playfair Display', 'Georgia', serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#C49A3A";
      }

      const centerX = canvas.width / 2;
      const centerY = useArabic
        ? canvas.height * 0.50   // Arabic a bit lower
        : canvas.height * 0.55; // English slightly above

      ctx.fillText(name, centerX, centerY);

      // Create downloadable PNG
      downloadCertLink.href = canvas.toDataURL('image/png');
      downloadCertLink.download = useArabic
        ? `PressureUlcerCertificate-${name}-ar.png`
        : `PressureUlcerCertificate-${name}-en.png`;
      downloadCertLink.style.display = 'block';
      downloadCertLink.textContent = translations[currentLanguage].certDownload;
    };

    img.onerror = () => {
      alert(currentLanguage === 'ar'
        ? 'تعذّر تحميل قالب الشهادة. تأكدي من وجود الملفات certificate_ar.png و certificate_en.png في المشروع.'
        : 'Could not load certificate template. Please make sure certificate_ar.png and certificate_en.png exist.');
    };
  }

  // Initialize language on load
  updateLanguage();
});
