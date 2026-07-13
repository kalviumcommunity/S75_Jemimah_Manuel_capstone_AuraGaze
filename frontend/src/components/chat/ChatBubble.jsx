export default function ChatBubble({ sender, text, image }) {
  const isAI = sender === "ai";

  return (
    <div
      className={`w-full flex mb-6 ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI && (
        <img
          src={image}
          alt="friend"
          className="w-10 h-10 rounded-full object-cover mr-3 mt-1"
        />
      )}

      <div
        className={`max-w-[65%] px-5 py-4 rounded-3xl text-white leading-7 ${
          isAI
            ? "bg-white/10 border border-white/10"
            : "bg-gradient-to-r from-[#8E63FF] to-[#C58CFF]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}