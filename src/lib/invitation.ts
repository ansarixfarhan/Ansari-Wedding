// Position of the "Janab ____" line on page 1 (PDF points, origin bottom-left).
export const NAME_SLOT = {
  pageWidth: 691.2,
  pageHeight: 518.4,
  centerX: 368,
  baselineY: 191.5,
  maxWidth: 180,
  fontSize: 17,
  minFontSize: 10,
  extraBaselineY: 170,
  extraFontSize: 14,
};

export function safeFileName(name: string) {
  const clean = name
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
  return `Ansari_Wedding_Invitation${clean ? "_" + clean : ""}.pdf`;
}

export async function buildInvitationPdf(name: string, extra = ""): Promise<Blob> {
  const [{ PDFDocument, rgb }, fontkit, pdfBytes, fontBytes] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit").then((m) => m.default),
    fetch("/invite/invitation.pdf").then((r) => r.arrayBuffer()),
    fetch("/invite/Lora-Italic.ttf").then((r) => r.arrayBuffer()),
  ]);
  const doc = await PDFDocument.load(pdfBytes);
  const text = name.trim();
  const extraText = extra.trim();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(fontBytes);
  const page = doc.getPage(0);
  if (extraText) {
    let es = NAME_SLOT.extraFontSize;
    while (
      es > NAME_SLOT.minFontSize &&
      font.widthOfTextAtSize(extraText, es) > NAME_SLOT.maxWidth + 60
    )
      es -= 0.5;
    const ew = font.widthOfTextAtSize(extraText, es);
    page.drawText(extraText, {
      x: NAME_SLOT.centerX - ew / 2,
      y: NAME_SLOT.extraBaselineY,
      size: es,
      font,
      color: rgb(0.482, 0.118, 0.118),
    });
  }
  if (text) {
    let size = NAME_SLOT.fontSize;
    while (size > NAME_SLOT.minFontSize && font.widthOfTextAtSize(text, size) > NAME_SLOT.maxWidth)
      size -= 0.5;
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: NAME_SLOT.centerX - w / 2,
      y: NAME_SLOT.baselineY,
      size,
      font,
      color: rgb(0.482, 0.118, 0.118),
    });
  }
  const out = await doc.save();
  return new Blob([out as BlobPart], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
