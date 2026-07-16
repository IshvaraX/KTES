const App = {
  init() {
    F.init();
  },

  handlePhoto(input, type) { F.handlePhoto(input, type); },
  addMember() { F.addMember(); },
  removeMember(id) { F.removeMember(id); },
  updMember(id, field, value) { F.updMember(id, field, value); },

  async generatePDF() {
    if (!F.validate()) return;
    const btn = document.getElementById('generateBtn');
    btn.innerHTML = '<span class="spinner"></span> Generating…';
    btn.disabled = true;
    try {
      await P.generate(F.collect());
      U.toast('✅ Permits downloaded');
    } catch(e) {
      console.error(e);
      U.toast('Error generating PDF');
    }
    btn.textContent = 'Download Permits';
    btn.disabled = false;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());