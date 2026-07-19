const F = {
  leaderPhoto: null,
  members: [],

  init() {
    const t = new Date().toISOString().split('T')[0];
    const sd = document.getElementById('startDate');
    const ed = document.getElementById('endDate');
    if (sd) sd.min = t;
    if (ed) ed.min = t;
    if (sd) sd.onchange = () => { if (ed) ed.min = sd.value; };
    this.load();
    this.addMember();
  },

  save() {
    const d = {};
    ['trekName','trekLocation','mapsLink','leaderName','leaderPhone','emergencyContact'].forEach(id => {
      d[id] = document.getElementById(id)?.value || '';
    });
    localStorage.ktes = JSON.stringify(d);
  },

  load() {
    try {
      const d = JSON.parse(localStorage.ktes);
      if (!d) return;
      Object.entries(d).forEach(([k,v]) => {
        const el = document.getElementById(k);
        if (el && v) el.value = v;
      });
    } catch(e) {}
  },

  async handlePhoto(input, type) {
    const file = input.files[0];
    if (!file) return;
    try {
      const url = await U.fileToURL(file);
      if (type === 'leader') {
        this.leaderPhoto = url;
        this._showPhoto('leaderPhotoPlaceholder', url, true);
      } else {
        const id = type.replace('m-','');
        const m = this.members.find(x => x.id === id);
        if (m) {
          m.photo = url;
          this._showPhoto(`mp-${id}`, url, false);
        }
      }
    } catch(e) { U.toast(e.message || 'Failed'); }
  },

  _showPhoto(pid, url, isLeader) {
    const p = document.getElementById(pid);
    if (!p) return;
    p.innerHTML = `<img src="${url}" alt="">`;
    const up = p.parentElement;
    up.classList.add('has-photo');
    
    if (!up.querySelector('.remove-btn')) {
      const b = document.createElement('button');
      b.className = 'remove-btn';
      b.textContent = '×';
      b.onclick = e => {
        e.stopPropagation();
        up.classList.remove('has-photo');
        p.innerHTML = '+';
        b.remove();
        up.querySelector('input').value = '';
        if (isLeader) this.leaderPhoto = null;
        else {
          const id = pid.replace('mp-','');
          const m = this.members.find(x => x.id === id);
          if (m) m.photo = null;
        }
      };
      up.appendChild(b);
    }
  },

  addMember() {
    const id = 'm' + Date.now();
    this.members.push({ id, name: '', phone: '', photo: null });
    this._render(id);
  },

  removeMember(id) {
    const el = document.getElementById(`mr-${id}`);
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(8px)';
      el.style.transition = 'all .2s';
      setTimeout(() => {
        el.remove();
        this.members = this.members.filter(m => m.id !== id);
      }, 200);
    }
  },

  updMember(id, field, value) {
    const m = this.members.find(x => x.id === id);
    if (m) m[field] = value;
  },

  _render(id) {
    const c = document.getElementById('membersContainer');
    const row = document.createElement('div');
    row.className = 'member-row';
    row.id = `mr-${id}`;
    row.innerHTML = `
      <div class="photo-upload" onclick="this.querySelector('input').click()">
        <span id="mp-${id}">+</span>
        <input type="file" accept="image/*" onchange="App.handlePhoto(this, 'm-${id}')" hidden>
      </div>
      <div class="form-field">
        <label>Name *</label>
        <input class="form-input" placeholder="Name" onchange="App.updMember('${id}','name',this.value)" required>
      </div>
      <div class="form-field">
        <label>Phone</label>
        <input class="form-input" type="tel" placeholder="Phone" onchange="App.updMember('${id}','phone',this.value)">
      </div>
      <button class="btn" style="color:var(--red);border-color:transparent;padding:8px" onclick="App.removeMember('${id}')" title="Remove">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      </button>
    `;
    c.appendChild(row);
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  validate() {
    const req = ['trekName','trekLocation','mapsLink','leaderName','leaderPhone','emergencyContact'];
    let ok = true;
    req.forEach(id => {
      const el = document.getElementById(id);
      if (!el?.value.trim()) {
        el.style.borderColor = 'var(--red)';
        ok = false;
      } else el.style.borderColor = 'var(--border)';
    });

    if (!this.leaderPhoto) { U.toast('Upload leader photo'); return false; }
    
    const ml = document.getElementById('mapsLink').value;
    if (!U.validMaps(ml)) { U.toast('Invalid Google Maps link'); return false; }

    document.querySelectorAll('#membersContainer .form-input[placeholder="Name"]').forEach(el => {
      if (!el.value.trim()) { el.style.borderColor = 'var(--red)'; ok = false; }
    });

    const noPhoto = this.members.filter(m => m.name.trim() && !m.photo);
    if (noPhoto.length) {
      U.toast(`Photo missing: ${noPhoto.map(m=>m.name||'member').join(', ')}`);
      return false;
    }

    return ok;
  },

  collect() {
    return {
      trekName: document.getElementById('trekName').value.trim(),
      trekLocation: document.getElementById('trekLocation').value.trim(),
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      mapsLink: document.getElementById('mapsLink').value.trim(),
      leader: {
        name: document.getElementById('leaderName').value.trim(),
        phone: document.getElementById('leaderPhone').value.trim(),
        emergency: document.getElementById('emergencyContact').value.trim(),
        photo: this.leaderPhoto
      },
      members: this.members.filter(m => m.name.trim()).map(m => ({
        name: m.name.trim(),
        phone: m.phone.trim(),
        photo: m.photo
      })),
      permitId: U.id(),
      issued: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    };
  }
};

// Autosave
document.addEventListener('input', () => {
  clearTimeout(F._t);
  F._t = setTimeout(() => F.save(), 800);
});