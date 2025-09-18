import React from "react";

const ChatbotFab: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mini fenêtre de chat simulée */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-w-[90vw] bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden z-40">
          <div className="px-4 py-3 bg-primary-600 text-white flex items-center justify-between">
            <span className="font-medium">Meldevsoft assistant IA</span>
            <button
              aria-label="Fermer le chatbot"
              className="text-white/90 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-3 text-sm text-gray-700 max-h-60 overflow-auto">
            <div className="bg-gray-100 rounded-lg p-3 w-fit max-w-[85%]">
              Bonjour 👋 Comment puis-je vous aider ?
            </div>
            <div className="bg-primary-50 text-primary-900 rounded-lg p-3 w-fit ml-auto max-w-[85%]">
              Ceci est une démo. Le chatbot n'est pas encore connecté.
            </div>
          </div>
          <div className="p-3 border-t border-gray-200">
            <input
              type="text"
              placeholder="Écrire un message..."
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsOpen(false);
                  alert("Simulation de chatbot: message envoyé.");
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        type="button"
        aria-label="Ouvrir le chatbot"
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center z-40 focus:outline-none focus:ring-4 focus:ring-primary-300"
        onClick={() => setIsOpen((v) => !v)}
      >
        {/* Icône bulle de chat (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M12 3c-4.97 0-9 3.582-9 8 0 1.937.795 3.708 2.137 5.088-.18 1.192-.741 2.39-1.793 3.442a.75.75 0 0 0 .53 1.28c2.29-.063 3.99-.733 5.18-1.54A10.88 10.88 0 0 0 12 19c4.97 0 9-3.582 9-8s-4.03-8-9-8Zm-4 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
        </svg>
      </button>
    </>
  );
};

export default ChatbotFab;
