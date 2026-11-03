/**
 * Wires a contact <form data-contact> to Web3Forms (static-site friendly).
 * Without an access key the form opens the visitor's mail client instead.
 */
export function initContactForm(accessKey: string | undefined, email: string) {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-contact]')) {
    const status = form.querySelector<HTMLElement>('[data-status]');
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]');
    const msg = (key: string) => form.dataset[key] ?? '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (data.get('botcheck')) return;

      if (!accessKey) {
        const subject = `Portfolio — ${data.get('name')}${data.get('company') ? ` (${data.get('company')})` : ''}`;
        const body = `${data.get('message')}\n\n${data.get('name')} <${data.get('email')}>`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return;
      }

      data.set('access_key', accessKey);
      data.set('subject', `Portfolio — ${data.get('name')}`);
      if (button) {
        button.disabled = true;
        button.dataset.label = button.textContent ?? '';
        button.textContent = msg('sending');
      }
      try {
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        form.reset();
        if (status) {
          status.textContent = msg('success');
          status.dataset.state = 'ok';
        }
      } catch {
        if (status) {
          status.textContent = msg('error');
          status.dataset.state = 'error';
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = button.dataset.label ?? '';
        }
      }
    });
  }
}
