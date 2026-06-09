 // ── CONFIGURACION ──────────────────────────────
    const DEST_EMAIL = 'tu-email@ejemplo.com'; // <-- cambia esto
    // ──────────────────────────────────────────────

    const mainBtn      = document.getElementById('main-btn');
    const overlay      = document.getElementById('overlay');
    const closeBtn     = document.getElementById('close-btn');
    const textarea     = document.getElementById('suggestion-text');
    const charCount    = document.getElementById('char-count');
    const imgInput     = document.getElementById('img-input');
    const imgPreview   = document.getElementById('img-preview');
    const previewImg   = document.getElementById('preview-img');
    const removeImg    = document.getElementById('remove-img');
    const uploadLabel  = document.getElementById('upload-label');
    const imgNote      = document.getElementById('img-note');
    const btnSend      = document.getElementById('btn-send');
    const formState    = document.getElementById('form-state');
    const successState = document.getElementById('success-state');
    const btnReset     = document.getElementById('btn-reset');

    function openModal() { overlay.classList.add('visible'); setTimeout(() => textarea.focus(), 300); }
    function closeModal() { overlay.classList.remove('visible'); }

    mainBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len + ' / 500';
      charCount.classList.toggle('warn', len > 450);
      textarea.classList.remove('error');
    });

    imgInput.addEventListener('change', () => {
      const file = imgInput.files[0];
      if (!file) return;
      uploadLabel.textContent = file.name;
      imgNote.style.display = 'block';
      const reader = new FileReader();
      reader.onload = e => { previewImg.src = e.target.result; imgPreview.style.display = 'block'; };
      reader.readAsDataURL(file);
    });

    removeImg.addEventListener('click', e => {
      e.stopPropagation();
      imgInput.value = '';
      imgPreview.style.display = 'none';
      previewImg.src = '';
      uploadLabel.textContent = 'Imagen adjunta';
      imgNote.style.display = 'none';
    });

    btnSend.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) { textarea.classList.add('error'); textarea.focus(); return; }
      const hasImg  = imgInput.files && imgInput.files[0];
      const imgLine = hasImg
        ? '\n\n--- Imagen adjunta ---\nArchivo: ' + imgInput.files[0].name + '\n(Por favor adjunta la imagen manualmente a este email)'
        : '';
      const subject = encodeURIComponent('Nueva sugerencia');
      const body    = encodeURIComponent('Hola,\n\nTengo la siguiente sugerencia:\n\n' + text + imgLine + '\n\nSaludos.');
      window.location.href = 'mailto:' + DEST_EMAIL + '?subject=' + subject + '&body=' + body;
      formState.style.display  = 'none';
      successState.style.display = 'block';
    });

    btnReset.addEventListener('click', () => {
      textarea.value = '';
      charCount.textContent = '0 / 500';
      charCount.classList.remove('warn');
      textarea.classList.remove('error');
      imgInput.value = '';
      imgPreview.style.display = 'none';
      previewImg.src = '';
      uploadLabel.textContent = 'Imagen adjunta';
      imgNote.style.display = 'none';
      formState.style.display    = 'block';
      successState.style.display = 'none';
    });