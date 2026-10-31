export function Resume() {
  return (
    <div class="min-h-screen p-8">
      <div class="max-w-4xl mx-auto">
        <div class="rounded-2xl site-panel p-8 overflow-hidden">
          <iframe
            src="/assets/resume.pdf"
            class="w-full h-[80vh] rounded-lg border border-[var(--panel-keyline)]"
          >
            <p class="text-theme">
              Your browser does not support PDFs.
              <a href="/assets/resume.pdf" target="_blank" class="text-accent-green underline">
                Download the PDF instead
              </a>.
            </p>
          </iframe>
        </div>
      </div>
    </div>
  );
}
