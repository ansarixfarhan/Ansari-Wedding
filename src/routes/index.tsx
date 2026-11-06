import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buildInvitationPdf, downloadBlob, safeFileName, NAME_SLOT } from "@/lib/invitation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ansari Wedding – Send Invitation" },
      {
        name: "description",
        content: "Write the guest's name and share the Ansari Wedding invitation on WhatsApp.",
      },
      { property: "og:title", content: "Ansari Wedding – Send Invitation" },
      {
        property: "og:description",
        content: "Personalised Ansari Wedding invitation, ready to share on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PAGES = [1, 2, 3, 4].map((n) => `/invite/page-${n}.jpg`);

function Index() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"single" | "family" | "custom">("single");
  const [custom, setCustom] = useState("");
  const extra = mode === "family" ? "With Family" : mode === "custom" ? custom : "";
  const key = name + "|" + extra;
  const [pdf, setPdf] = useState<{ name: string; blob: Blob } | null>(null);
  const [busy, setBusy] = useState(false);

  // Pre-build the PDF shortly after typing stops, so share stays inside the click.
  useEffect(() => {
    setBusy(true);
    const t = setTimeout(async () => {
      const blob = await buildInvitationPdf(name, extra);
      setPdf({ name: key, blob });
      setBusy(false);
    }, 400);
    return () => clearTimeout(t);
  }, [key, name, extra]);

  const ready = !!pdf && pdf.name === key && !busy;
  const fileName = safeFileName(name);
  const message =
    `Assalamu Alaikum ${name.trim() || ""}${mode === "family" ? " & Family" : ""}, you are cordially invited to the Ansari Wedding. 🌸`.replace(
      "  ",
      " ",
    );

  const onExport = () => pdf && downloadBlob(pdf.blob, fileName);

  const onShare = async () => {
    if (!pdf) return;
    const file = new File([pdf.blob], fileName, { type: "application/pdf" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: message, title: "Ansari Wedding Invitation" });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    downloadBlob(pdf.blob, fileName);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const nameSize = Math.min(
    NAME_SLOT.fontSize,
    Math.max(NAME_SLOT.minFontSize, (NAME_SLOT.maxWidth / Math.max(name.trim().length, 1)) * 2.1),
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <header className="text-center">
          <h1 className="mt-2 font-display text-4xl text-foreground md:text-5xl">
            Send Your Invitation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter the guest's name, then share it on WhatsApp or download the PDF.
          </p>
        </header>

        <section className="sticky top-0 z-10 mt-6 rounded-xl border border-primary/40 bg-card/95 p-4 shadow-gold backdrop-blur">
          <label htmlFor="guest" className="block text-sm font-medium text-foreground">
            Guest name
          </label>
          <input
            id="guest"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mohd. Irfan Sahab"
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 font-display text-xl italic text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          />
          <div className="mt-3">
            <span className="block text-sm font-medium text-foreground">Invitation for</span>
            <div className="mt-1 grid grid-cols-3 gap-2" role="radiogroup">
              {(
                [
                  ["single", "Guest only"],
                  ["family", "With Family"],
                  ["custom", "Custom"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={mode === v}
                  onClick={() => setMode(v)}
                  className={mode === v ? "chip chip-active" : "chip"}
                >
                  {l}
                </button>
              ))}
            </div>
            {mode === "custom" && (
              <input
                aria-label="Custom line"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="e.g. With Wife & Children"
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2 font-display text-lg italic text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={onShare} disabled={!ready} className="btn-whatsapp">
              Share on WhatsApp
            </button>
            <button onClick={onExport} disabled={!ready} className="btn-gold">
              Download PDF
            </button>
          </div>
          <p className="mt-2 h-4 text-xs text-muted-foreground">{ready ? "" : "Preparing…"}</p>
        </section>

        <section className="mt-8 space-y-6">
          {PAGES.map((src, i) => (
            <div key={src} className="invite-page relative overflow-hidden rounded-md shadow-gold">
              <img src={src} alt={`Invitation page ${i + 1}`} className="block w-full" />
              {i === 0 && (name.trim() || extra.trim()) && (
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${NAME_SLOT.pageWidth} ${NAME_SLOT.pageHeight}`}
                >
                  <text
                    className="invite-name"
                    x={NAME_SLOT.centerX}
                    y={NAME_SLOT.pageHeight - NAME_SLOT.baselineY}
                    textAnchor="middle"
                    fontSize={nameSize}
                    textLength={
                      name.trim().length * nameSize * 0.48 > NAME_SLOT.maxWidth
                        ? NAME_SLOT.maxWidth
                        : undefined
                    }
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {name.trim()}
                  </text>
                  {extra.trim() && (
                    <text
                      className="invite-name"
                      x={NAME_SLOT.centerX}
                      y={NAME_SLOT.pageHeight - NAME_SLOT.extraBaselineY}
                      textAnchor="middle"
                      fontSize={NAME_SLOT.extraFontSize}
                    >
                      {extra.trim()}
                    </text>
                  )}
                </svg>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
