const U = {
  id() { return 'KT' + Date.now().toString(36).toUpperCase(); },
  fmt(d) { return d ? new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''; },
  
  toast(m) {
    const t = document.getElementById('toast');
    t.textContent = m;
    t.classList.remove('hidden');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.add('hidden'), 2500);
  },

  imgLoad(src) {
    return new Promise((ok, fail) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => fail();
      i.src = src;
    });
  },

  fileToURL(file) {
    return new Promise((ok, fail) => {
      if (!file) return fail();
      if (file.size > 2e6) return fail('Max 2MB');
      const r = new FileReader();
      r.onload = e => ok(e.target.result);
      r.onerror = () => fail();
      r.readAsDataURL(file);
    });
  },

  validMaps(u) { return /maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com|google\.com\/maps/i.test(u); }
};