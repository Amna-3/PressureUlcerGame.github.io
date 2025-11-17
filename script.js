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
        incorrect: '❌ Incorrect intervention. -5 points'
      },
      finalScore: 'Your final score: ',
      stageOf: (current, total) => `Stage ${current} of ${total}`
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
        incorrect: '❌ تدخل خاطئ. -5 نقاط'
      },
      finalScore: 'نتيجتك النهائية: ',
      stageOf: (current, total) => `المرحلة ${current} من ${total}`
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
    }
  };

  function updateLanguage() {
    const lang = currentLanguage;
    languageToggle.textContent = translations[lang].languageButton;

    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }

  // Start game
  welcomeStartBtn.onclick = () => {
    welcomeScreen.style.display = 'none';
    endScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    score = 0;
    stageIndex = 0;
    showInterventions(stageOrder[stageIndex]);
  };

  // Restart from end screen
  restartBtn.onclick = () => {
    endScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
  };

  // Helper: shuffle an array (for randomizing answers)
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

    // Set stage image (make sure these exist in your repo)
    stageImage.src = `stage_${stage}_final.png`;
    stageImage.alt = `Stage ${stage} image`;

    // RANDOMIZE interventions each time
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
      score = Math.max(0, score - 5);
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
      stageHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function endGame() {
    gameScreen.style.display = 'none';
    endScreen.style.display = 'block';
    finalScoreEl.textContent =
      translations[currentLanguage].finalScore +
      score + ' ' +
      (currentLanguage === 'ar' ? 'نقطة' : 'points');
  }

  // IMAGE ZOOM BEHAVIOR
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
    // Click outside the image closes the modal
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
      imageModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Initialize correct language on load
  updateLanguage();
});
