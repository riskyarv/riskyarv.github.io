// Eenvoudige rich-text-editor: vet, cursief, links, lijsten en HTML-bron.
import { h, svg } from './util.js';

const BLOCK_RE = /<(p|ul|ol|h\d|div|blockquote)\b/i;
const NEW_LINK = '#__cms_new_link__';

const linkDialog = document.getElementById('linkDialog');
const linkForm = document.getElementById('linkForm');
const linkHref = document.getElementById('linkHref');
const linkBlank = document.getElementById('linkBlank');
const linkRemove = document.getElementById('linkRemove');

// Vraag een linkadres; resolve(null) bij annuleren, resolve({remove:true}) bij verwijderen.
function askLink({ href = '', blank = false, existing = false }) {
  linkHref.value = href;
  linkBlank.checked = blank;
  linkRemove.hidden = !existing;
  linkDialog.returnValue = '';
  linkDialog.showModal();
  linkHref.select();
  return new Promise((resolve) => {
    const onRemove = () => {
      linkDialog.close('remove');
    };
    linkRemove.addEventListener('click', onRemove);
    linkDialog.addEventListener(
      'close',
      () => {
        linkRemove.removeEventListener('click', onRemove);
        const v = linkDialog.returnValue;
        if (v === 'remove') resolve({ remove: true });
        else if (v === 'ok' && linkHref.value.trim()) resolve({ href: linkHref.value.trim(), blank: linkBlank.checked });
        else resolve(null);
      },
      { once: true },
    );
  });
}
linkForm.addEventListener('submit', (e) => {
  if (e.submitter?.value === 'cancel') return;
  e.preventDefault();
  linkDialog.close('ok');
});

// DOM → nette HTML-string die past bij de bestaande content.
function serialize(area, block) {
  const root = area.cloneNode(true);
  const rename = (el, tag) => {
    const n = document.createElement(tag);
    for (const a of el.attributes) n.setAttribute(a.name, a.value);
    n.append(...el.childNodes);
    el.replaceWith(n);
    return n;
  };
  for (const el of [...root.querySelectorAll('*')]) {
    for (const a of [...el.attributes]) {
      const bad = a.name === 'style' || a.name.startsWith('on') || (a.name === 'href' && /^\s*javascript:/i.test(a.value));
      if (bad || (a.name === 'class' && !a.value.trim())) el.removeAttribute(a.name);
    }
    const tag = el.tagName.toLowerCase();
    if (tag === 'b') rename(el, 'strong');
    else if (tag === 'i') rename(el, 'em');
    else if (tag === 'div' && block) rename(el, 'p');
    else if ((tag === 'span' || tag === 'font') && !el.attributes.length) el.replaceWith(...el.childNodes);
    else if (/^(script|style|iframe|object|embed|meta|link)$/.test(tag)) el.remove();
  }
  // Lege blokken en een losse afsluitende <br> die de browser achterlaat, opruimen.
  for (const el of [...root.querySelectorAll('p, li, strong, em')]) {
    if (!el.textContent.trim() && !el.querySelector('br, img')) el.remove();
  }
  const last = root.lastChild;
  if (last?.nodeName === 'BR') last.remove();
  if (!root.textContent.trim() && !root.querySelector('img')) return '';
  return root.innerHTML.replace(/\u00a0/g, '&nbsp;');
}

