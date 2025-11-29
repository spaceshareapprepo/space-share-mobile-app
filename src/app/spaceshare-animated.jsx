import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, MessageCircle, User, Plane, ChevronRight, Shield, Clock, MapPin, Star, Check, ArrowRight, Menu, Bell, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

// Keyframe animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes planeMove {
    0% { transform: translateX(-5px) rotate(45deg); }
    50% { transform: translateX(5px) rotate(45deg); }
    100% { transform: translateX(-5px) rotate(45deg); }
  }

  @keyframes dashMove {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -20; }
  }

  @keyframes gentlePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes expandWidth {
    from { width: 48px; }
    to { width: auto; }
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(2deg); }
    75% { transform: translateY(-4px) rotate(-2deg); }
  }

  @keyframes splashFadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.1); }
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .animate-fade-out {
    animation: fadeOut 0.5s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-bounce-in {
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-plane {
    animation: planeMove 2s ease-in-out infinite;
  }

  .animate-gentle-pulse {
    animation: gentlePulse 2s ease-in-out infinite;
  }

  .animate-logo-float {
    animation: logoFloat 4s ease-in-out infinite;
  }

  .animate-splash-fade-out {
    animation: splashFadeOut 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }

  .card-hover {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card-hover:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  }

  .card-hover:active {
    transform: translateY(-2px) scale(0.99);
  }

  .btn-hover {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .btn-hover:hover {
    transform: scale(1.02);
  }

  .btn-hover:active {
    transform: scale(0.98);
  }

  .chip-hover {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .chip-hover:hover {
    transform: translateY(-2px);
  }

  .input-focus {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .input-focus:focus {
    transform: scale(1.01);
    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
  }

  .nav-item {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .tab-indicator {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .icon-bounce {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .icon-bounce:hover {
    transform: scale(1.1) rotate(-5deg);
  }

  .notification-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }

  .gradient-shift {
    background-size: 200% 200%;
    animation: gradientShift 5s ease infinite;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .smooth-scroll {
    scroll-behavior: smooth;
  }

  .glass-effect {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Page transition */
  .page-enter {
    opacity: 0;
    transform: translateX(20px);
  }

  .page-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .page-exit {
    opacity: 1;
    transform: translateX(0);
  }

  .page-exit-active {
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

// SpaceShare - Modern Travel Luggage Sharing App with Animations
export default function SpaceShareApp() {
  const [appState, setAppState] = useState('splash'); // 'splash', 'login', 'app'
  const [activeTab, setActiveTab] = useState('search');
  const [listingType, setListingType] = useState('space');
  const [activeFilter, setActiveFilter] = useState('travellers');
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);

  // Splash screen timer
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setSplashExiting(true);
        setTimeout(() => {
          setAppState('login');
          setSplashExiting(false);
        }, 600);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    if (appState === 'app') {
      setIsLoaded(true);
    }
  }, [appState]);

  useEffect(() => {
    setPageKey(prev => prev + 1);
  }, [activeTab]);

  const handleLogin = () => {
    setAppState('app');
  };

  const tabs = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'create', icon: Plus, label: 'Publish' },
    { id: 'spaces', icon: Package, label: 'My Spaces' },
    { id: 'inbox', icon: MessageCircle, label: 'Inbox' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const quickFilters = [
    { label: 'JFK → ACC', active: true },
    { label: 'Urgent medical', active: false },
    { label: 'LAX → ACC', active: false },
    { label: 'Fashion samples', active: false },
  ];

  const travellers = [
    {
      id: 1,
      name: 'Sarah M.',
      avatar: '👩🏾',
      from: 'ORD',
      fromCity: 'Chicago',
      to: 'ACC',
      toCity: 'Accra',
      date: 'Dec 10',
      price: 80,
      weight: 10,
      verified: true,
      rating: 4.9,
      trips: 12,
      description: 'Flying next week. Can help with gifts, documents, or personal items.',
    },
    {
      id: 2,
      name: 'Kwame A.',
      avatar: '👨🏿',
      from: 'JFK',
      fromCity: 'New York',
      to: 'ACC',
      toCity: 'Accra',
      date: 'Dec 15',
      price: 150,
      weight: 8,
      verified: true,
      rating: 4.7,
      trips: 8,
      description: 'Regular traveler. Accepting sealed packages only.',
    },
    {
      id: 3,
      name: 'Ama K.',
      avatar: '👩🏾‍💼',
      from: 'LAX',
      fromCity: 'Los Angeles',
      to: 'ACC',
      toCity: 'Accra',
      date: 'Dec 18',
      price: 120,
      weight: 15,
      verified: true,
      rating: 5.0,
      trips: 24,
      description: 'Business traveler. Priority handling available.',
    },
  ];

  const renderSearchScreen = () => (
    <div className="flex-1 overflow-auto smooth-scroll" key={pageKey}>
      {/* Hero Section */}
      <div 
        className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 mx-4 mt-4 rounded-3xl p-6 relative overflow-hidden animate-scale-in gradient-shift"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 animate-float" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '1s' }} />
        
        <h1 className="text-3xl font-bold text-black leading-tight animate-fade-in-up">
          Find your<br />
          <span className="italic font-light">perfect</span> match
        </h1>
        <p className="text-black/70 mt-2 text-sm max-w-[200px] animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          USA ↔ Ghana corridor
        </p>
        
        {/* Search Input */}
        <div className="mt-4 bg-white rounded-2xl flex items-center px-4 py-3 shadow-lg animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Airport, city, or item..."
            className="flex-1 ml-3 outline-none text-gray-800 bg-transparent input-focus"
          />
          <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium btn-hover">
            Search
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {quickFilters.map((filter, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap chip-hover animate-fade-in-up ${
              filter.active
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{ opacity: 0, animationDelay: `${0.1 + idx * 0.05}s` }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Toggle: Travellers / Shipments */}
      <div className="mx-4 mt-6 bg-gray-100 rounded-2xl p-1 flex animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
        <button
          onClick={() => setActiveFilter('travellers')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold tab-indicator ${
            activeFilter === 'travellers'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          Travellers
        </button>
        <button
          onClick={() => setActiveFilter('shipments')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold tab-indicator ${
            activeFilter === 'shipments'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          Shipments
        </button>
      </div>

      {/* Results Count */}
      <div className="px-4 mt-6 flex items-center justify-between animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
        <h2 className="text-xl font-bold text-black">
          {travellers.length} matches
        </h2>
        <button className="text-sm text-gray-500 flex items-center gap-1 btn-hover">
          Sort by <ChevronRight size={16} />
        </button>
      </div>

      {/* Traveller Cards */}
      <div className="px-4 mt-4 space-y-4 pb-32">
        {travellers.map((traveller, idx) => (
          <div
            key={traveller.id}
            className="animate-fade-in-up"
            style={{ opacity: 0, animationDelay: `${0.3 + idx * 0.1}s` }}
          >
            <TravellerCard traveller={traveller} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateScreen = () => (
    <div className="flex-1 overflow-auto pb-32 smooth-scroll" key={pageKey}>
      {/* Header */}
      <div className="px-4 pt-4">
        <h1 className="text-3xl font-bold text-black animate-fade-in-up">
          Create a<br />
          <span className="italic font-light">listing</span>
        </h1>
      </div>

      {/* Listing Type Toggle */}
      <div className="mx-4 mt-6 bg-gray-100 rounded-2xl p-1 flex animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
        <button
          onClick={() => setListingType('space')}
          className={`flex-1 py-4 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 tab-indicator ${
            listingType === 'space'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          <Plane size={20} className={listingType === 'space' ? 'animate-plane' : ''} />
          Space to sell
        </button>
        <button
          onClick={() => setListingType('item')}
          className={`flex-1 py-4 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 tab-indicator ${
            listingType === 'item'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          <Package size={20} className={listingType === 'item' ? 'animate-bounce-in' : ''} />
          Item to send
        </button>
      </div>

      {/* Form */}
      <div className="px-4 mt-6 space-y-4">
        {/* Title */}
        <div className="animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Listing title</label>
          <input
            type="text"
            placeholder="e.g. JFK → ACC with 18kg space"
            className="w-full bg-gray-100 rounded-2xl px-4 py-4 outline-none input-focus"
          />
        </div>

        {/* Route Selection */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 animate-fade-in-up stagger-3 card-hover" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">From</p>
              <input
                type="text"
                placeholder="Origin"
                className="text-2xl font-bold text-black outline-none w-full bg-transparent"
              />
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mx-4 animate-pulse-slow">
              <Plane size={20} className="text-black rotate-45" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-400 mb-1">To</p>
              <input
                type="text"
                placeholder="Destination"
                className="text-2xl font-bold text-black outline-none w-full bg-transparent text-right"
              />
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-gray-100 rounded-2xl p-4 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <p className="text-xs text-gray-400 mb-2">Departure date</p>
          <div className="flex gap-2">
            {['Today', '08', '09', '10', '11', '12'].map((day, idx) => (
              <button
                key={idx}
                className={`flex-1 py-3 rounded-xl text-sm font-medium chip-hover ${
                  idx === 0
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Weight */}
        <div className="flex gap-4 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Price per kg</label>
            <div className="bg-gray-100 rounded-2xl px-4 py-4 flex items-center input-focus">
              <span className="text-amber-500 font-bold text-xl mr-2">$</span>
              <input
                type="number"
                placeholder="0"
                className="flex-1 outline-none bg-transparent text-xl font-bold"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Max weight</label>
            <div className="bg-gray-100 rounded-2xl px-4 py-4 flex items-center input-focus">
              <input
                type="number"
                placeholder="0"
                className="flex-1 outline-none bg-transparent text-xl font-bold"
              />
              <span className="text-gray-400 font-medium ml-2">kg</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="animate-fade-in-up stagger-6" style={{ opacity: 0 }}>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Description</label>
          <textarea
            placeholder="What are you offering? Include timing and restrictions..."
            rows={4}
            className="w-full bg-gray-100 rounded-2xl px-4 py-4 outline-none input-focus resize-none"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 mt-4 btn-hover animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.4s' }}>
          Publish listing
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderMySpacesScreen = () => (
    <div className="flex-1 overflow-auto pb-32 smooth-scroll" key={pageKey}>
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black mx-4 mt-4 rounded-3xl p-6 relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 right-0 opacity-10 animate-float">
          <Package size={120} />
        </div>
        <h1 className="text-2xl font-bold text-white animate-fade-in-up">
          My Shared<br />
          <span className="text-amber-400 italic font-light">Spaces</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          Track items & manage commitments
        </p>
        
        {/* Stats */}
        <div className="flex gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 flex-1 animate-fade-in-up stagger-2 card-hover" style={{ opacity: 0 }}>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-xs text-gray-400 mt-1">Shipment posts</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 flex-1 animate-fade-in-up stagger-3 card-hover" style={{ opacity: 0 }}>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-xs text-gray-400 mt-1">Trips offered</p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="mx-4 mt-6 bg-gray-100 rounded-2xl p-1 flex animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white text-black shadow-sm tab-indicator">
          Shipped Items
        </button>
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 tab-indicator">
          Offered Spaces
        </button>
      </div>

      {/* Empty State */}
      <div className="px-4 mt-12 text-center animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center animate-float">
          <Package size={40} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mt-4">No activity yet</h3>
        <p className="text-gray-500 mt-2 text-sm">
          Your shipments and offered spaces will appear here
        </p>
        <button className="mt-6 bg-amber-400 text-black px-6 py-3 rounded-2xl font-semibold btn-hover">
          Create your first listing
        </button>
      </div>
    </div>
  );

  const renderInboxScreen = () => (
    <div className="flex-1 overflow-auto pb-32 smooth-scroll" key={pageKey}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-black mx-4 mt-4 rounded-3xl p-6 relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 right-0 opacity-10 animate-float">
          <MessageCircle size={120} />
        </div>
        <h1 className="text-2xl font-bold text-white animate-fade-in-up">
          Inbox
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-[200px] animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          Monitor chats, requests, and updates
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs text-white flex items-center gap-1 animate-fade-in-up stagger-2 chip-hover" style={{ opacity: 0 }}>
            <Shield size={12} /> Encrypted
          </span>
          <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs text-white flex items-center gap-1 animate-fade-in-up stagger-3 chip-hover" style={{ opacity: 0 }}>
            <Check size={12} /> Moderated
          </span>
        </div>
      </div>

      {/* Toggle */}
      <div className="mx-4 mt-6 bg-gray-100 rounded-2xl p-1 flex animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white text-black shadow-sm tab-indicator">
          Messages
        </button>
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 tab-indicator">
          Notifications
        </button>
      </div>

      {/* Empty State */}
      <div className="px-4 mt-12 text-center animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center animate-float">
          <MessageCircle size={40} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mt-4">No messages yet</h3>
        <p className="text-gray-500 mt-2 text-sm">
          Connect with travellers to start a conversation
        </p>
      </div>
    </div>
  );

  const renderProfileScreen = () => (
    <div className="flex-1 overflow-auto pb-32 smooth-scroll" key={pageKey}>
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 mx-4 mt-4 rounded-3xl p-6 relative overflow-hidden animate-scale-in gradient-shift">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 animate-float" />
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-bounce-in">
            👨🏾
          </div>
          <div className="animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold text-black">testAppp</h1>
            <p className="text-black/60 text-sm">New York → Accra corridor</p>
            <div className="flex items-center gap-1 mt-1">
              <Shield size={14} className="text-green-700" />
              <span className="text-xs text-green-700 font-medium">Verified member</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-6">
          <div className="bg-white/30 backdrop-blur rounded-2xl px-4 py-3 flex-1 text-center animate-fade-in-up stagger-2 card-hover" style={{ opacity: 0 }}>
            <p className="text-2xl font-bold text-black">5</p>
            <p className="text-xs text-black/60">Trips shared</p>
          </div>
          <div className="bg-white/30 backdrop-blur rounded-2xl px-4 py-3 flex-1 text-center animate-fade-in-up stagger-3 card-hover" style={{ opacity: 0 }}>
            <p className="text-2xl font-bold text-black">10</p>
            <p className="text-xs text-black/60">Items delivered</p>
          </div>
        </div>
      </div>

      {/* Verification Journey */}
      <div className="mx-4 mt-6 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
        <h2 className="text-lg font-bold text-black mb-3">Verification journey</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <VerificationBadge icon={<User size={18} className="text-white" />} label="Government ID uploaded" verified delay={0} />
          <VerificationBadge icon={<Plane size={18} className="text-white" />} label="Flight itinerary verified" verified delay={0.1} />
          <VerificationBadge icon={<Shield size={18} className="text-white" />} label="Moderator reviewed" verified delay={0.2} />
        </div>
      </div>

      {/* Preferences */}
      <div className="mx-4 mt-6 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
        <h2 className="text-lg font-bold text-black mb-3">Preferences</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
          <PreferenceItem
            icon={<Package size={18} className="text-white" />}
            iconBg="bg-black"
            label="Max item weight"
            value="Up to 10kg per client"
            delay={0}
          />
          <PreferenceItem
            icon={<Clock size={18} className="text-white" />}
            iconBg="bg-black"
            label="Preferred hand-off"
            value="3 hours before boarding"
            delay={0.1}
          />
          <PreferenceItem
            icon={<Plane size={18} className="text-white" />}
            iconBg="bg-black"
            label="Upcoming route"
            value="JFK → ACC · departs Apr 5"
            delay={0.2}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return renderSearchScreen();
      case 'create':
        return renderCreateScreen();
      case 'spaces':
        return renderMySpacesScreen();
      case 'inbox':
        return renderInboxScreen();
      case 'profile':
        return renderProfileScreen();
      default:
        return renderSearchScreen();
    }
  };

  // Splash Screen
  const renderSplashScreen = () => (
    <div className={`w-full max-w-md mx-auto bg-black min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${splashExiting ? 'animate-splash-fade-out' : ''}`}>
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.5s' }} />
      
      {/* Logo */}
      <div className="animate-logo-float">
        <div className="w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-400/30 animate-bounce-in">
          <Plane size={48} className="text-black rotate-45" />
        </div>
      </div>
      
      {/* Brand Name */}
      <h1 className="text-4xl font-bold text-white mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
        Space<span className="text-amber-400">Share</span>
      </h1>
      
      <p className="text-gray-400 mt-3 text-sm animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
        Share your journey, deliver joy
      </p>
      
      {/* Loading indicator */}
      <div className="mt-12 flex gap-2 animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-slow" />
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );

  // Login Screen
  const renderLoginScreen = () => (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col relative overflow-hidden">
      {/* Top decorative section */}
      <div className="bg-black pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-in-down">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center">
            <Plane size={24} className="text-black rotate-45" />
          </div>
          <span className="text-2xl font-bold text-white">
            Space<span className="text-amber-400">Share</span>
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mt-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Welcome<br />
          <span className="italic font-light text-amber-400">back</span>
        </h1>
      </div>
      
      {/* Login Form Card */}
      <div className="flex-1 bg-gray-50 -mt-12 rounded-t-3xl px-6 pt-8 pb-6 animate-slide-in-bottom" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <div className="space-y-4">
          {/* Email Input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Email</label>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3 input-focus">
              <Mail size={20} className="text-gray-400" />
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Password</label>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3 input-focus">
              <Lock size={20} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Forgot Password */}
          <div className="text-right animate-fade-in-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
            <button className="text-sm text-amber-600 font-medium">Forgot password?</button>
          </div>
          
          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 btn-hover animate-fade-in-up"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            Sign in
            <ArrowRight size={20} />
          </button>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6 animate-fade-in-up" style={{ animationDelay: '0.55s', opacity: 0 }}>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          {/* Social Login */}
          <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <button className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 btn-hover">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 btn-hover">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              Apple
            </button>
          </div>
        </div>
        
        {/* Sign Up Link */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.65s', opacity: 0 }}>
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button className="text-black font-semibold">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );

  // Main App Screen
  const renderAppScreen = () => (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col relative">
      {/* Status Bar */}
      <div className={`px-6 py-3 flex justify-between items-center ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 bg-black rounded-sm" />
          <div className="w-1 h-2 bg-black rounded-sm" />
        </div>
      </div>

      {/* Top Header */}
      <div className={`px-4 flex items-center justify-between ${isLoaded ? 'animate-fade-in-down stagger-1' : 'opacity-0'}`} style={{ opacity: 0 }}>
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm btn-hover icon-bounce">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Today</span>
          <span className="text-sm font-semibold">Nov 29</span>
        </div>
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm relative btn-hover icon-bounce">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full notification-dot" />
        </button>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <div className={`fixed bottom-6 left-1/2 bg-black rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {isActive && (
                <span className="text-sm font-medium">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      {appState === 'splash' && renderSplashScreen()}
      {appState === 'login' && renderLoginScreen()}
      {appState === 'app' && renderAppScreen()}
    </>
  );
}

// Traveller Card Component with animations
function TravellerCard({ traveller }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            {traveller.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-black">{traveller.name}</h3>
              {traveller.verified && (
                <Shield size={14} className="text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span>{traveller.rating}</span>
              <span>·</span>
              <span>{traveller.trips} trips</span>
            </div>
          </div>
        </div>
        <div className={`bg-amber-400 px-3 py-1 rounded-xl transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
          <span className="font-bold text-black">${traveller.price}</span>
          <span className="text-black/60 text-sm">/kg</span>
        </div>
      </div>

      {/* Route Display */}
      <div className="mt-4 bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-black">{traveller.from}</p>
            <p className="text-xs text-gray-400">{traveller.fromCity}</p>
          </div>
          <div className="flex-1 px-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2" />
              <Plane size={16} className={`text-amber-500 ${isHovered ? 'animate-plane' : 'rotate-45'}`} />
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2" />
              <div className={`w-2 h-2 bg-amber-400 rounded-full ${isHovered ? 'animate-pulse-slow' : ''}`} />
            </div>
            <p className="text-center text-xs text-gray-400 mt-1">{traveller.date}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-black">{traveller.to}</p>
            <p className="text-xs text-gray-400">{traveller.toCity}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-3">{traveller.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package size={14} />
          <span>{traveller.weight}kg available</span>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 btn-hover group">
          Connect 
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

// Verification Badge Component with animation
function VerificationBadge({ icon, label, verified, delay = 0 }) {
  return (
    <div 
      className="flex items-center gap-3 animate-slide-in-right"
      style={{ opacity: 0, animationDelay: `${0.5 + delay}s` }}
    >
      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      {verified && (
        <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center animate-bounce-in" style={{ animationDelay: `${0.7 + delay}s` }}>
          <Check size={14} className="text-black" />
        </div>
      )}
    </div>
  );
}

// Preference Item Component with animation
function PreferenceItem({ icon, iconBg, label, value, delay = 0 }) {
  return (
    <div 
      className="flex items-center gap-3 animate-slide-in-right"
      style={{ opacity: 0, animationDelay: `${0.6 + delay}s` }}
    >
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-black">{value}</p>
      </div>
    </div>
  );
}
