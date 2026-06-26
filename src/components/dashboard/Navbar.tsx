import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDebounce } from "../../hooks/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventResult {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image?: string;
}

// ─── Search Results Dropdown ──────────────────────────────────────────────────

interface SearchDropdownProps {
  results: EventResult[];
  isLoading: boolean;
  query: string;
  activeIndex: number;
  onSelect: (event: EventResult) => void;
  onViewAll: () => void;
  scrolled: boolean;
}

function SearchDropdown({
  results,
  isLoading,
  query,
  activeIndex,
  onSelect,
  onViewAll,
  scrolled,
}: SearchDropdownProps) {
  const dropdownBg = scrolled
    ? "bg-gray-900/95 border-blue-400/30"
    : "bg-white border-gray-200";
  const textPrimary = scrolled ? "text-white" : "text-gray-900";
  const textSecondary = scrolled ? "text-white/60" : "text-gray-500";
  const itemHover = scrolled ? "hover:bg-white/10" : "hover:bg-blue-50";
  const activeItem = scrolled ? "bg-white/15" : "bg-blue-50";
  const dividerColor = scrolled ? "border-white/10" : "border-gray-100";

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl z-50 ${dropdownBg}`}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className={`text-sm ${textSecondary}`}>Mencari event...</span>
        </div>
      )}

      {/* No results */}
      {!isLoading && results.length === 0 && query.length >= 2 && (
        <div className="px-5 py-6 text-center">
          <div className="text-2xl mb-2">🔍</div>
          <p className={`text-sm font-medium ${textPrimary}`}>
            Tidak ada event untuk &ldquo;{query}&rdquo;
          </p>
          <p className={`text-xs mt-1 ${textSecondary}`}>
            Coba kata kunci yang berbeda
          </p>
        </div>
      )}

      {/* Results list */}
      {!isLoading && results.length > 0 && (
        <>
          <div className={`px-4 py-2.5 border-b ${dividerColor}`}>
            <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>
              Hasil Pencarian
            </span>
          </div>
          <ul>
            {results.map((event, index) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onSelect(event)}
                  className={`w-full text-left flex items-center gap-4 px-4 py-3 transition-all ${itemHover} ${
                    index === activeIndex ? activeItem : ""
                  }`}
                >
                  {/* Event thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg">🎪</span>
                    )}
                  </div>

                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${textPrimary}`}>
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                        {event.category}
                      </span>
                      <span className={`text-xs ${textSecondary}`}>
                        {event.date}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${textSecondary}`}>
                      📍 {event.location}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-shrink-0 ${textSecondary}`}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
                {index < results.length - 1 && (
                  <div className={`mx-4 border-b ${dividerColor}`} />
                )}
              </li>
            ))}
          </ul>

          {/* View all results footer */}
          <div className={`border-t ${dividerColor}`}>
            <button
              type="button"
              onClick={onViewAll}
              className={`w-full px-4 py-3 text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 transition-colors ${itemHover}`}
            >
              Lihat semua hasil untuk &ldquo;{query}&rdquo;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Search Input Component ───────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  isMobile?: boolean;
  autoFocus?: boolean;
  inputBg: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
}

function SearchInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onFocus,
  isMobile = false,
  autoFocus = false,
  inputBg,
  borderColor,
  textColor,
  textMuted,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Cari event favoritmu..."
        autoFocus={autoFocus}
        autoComplete="off"
        className={`w-full px-5 ${isMobile ? "py-3" : "py-2.5"} pl-12 ${inputBg} border ${borderColor} rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${textColor} placeholder-gray-400`}
      />
      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted} pointer-events-none`}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted} hover:text-blue-400 transition p-1 rounded-md`}
          aria-label="Hapus pencarian"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}