export function createRte({ value, onChange, label }) {
  let current = value ?? '';
  const block = BLOCK_RE.test(current);
  const linkClass = (() => {
    const t = document.createElement('template');
    t.innerHTML = current;
    return t.content.querySelector('a[class]')?.getAttribute('class') || '';
  })();

  const area = h('div', {
    class: 'rte__area',
    contenteditable: 'true',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-label': label,
    spellcheck: 'true',
  });
  area.innerHTML = current;
  const src = h('textarea', { class: 'rte__src', spellcheck: 'false', 'aria-label': `${label} (HTML)`, hidden: true });

  const btn = (name, title, content, cmd) =>
    h('button', {
      class: 'rte__btn',
      type: 'button',
      title,
      'aria-label': title,
      'aria-pressed': cmd ? 'false' : null,
      'data-cmd': name,
      html: content,
    });

  const bBold = btn('bold', 'Vet (⌘B)', '<b>B</b>', true);
  const bItalic = btn('italic', 'Cursief (⌘I)', '<i>I</i>', true);
  const bLink = btn('link', 'Link (⌘K)', svg('link'), true);
  const bUnlink = btn('unlink', 'Link verwijderen', svg('unlink'));
  const bUl = block ? btn('insertUnorderedList', 'Opsommingslijst', svg('ul'), true) : null;
  const bOl = block ? btn('insertOrderedList', 'Genummerde lijst', svg('ol'), true) : null;
  const bSrc = h('button', {
    class: 'rte__btn rte__src-btn',
    type: 'button',
    title: 'HTML-bron bewerken',
    'aria-pressed': 'false',
    text: '</>',
  });
  const bar = h(
    'div',
    { class: 'rte__bar', role: 'toolbar', 'aria-label': `Opmaak ${label}` },
    bBold,
    bItalic,
    h('span', { class: 'rte__sep' }),
    bLink,
    bUnlink,
    block ? [h('span', { class: 'rte__sep' }), bUl, bOl] : null,
    bSrc,
  );
  const el = h('div', { class: 'rte' }, bar, area, src);

  const commit = () => {
    const v = serialize(area, block);
    if (v === current) return;
    current = v;
    onChange(v);
  };

  const exec = (cmd, arg = null) => {
    area.focus();
    document.execCommand('styleWithCSS', false, false);
    if (block) document.execCommand('defaultParagraphSeparator', false, 'p');
    document.execCommand(cmd, false, arg);
    commit();
    syncState();
  };

  const linkAtSelection = () => {
    const sel = getSelection();
    if (!sel.rangeCount) return null;
    const n = sel.getRangeAt(0).commonAncestorContainer;
    const a = (n.nodeType === 1 ? n : n.parentElement)?.closest('a');
    return a && area.contains(a) ? a : null;
  };

  function syncState() {
    if (!area.contains(getSelection().anchorNode)) return;
    bBold.setAttribute('aria-pressed', String(document.queryCommandState('bold')));
    bItalic.setAttribute('aria-pressed', String(document.queryCommandState('italic')));
    bLink.setAttribute('aria-pressed', String(!!linkAtSelection()));
    bUl?.setAttribute('aria-pressed', String(document.queryCommandState('insertUnorderedList')));
    bOl?.setAttribute('aria-pressed', String(document.queryCommandState('insertOrderedList')));
  }

  async function editLink() {
    const sel = getSelection();
    if (!sel.rangeCount || !area.contains(sel.anchorNode)) {
      area.focus();
      const r = document.createRange();
      r.selectNodeContents(area);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    const range = sel.getRangeAt(0).cloneRange();
    const a = linkAtSelection();
    const res = await askLink({
      href: a?.getAttribute('href') || '',
      blank: a ? a.target === '_blank' : false,
      existing: !!a,
    });
    area.focus();
    sel.removeAllRanges();
    sel.addRange(range);
    if (!res) return;
    if (res.remove) {
      if (a) {
        const r = document.createRange();
        r.selectNodeContents(a);
        sel.removeAllRanges();
        sel.addRange(r);
      }
      return exec('unlink');
    }
    const apply = (link) => {
      link.setAttribute('href', res.href);
      if (res.blank) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
      } else {
        link.removeAttribute('target');
        if (link.getAttribute('rel') === 'noopener') link.removeAttribute('rel');
      }
    };
    if (a) {
      apply(a);
    } else if (range.collapsed) {
      const text = res.href.replace(/^mailto:/, '');
      document.execCommand('insertHTML', false, `<a href="${NEW_LINK}">${text.replace(/[<>&"]/g, '')}</a>`);
    } else {
      document.execCommand('createLink', false, NEW_LINK);
    }
    for (const n of area.querySelectorAll(`a[href="${NEW_LINK}"]`)) {
      if (linkClass) n.setAttribute('class', linkClass);
      apply(n);
    }
    commit();
    syncState();
  }

  function unlink() {
    const a = linkAtSelection();
    if (a) {
      const r = document.createRange();
      r.selectNodeContents(a);
      getSelection().removeAllRanges();
      getSelection().addRange(r);
    }
    exec('unlink');
  }

  bar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.rte__btn') && e.target.closest('.rte__btn') !== bSrc) e.preventDefault();
  });
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.rte__btn');
    if (!b) return;
    const cmd = b.dataset.cmd;
    if (b === bSrc) return toggleSource();
    if (cmd === 'link') return editLink();
    if (cmd === 'unlink') return unlink();
    exec(cmd);
  });

  function toggleSource(force) {
    const on = force ?? src.hidden;
    if (on) {
      src.value = current;
      src.hidden = false;
      area.hidden = true;
      src.focus();
    } else {
      area.innerHTML = current;
      src.hidden = true;
      area.hidden = false;
    }
    bSrc.setAttribute('aria-pressed', String(on));
    for (const b of bar.querySelectorAll('.rte__btn')) if (b !== bSrc) b.disabled = on;
  }

  src.addEventListener('input', () => {
    if (src.value === current) return;
    current = src.value;
    onChange(current);
  });

  area.addEventListener('input', commit);
  area.addEventListener('keyup', syncState);
  area.addEventListener('mouseup', syncState);
  area.addEventListener('focus', syncState);
  area.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      e.stopPropagation();
      editLink();
    } else if (mod && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      exec('bold');
    } else if (mod && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      exec('italic');
    } else if (e.key === 'Enter' && !block) {
      e.preventDefault();
      exec('insertLineBreak');
    } else if (e.key === 'Enter' && block) {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  });
  area.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (block) {
      const parts = text.split(/\n{2,}/).map((p) => p.replace(/[<>&]/g, (c) => `&#${c.charCodeAt(0)};`).replace(/\n/g, '<br>'));
      if (parts.length > 1) return exec('insertHTML', parts.map((p) => `<p>${p}</p>`).join(''));
    }
    exec('insertText', block ? text : text.replace(/\s*\n\s*/g, ' '));
  });
  area.addEventListener('drop', (e) => e.preventDefault());
  area.addEventListener('click', (e) => {
    if (e.target.closest('a') && (e.metaKey || e.ctrlKey)) window.open(e.target.closest('a').href, '_blank', 'noopener');
  });

  return {
    el,
    focus: () => (src.hidden ? area : src).focus(),
    set(v) {
      current = v ?? '';
      area.innerHTML = current;
      src.value = current;
    },
  };
}
