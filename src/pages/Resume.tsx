export function Resume() {
  return (
    <div class="min-h-screen p-8">
      <div class="max-w-4xl mx-auto">
        <div class="rounded-2xl glass p-8 overflow-hidden">
          <iframe
            src="/assets/resume.pdf"
            class="w-full h-[80vh] rounded-lg border border-[var(--glass-border)]"
            style={{ boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)' }}
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
