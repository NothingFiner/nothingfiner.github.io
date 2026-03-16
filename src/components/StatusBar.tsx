import { RAGStatus } from '../types';

interface StatusBarProps {
  status: RAGStatus;
  progress: number;
}

const StatusBar = ({ status, progress }: StatusBarProps) => {
  if (status === RAGStatus.Loading) {
    return (
      <div class="rounded-t-xl glass p-4 pb-6">
        <div class="flex items-center gap-3 text-theme">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="text-sm">Loading model... {progress}%</span>
        </div>
        <div class="mt-2 h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
          <div 
            class="h-full bg-[var(--color-accent-green)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (status === RAGStatus.Ready) {
    return (
      <div class="rounded-t-xl glass p-4 pb-6">
        <div class="flex items-center gap-2 text-[var(--color-accent-green)]">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm">Model ready</span>
        </div>
      </div>
    );
  }

  if (status === RAGStatus.Error) {
    return (
      <div class="rounded-t-xl glass p-4 pb-6 border-t border-x border-red-500/30 rounded-b-none">
        <div class="flex items-center gap-2 text-red-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">Model failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div class="rounded-t-xl glass p-4 pb-6">
      <div class="flex items-center gap-2 text-theme/50">
        <span class="text-sm">Initializing...</span>
      </div>
    </div>
  );
};

export default StatusBar;
