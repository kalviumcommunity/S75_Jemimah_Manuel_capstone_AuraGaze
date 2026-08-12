import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSmile,
  FiThumbsUp,
  FiHeart,
  FiCoffee,
  FiGift,
  FiSearch,
  FiClock,
} from "react-icons/fi";

// Small, curated emoji set (not a giant unicode dump) — each entry
// carries a few searchable keywords. Add more here as needed.
const CATEGORIES = [
  {
    key: "smileys",
    label: "Smileys",
    icon: FiSmile,
    emojis: [
      { char: "😀", name: "grinning happy" },
      { char: "😂", name: "joy laughing tears lol" },
      { char: "😍", name: "heart eyes love" },
      { char: "🥰", name: "smiling hearts love" },
      { char: "😘", name: "kiss" },
      { char: "😅", name: "sweat smile nervous phew" },
      { char: "😭", name: "crying sobbing sad" },
      { char: "🥺", name: "pleading puppy eyes please" },
      { char: "😴", name: "sleeping tired" },
      { char: "🤔", name: "thinking hmm" },
      { char: "😎", name: "cool sunglasses" },
      { char: "🙃", name: "upside down silly" },
    ],
  },
  {
    key: "gestures",
    label: "Gestures",
    icon: FiThumbsUp,
    emojis: [
      { char: "👍", name: "thumbs up ok yes good" },
      { char: "👎", name: "thumbs down no bad" },
      { char: "👏", name: "clap applause nice" },
      { char: "🙌", name: "praise hands celebrate yay" },
      { char: "🤝", name: "handshake deal" },
      { char: "✌️", name: "peace victory" },
      { char: "🤞", name: "fingers crossed hope" },
      { char: "👋", name: "wave hello bye" },
      { char: "🙏", name: "pray thanks please" },
      { char: "💪", name: "strong muscle flex" },
    ],
  },
  {
    key: "hearts",
    label: "Hearts",
    icon: FiHeart,
    emojis: [
      { char: "❤️", name: "red heart love" },
      { char: "🧡", name: "orange heart" },
      { char: "💛", name: "yellow heart" },
      { char: "💚", name: "green heart" },
      { char: "💙", name: "blue heart" },
      { char: "💜", name: "purple heart" },
      { char: "🖤", name: "black heart" },
      { char: "💔", name: "broken heart sad" },
      { char: "💕", name: "two hearts love" },
      { char: "💖", name: "sparkling heart" },
      { char: "💯", name: "hundred perfect" },
      { char: "✨", name: "sparkles magic" },
    ],
  },
  {
    key: "food",
    label: "Food",
    icon: FiCoffee,
    emojis: [
      { char: "☕", name: "coffee" },
      { char: "🍕", name: "pizza" },
      { char: "🍔", name: "burger" },
      { char: "🍜", name: "noodles ramen" },
      { char: "🍰", name: "cake dessert" },
      { char: "🍫", name: "chocolate" },
      { char: "🍩", name: "donut" },
      { char: "🍓", name: "strawberry fruit" },
      { char: "🍺", name: "beer drink" },
      { char: "🍎", name: "apple fruit" },
    ],
  },
  {
    key: "celebration",
    label: "Celebrate",
    icon: FiGift,
    emojis: [
      { char: "🎉", name: "party popper celebrate" },
      { char: "🎂", name: "birthday cake" },
      { char: "🎁", name: "gift present" },
      { char: "🎈", name: "balloon" },
      { char: "🥳", name: "party face celebrate" },
      { char: "🔥", name: "fire lit hot" },
      { char: "⭐", name: "star" },
      { char: "🏆", name: "trophy win" },
      { char: "🎶", name: "music notes" },
      { char: "🎊", name: "confetti party" },
    ],
  },
];

const RECENTS_KEY = "aura:recent-emojis";
const MAX_RECENTS = 12;

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecents(list) {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable (private browsing etc.) — recents just won't persist
  }
}

export default function EmojiPicker({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(loadRecents);

  const allEmojis = useMemo(() => CATEGORIES.flatMap((c) => c.emojis), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return allEmojis.filter((e) => e.name.includes(q));
  }, [query, allEmojis]);

  const handlePick = (emoji) => {
    onSelect(emoji);

    setRecents((prev) => {
      const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, MAX_RECENTS);
      saveRecents(next);
      return next;
    });

    // Note: intentionally NOT calling onClose() here — picking several
    // emoji in a row without the popover closing each time feels better.
  };

  const activeEmojis =
    activeCategory === "recent"
      ? recents.map((char) => ({ char, name: "" }))
      : CATEGORIES.find((c) => c.key === activeCategory)?.emojis || [];

  const gridEmojis = searchResults ?? activeEmojis;

  return (
    <div className="w-72">
      {/* Search */}
      <div
        className="
          flex
          items-center
          gap-2
          px-3
          py-2
          mb-2
          rounded-2xl
          bg-white/[0.06]
          border
          border-white/10
        "
      >
        <FiSearch size={14} className="text-white/40 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emoji"
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-white
            placeholder:text-white/40
          "
        />
      </div>

      {/* Category tabs — hidden while searching */}
      {!query.trim() && (
        <div className="flex items-center gap-1 mb-2 px-0.5 overflow-x-auto">
          {recents.length > 0 && (
            <CategoryTab
              active={activeCategory === "recent"}
              icon={FiClock}
              label="Recent"
              onClick={() => setActiveCategory("recent")}
            />
          )}

          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.key}
              active={activeCategory === cat.key}
              icon={cat.icon}
              label={cat.label}
              onClick={() => setActiveCategory(cat.key)}
            />
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="h-40 overflow-y-auto pr-1">
        {gridEmojis.length === 0 ? (
          <p className="text-xs text-white/40 text-center mt-14">No emoji found</p>
        ) : (
          <div className="grid grid-cols-6 gap-1">
            {gridEmojis.map((e, i) => (
              <button
                key={`${e.char}-${i}`}
                onClick={() => handlePick(e.char)}
                title={e.name}
                className="
                  h-10
                  w-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-xl
                  hover:bg-white/10
                  transition-colors
                "
              >
                {e.char}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryTab({ active, icon: Icon, label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={label}
      className={`
        shrink-0
        h-8
        w-8
        rounded-xl
        flex
        items-center
        justify-center
        transition-colors
        ${active ? "bg-violet-500/25 text-violet-200" : "text-white/40 hover:bg-white/10 hover:text-white/70"}
      `}
    >
      <Icon size={14} />
    </motion.button>
  );
}