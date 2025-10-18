import React from "react";

const sizeMap = {
  sm: { img: "h-7 w-auto" },
  md: { img: "h-8 w-auto" },
  lg: { img: "h-10 md:h-12 w-auto" },
};

export default function BrandLogo({
  withText = true,
  size = "md",
  textLight = false,
  className = "",
  imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689e0571cccd33032d86cda3/e81f39e80_89e57715f_IMG_46331.png",
  imageIncludesText = true
}) {
  const s = sizeMap[size] || sizeMap.md;
  const [imgError, setImgError] = React.useState(false);

  const showText = withText && !imageIncludesText;

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Course Spark logo">
      {!imgError ? (
        <img
          src={imageUrl}
          alt="Course Spark logo"
          className={`${s.img} drop-shadow-sm`}
          loading="eager"
          onError={() => setImgError(true)}
        />
      ) : (
        // Fallback to simple mark if image fails to load
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg flex items-center justify-center">
          <span className="font-extrabold tracking-tight text-white text-xs">CS</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" aria-hidden="true" />
        </div>
      )}
      {showText && (
        <h2 className={`font-bold ${textLight ? "text-white" : "text-slate-800"} tracking-tight text-sm sm:text-base`}>
          Course Spark
        </h2>
      )}
    </div>
  );
}