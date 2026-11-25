(() => {
  const form = document.getElementById('shellcat-contact-form');
  const serviceSelect = document.getElementById('field-service');
  const statusEl = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (serviceSelect instanceof HTMLSelectElement) {
    const requested = new URLSearchParams(window.location.search).get('service');
    if (requested) {
      const normalized = requested.trim().toLowerCase();
      for (const option of Array.from(serviceSelect.options)) {
        if (
          option.value.toLowerCase() === normalized ||
          option.value.toLowerCase().includes(normalized)
        ) {
          serviceSelect.value = option.value;
          break;
        }
      }
    }
  }

  function showStatus(kind, text) {
    if (!statusEl) return;
    statusEl.classList.remove(
      'hidden',
      'border-lime/50',
      'bg-lime/10',
      'text-mist',
      'border-red-400/50',
      'bg-red-950/40',
      'text-red-200'
    );
    if (kind === 'success') {
      statusEl.classList.add('border-lime/50', 'bg-lime/10', 'text-mist');
    } else {
      statusEl.classList.add('border-red-400/50', 'bg-red-950/40', 'text-red-200');
    }
    statusEl.textContent = text;
  }

  if (!(form instanceof HTMLFormElement) || !(submitBtn instanceof HTMLButtonElement)) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      service: String(formData.get('service') || '').trim(),
      website: String(formData.get('website') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      consent: formData.get('consent') === 'on',
      company_fax: String(formData.get('company_fax') || '').trim(),
      'cf-turnstile-response': String(formData.get('cf-turnstile-response') || '').trim(),
    };

    if (payload.name.length < 2) {
      showStatus('error', 'Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }
    if (payload.phone.replace(/[^\d+]/g, '').length < 7) {
      showStatus('error', 'Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (payload.message.length < 10) {
      showStatus('error', 'Please enter a brief description of your requirement (at least 10 characters).');
      return;
    }
    if (!payload.consent) {
      showStatus('error', 'Please confirm that SHELLCAT may contact you about this enquiry.');
      return;
    }

    submitBtn.disabled = true;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok && result.ok) {
        showStatus('success', result.message || 'Thank you. Your enquiry has been sent.');
        form.reset();
      } else {
        const firstFieldErr = result.errors ? Object.values(result.errors)[0] : '';
        showStatus(
          'error',
          firstFieldErr || result.message || 'Unable to send your enquiry right now. Please try WhatsApp.'
        );
      }
    } catch {
      showStatus(
        'error',
        'Network error while sending your enquiry. Please try again or reach us on WhatsApp.'
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
