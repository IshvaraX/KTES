const P = {
  async generate(data) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    const m = 16;

    // QR code
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.mapsLink)}`;

    let page = 1;
    const all = [
      { ...data.leader, role: 'Group Leader' },
      ...data.members.map(p => ({ ...p, role: 'Member' }))
    ];

    // Cover
    this.cover(pdf, data, all, w, h, m, page++);

    // Individual
    for (const p of all) {
      pdf.addPage();
      this.permit(pdf, data, p, qr, w, h, m, page++);
    }

    pdf.save(`KTES_${data.trekName.replace(/\s+/g,'_')}.pdf`);
  },

  cover(pdf, data, all, w, h, m, page) {
    pdf.setFillColor(26,115,232);
    pdf.rect(0,0,w,2.5,'F');

    pdf.setFontSize(22);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text('KTES Trek Permit', w/2, 22, { align:'center' });

    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.setFont('helvetica','normal');
    pdf.text(`${data.permitId} • ${data.issued}`, w/2, 28, { align:'center' });

    let y = 38;
    pdf.setFillColor(245,245,245);
    pdf.roundedRect(m, y, w-2*m, 36, 3, 3, 'F');

    pdf.setFontSize(14);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text(data.trekName, m+5, y+10);
    
    pdf.setFontSize(9);
    pdf.setTextColor(60);
    pdf.setFont('helvetica','normal');
    pdf.text(data.trekLocation, m+5, y+18);
    pdf.text(`Dates: ${U.fmt(data.startDate)} — ${U.fmt(data.endDate)}`, m+5, y+26);

    y = 84;
    pdf.setFillColor(232,240,254);
    pdf.roundedRect(m, y, w-2*m, 26, 3, 3, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text('Group', m+5, y+10);
    pdf.setFontSize(9);
    pdf.setTextColor(40);
    pdf.setFont('helvetica','normal');
    pdf.text(`Leader: ${data.leader.name}  •  Members: ${data.members.length}  •  Total: ${all.length}`, m+5, y+20);

    y = 120;
    pdf.setFontSize(10);
    pdf.setTextColor(26,115,232);
    pdf.text('Permits:', m, y);
    pdf.setFontSize(9);
    pdf.setTextColor(60);
    all.forEach((p,i) => pdf.text(`${i+1}. ${p.name} — ${p.role}`, m+4, y+8 + i*6));

    pdf.setFontSize(7);
    pdf.setTextColor(160);
    pdf.text(`KTES | Page ${page}`, w/2, h-8, { align:'center' });
  },

  permit(pdf, data, person, qr, w, h, m, page) {
    pdf.setFillColor(26,115,232);
    pdf.rect(0,0,w,2.5,'F');

    pdf.setFontSize(16);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text('Individual Permit', w/2, 16, { align:'center' });
    pdf.setFontSize(7);
    pdf.setTextColor(100);
    pdf.setFont('helvetica','normal');
    pdf.text(`${person.role} • ${data.permitId}`, w/2, 22, { align:'center' });

    // Photo
    const ps = 28;
    const px = w - m - ps;
    const py = 28;
    pdf.setDrawColor(200);
    pdf.rect(px, py, ps, ps*1.3);
    if (person.photo) {
      try { pdf.addImage(person.photo, 'JPEG', px+1, py+1, ps-2, ps*1.3-2); } catch(e) {}
    }

    // Details
    let y = 32;
    pdf.setFontSize(10);
    [
      ['Name', person.name],
      ['Role', person.role],
      ['Phone', person.phone || '-'],
      ['Emergency', person.emergency || '-']
    ].filter(([,v]) => v !== '-').forEach(([l,v]) => {
      pdf.setTextColor(100); pdf.setFont('helvetica','bold');
      pdf.text(`${l}:`, m, y);
      pdf.setTextColor(30); pdf.setFont('helvetica','normal');
      pdf.text(v, m+28, y);
      y += 8;
    });

    // Trek info
    y = 78;
    pdf.setFillColor(248,248,248);
    pdf.roundedRect(m, y, w-2*m, 38, 3, 3, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text(data.trekName, m+5, y+10);
    pdf.setFontSize(9);
    pdf.setTextColor(60);
    pdf.setFont('helvetica','normal');
    pdf.text(data.trekLocation, m+5, y+19);
    pdf.text(`${U.fmt(data.startDate)} — ${U.fmt(data.endDate)}`, m+5, y+27);

    // QR
    y = 126;
    pdf.setFillColor(245,245,245);
    pdf.roundedRect(m, y, w-2*m, 52, 3, 3, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(26,115,232);
    pdf.setFont('helvetica','bold');
    pdf.text('Location', w/2, y+10, { align:'center' });
    try { pdf.addImage(qr, 'PNG', w/2-18, y+14, 36, 36); } catch(e) {}
    pdf.setFontSize(7);
    pdf.setTextColor(120);
    pdf.setFont('helvetica','normal');
    pdf.text('Scan for Google Maps', w/2, y+53, { align:'center' });

    pdf.setFontSize(7);
    pdf.setTextColor(120);
    pdf.text(`Issued: ${data.issued}`, m, h-14);
    pdf.text('Carry this permit during trek. Follow safety guidelines.', m, h-8);
    pdf.setTextColor(160);
    pdf.text(`KTES | Page ${page}`, w/2, h-6, { align:'center' });
  }
};