// ─── Main Navbar Component ────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<EventResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 400);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // ── Scroll handler ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Reset on route change ─────────────────────────────────────────────────
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsDropdownOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // ── Fetch search results ──────────────────────────────────────────────────
  // Ganti fetchSearchResults ini dengan panggilan API nyata kamu
  const fetchSearchResults = useCallback(async (query: string): Promise<EventResult[]> => {
    // ============================================================
    // GANTI DENGAN API CALL NYATA, contoh:
    //
    // const res = await fetch(`/api/events/search?q=${encodeURIComponent(query)}`);
    // const data = await res.json();
    // return data.events;
    //
    // ============================================================

    // Data dummy untuk preview — hapus ini setelah connect ke API
    await new Promise((r) => setTimeout(r, 300)); // simulasi network delay
    const mock: EventResult[] = [
      { id: "1", title: "Jazz Night Jakarta 2025", category: "Musik", date: "28 Jun 2025", location: "Istora Senayan, Jakarta", image: "" },
      { id: "2", title: "Kompetisi Startup Indonesia", category: "Bisnis", date: "5 Jul 2025", location: "SCBD, Jakarta Selatan", image: "" },
      { id: "3", title: "Festival Kuliner Nusantara", category: "Food", date: "12 Jul 2025", location: "Monas, Jakarta Pusat", image: "" },
      { id: "4", title: "Tech Conference 2025", category: "Teknologi", date: "19 Jul 2025", location: "JCC Senayan, Jakarta", image: "" },
      { id: "5", title: "Pameran Seni Rupa Modern", category: "Seni", date: "26 Jul 2025", location: "Galeri Nasional, Jakarta", image: "" },
    ];
    return mock.filter(
      (e) =>
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase()) ||
        e.location.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // ── Trigger search when debounced query changes ───────────────────────────
  useEffect(() => {
    if (debouncedSearch.trim().length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    setIsDropdownOpen(true);

    fetchSearchResults(debouncedSearch)
      .then((results) => {
        setSearchResults(results);
        setActiveIndex(-1);
      })
      .catch(console.error)
      .finally(() => setIsSearchLoading(false));
  }, [debouncedSearch, fetchSearchResults]);

  // ── Close dropdown on click outside ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMobile = mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = searchResults[activeIndex];
      if (selected) handleSelectResult(selected);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  // ── Submit search (Enter or button) ──────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
    }
  };

  // ── Select individual result ──────────────────────────────────────────────
  const handleSelectResult = (event: EventResult) => {
    router.push(`/events/${event.id}`);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  // ── View all results ──────────────────────────────────────────────────────
  const handleViewAll = () => {
    router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsDropdownOpen(false);
  };

  // ── Show loading dots when user is typing (before debounce fires) ─────────
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearchLoading(true);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
      setIsSearchLoading(false);
    }
  };

  const handleLinkClick = () => setMenuOpen(false);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#") && router.pathname === "/") {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ── Style helpers ─────────────────────────────────────────────────────────
  const textColor = scrolled ? "text-white" : "text-gray-900";
  const textMuted = scrolled ? "text-white/70" : "text-gray-500";
  const borderColor = scrolled ? "border-blue-400/30" : "border-gray-200";
  const inputBg = scrolled ? "bg-white/15 text-white" : "bg-gray-100 text-gray-900";
  const hoverBg = scrolled ? "hover:bg-white/10" : "hover:bg-gray-100";

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Event", href: "/login" },
    { name: "Kategori", href: "/login" },
    { name: "Tentang Kami", href: "/tentang" },
  ];

  const sharedSearchProps = {
    value: searchQuery,
    onChange: handleSearchChange,
    onSubmit: handleSearchSubmit,
    onKeyDown: handleKeyDown,
    onFocus: () => {
      if (searchQuery.trim().length >= 2) setIsDropdownOpen(true);
    },
    inputBg,
    borderColor,
    textColor,
    textMuted,
  };

  const sharedDropdownProps = {
    results: searchResults,
    isLoading: isSearchLoading,
    query: searchQuery,
    activeIndex,
    onSelect: handleSelectResult,
    onViewAll: handleViewAll,
    scrolled,
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 backdrop-blur-xl border-b border-blue-400/30 shadow-lg"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src="/zenix-logo.png" alt="Zenix Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors ${textColor}`}>
              zenix
            </span>
          </Link>

          {/* ── Desktop Search ────────────────────────────────── */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="w-full relative" ref={searchContainerRef}>
              <SearchInput {...sharedSearchProps} />
              {isDropdownOpen && (
                <SearchDropdown {...sharedDropdownProps} />
              )}
            </div>
          </div>

          {/* ── Right Side ────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Auth buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className={`px-5 py-2.5 text-sm font-medium border rounded-xl transition-all ${
                  scrolled
                    ? "text-white border-white/40 hover:bg-white/10 hover:border-white/60"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-lg ${
                  scrolled
                    ? "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-400 shadow-white/25 hover:shadow-white/40"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                }`}
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) {
                  setIsDropdownOpen(false);
                  setSearchQuery("");
                }
              }}
              className={`md:hidden p-2 rounded-lg transition-all ${
                scrolled
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="Toggle search"
            >
              {isSearchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </button>

            {/* Burger menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                scrolled
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
                ) : (
                  <><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar ──────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isSearchOpen ? "max-h-64 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative" ref={mobileSearchContainerRef}>
            <SearchInput {...sharedSearchProps} isMobile autoFocus={isSearchOpen} />
            {isDropdownOpen && isSearchOpen && (
              <SearchDropdown {...sharedDropdownProps} />
            )}
          </div>
        </div>

        {/* ── Navigation Menu ────────────────────────────────── */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`flex flex-col gap-1 pt-4 border-t ${borderColor}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  handleLinkClick();
                  scrollToSection(link.href);
                }}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  scrolled
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="font-medium">{link.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${scrolled ? "text-white" : "text-blue-600"}`}
                >
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* Mobile auth buttons */}
            <div className={`sm:hidden flex flex-col gap-3 pt-6 mt-2 border-t ${borderColor}`}>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className={`w-full text-center px-5 py-3 text-sm font-medium border rounded-xl transition-all ${
                  scrolled
                    ? "text-white border-white/40 hover:bg-white/10"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={handleLinkClick}
                className={`w-full text-center px-5 py-3 text-sm font-semibold rounded-xl transition-all ${
                  scrolled
                    ? "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-400"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                }`}
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}