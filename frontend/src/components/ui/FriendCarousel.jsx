import { AnimatePresence, motion } from "framer-motion";

import Typography from "./Typography";
import PrimaryButton from "./PrimaryButton";

function getImageLabel(index) {
  return `Companion option ${index + 1}`;
}

/**
 * A responsive, edge-to-edge portrait carousel.
 * The img element itself is the artwork: there is no second card/frame inside it.
 */
export default function FriendCarousel({
  images = [],
  current = 0,
  previous,
  next,
  direction = 1,
  friendName = "your best friend",
  companionQuotes = [],
  handleContinue,
  isSaving = false,
}) {
  if (!images.length) return null;

  const safeCurrent = ((current % images.length) + images.length) % images.length;
  const previousIndex = (safeCurrent - 1 + images.length) % images.length;
  const nextIndex = (safeCurrent + 1) % images.length;
  const quote = companionQuotes.length
    ? companionQuotes[safeCurrent % companionQuotes.length]
    : "Every little moment can become a memory.";

  const sideButtonStyle = {
    width: "100%",
    maxWidth: 205,
    maxHeight: "92%",
    aspectRatio: "2 / 3",
    alignSelf: "center",
    justifySelf: "center",
    overflow: "hidden",
    padding: 0,
    border: 0,
    borderRadius: 18,
    background: "transparent",
    cursor: isSaving || images.length < 2 ? "default" : "pointer",
    transformStyle: "preserve-3d",
  };

  const sideImageStyle = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
    borderRadius: "inherit",
    boxShadow: "0 14px 38px rgba(4,0,18,.34)",
    userSelect: "none",
  };

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col items-center"
      style={{ minHeight: 0 }}
    >
      {/* Portrait area. It gets its own bounded row, separate from the quote and button. */}
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div
          className="grid w-full grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)_minmax(0,0.76fr)] items-center gap-2 sm:gap-5"
          style={{
            width: "100%",
            maxWidth: 1040,
            height: "100%",
            minHeight: 0,
            perspective: 1400,
            margin: "0 auto",
          }}
        >
          {/* Previous portrait: the image itself fills the selectable area. */}
          <motion.button
            type="button"
            key={`previous-${previousIndex}`}
            onClick={previous}
            disabled={isSaving || images.length < 2}
            aria-label="Show previous companion"
            initial={{ opacity: 0, x: -22, rotateY: 17, scale: 0.9 }}
            animate={{ opacity: 0.74, x: 0, rotateY: 10, scale: 0.94 }}
            whileHover={!isSaving ? { opacity: 1, scale: 0.98, x: 2 } : {}}
            whileTap={!isSaving ? { scale: 0.9 } : {}}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={sideButtonStyle}
            className="relative border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <img
              src={images[previousIndex]}
              alt={getImageLabel(previousIndex)}
              draggable="false"
              style={sideImageStyle}
            />
            <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-[#10051f]/38 via-transparent to-white/[0.04]" />
            <span className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[9px] font-semibold tracking-[0.13em] text-white/90 sm:bottom-3 sm:text-[10px]">
              PREVIOUS
            </span>
          </motion.button>

          {/* Selected portrait. Intrinsic proportions are preserved to avoid head/foot cropping. */}
          <div className="relative flex h-full min-w-0 items-center justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full"
              style={{
                inset: "6% -16%",
                background:
                  "radial-gradient(ellipse, rgba(168,85,247,.26), rgba(99,40,190,.09) 48%, transparent 73%)",
                filter: "blur(25px)",
              }}
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={`selected-${safeCurrent}`}
                src={images[safeCurrent]}
                alt={`Selected companion for ${friendName}`}
                draggable="false"
                initial={{
                  opacity: 0,
                  x: direction * 42,
                  rotateY: direction * 24,
                  rotateZ: direction * 0.8,
                  scale: 0.94,
                }}
                animate={{ opacity: 1, x: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: direction * -32,
                  rotateY: direction * -20,
                  rotateZ: direction * -0.6,
                  scale: 0.96,
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[1] block max-w-full rounded-[18px] sm:rounded-[22px]"
                style={{
                  height: "100%",
                  width: "auto",
                  maxWidth: "100%",
                  aspectRatio: "2 / 3",
                  objectFit: "contain",
                  objectPosition: "center center",
                  border: "1px solid rgba(226,196,255,.55)",
                  boxShadow:
                    "0 18px 48px rgba(5,0,20,.38), 0 0 28px rgba(168,85,247,.22)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  userSelect: "none",
                }}
              />
            </AnimatePresence>
          </div>

          {/* Next portrait */}
          <motion.button
            type="button"
            key={`next-${nextIndex}`}
            onClick={next}
            disabled={isSaving || images.length < 2}
            aria-label="Show next companion"
            initial={{ opacity: 0, x: 22, rotateY: -17, scale: 0.9 }}
            animate={{ opacity: 0.74, x: 0, rotateY: -10, scale: 0.94 }}
            whileHover={!isSaving ? { opacity: 1, scale: 0.98, x: -2 } : {}}
            whileTap={!isSaving ? { scale: 0.9 } : {}}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={sideButtonStyle}
            className="relative border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <img
              src={images[nextIndex]}
              alt={getImageLabel(nextIndex)}
              draggable="false"
              style={sideImageStyle}
            />
            <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-[#10051f]/38 via-transparent to-white/[0.04]" />
            <span className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[9px] font-semibold tracking-[0.13em] text-white/90 sm:bottom-3 sm:text-[10px]">
              NEXT
            </span>
          </motion.button>
        </div>
      </div>

      {/* This row starts only after the portrait row ends, so the quote cannot overlap the photo. */}
      <div className="mt-2 flex min-h-[22px] w-full shrink-0 items-center justify-center px-3 text-center sm:mt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`quote-${safeCurrent}`}
            initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(1px)" }}
            transition={{ duration: 0.24 }}
            className="m-0 max-w-2xl text-center text-[12px] font-semibold leading-5 text-[#F6EBFF]/95 sm:text-[14px]"
          >
            {quote}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Compact indicators */}
      <div
        className="mt-2 flex h-[6px] shrink-0 items-center justify-center gap-1.5"
        aria-label={`Companion ${safeCurrent + 1} of ${images.length}`}
      >
        {images.map((image, index) => (
          <motion.span
            key={`${index}-${String(image)}`}
            animate={{
              width: safeCurrent === index ? 18 : 5,
              opacity: safeCurrent === index ? 1 : 0.32,
              backgroundColor: safeCurrent === index ? "#D5A0FF" : "#FFFFFF",
            }}
            transition={{ duration: 0.2 }}
            className="block rounded-full"
            style={{
              height: 5,
              boxShadow:
                safeCurrent === index ? "0 0 9px rgba(197,140,255,.7)" : "none",
            }}
          />
        ))}
      </div>

      {/* Stable bottom action row; the heart stays on the same line as the label. */}
      <div
        className="flex w-full shrink-0 justify-center px-4"
        style={{ marginTop: 8, paddingTop: 3, paddingBottom: 3 }}
      >
        <div className="w-full" style={{ maxWidth: 340 }}>
          <PrimaryButton
            onClick={handleContinue}
            disabled={isSaving}
            loading={isSaving}
            size="sm"
            className="!h-12 !whitespace-nowrap !rounded-full !px-4"
          >
            {isSaving ? "Saving your friend…" : "Choose this companion 💜"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
