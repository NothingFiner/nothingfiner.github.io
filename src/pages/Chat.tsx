import ChatInterface from '../components/ChatInterface';

export function Chat() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center p-8">
      <div class="w-full max-w-3xl">
        <main class="mb-4">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
