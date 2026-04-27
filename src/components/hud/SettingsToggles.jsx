export default function SettingsToggles({ soundOn, hapticOn, onToggleSound, onToggleHaptic }) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-row gap-2 z-30 pointer-events-auto">
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSound() }}
        aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
        className="w-9 h-9 rounded-xl bg-black/35 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/85 active:scale-95 transition"
      >
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>
          </svg>
        )}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleHaptic() }}
        aria-label={hapticOn ? 'Disable haptics' : 'Enable haptics'}
        className="w-9 h-9 rounded-xl bg-black/35 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/85 active:scale-95 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="3" width="12" height="18" rx="2"/><line x1="12" y1="17" x2="12" y2="17.01"/>
          {!hapticOn && <line x1="3" y1="3" x2="21" y2="21"/>}
        </svg>
      </button>
    </div>
  )
}
