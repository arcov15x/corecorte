const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (!header || !menuToggle || !nav) {
  throw new Error('Estrutura principal da página não encontrada.');
}

const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 35);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const dateInput = document.getElementById('date');
const bookingForm = document.getElementById('booking-form');
const serviceSelect = document.getElementById('service');

if (!dateInput || !bookingForm || !serviceSelect) {
  throw new Error('Formulário de agendamento não encontrado.');
}

const today = new Date();
const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split('T')[0];
dateInput.min = localISO;

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    serviceSelect.value = link.dataset.service;
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const name = String(data.get('name') || '').trim();
  const service = String(data.get('service') || '').trim();
  const date = String(data.get('date') || '').trim();
  const time = String(data.get('time') || '').trim();
  const note = String(data.get('note') || '').trim();

  const formattedDate = date
    ? date.split('-').reverse().join('/')
    : '';

  const lines = [
    'Olá! Vim pelo site da Cor & Corte e gostaria de solicitar um horário. ✨',
    '',
    `Nome: ${name}`,
    `Serviço: ${service}`,
    `Data desejada: ${formattedDate}`,
    `Horário preferido: ${time}`
  ];

  if (note) lines.push(`Observação: ${note}`);

  lines.push('', 'Podem me confirmar a disponibilidade, por favor?');

  const message = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/5554999432152?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});
