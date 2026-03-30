import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  Plus, 
  BookOpen, 
  History, 
  Settings, 
  ChevronRight, 
  Star, 
  X, 
  Sparkles,
  ArrowLeft,
  Scale,
  Gavel,
  Shield,
  FileText,
  Globe,
  Briefcase,
  Layers,
  Library,
  Info,
  ExternalLink,
  Cpu,
  Smartphone,
  LayoutGrid,
  Columns,
  Wifi,
  WifiOff,
  Building2,
  Landmark,
  ScrollText,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Term, Category, CATEGORIES, LegalResource, HistoricalEra, Organization } from './types';
import initialTerms from './data/terms.json';
import { searchAI, generateDefinition, generateResourceAI, generateOrganizationAI, generateTerminologyAI, researchArticlesAI } from './services/geminiService';
import { NICARAGUA_RESOURCES, HISTORICAL_ERAS, NICARAGUA_ORGANIZATIONS, NICARAGUA_TERMINOLOGY } from './constants';

// --- Components ---

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category) {
    case 'Civil': return <Scale className={className} />;
    case 'Penal': return <Gavel className={className} />;
    case 'Mercantil': return <Briefcase className={className} />;
    case 'Romano': return <Layers className={className} />;
    case 'Constitucional': return <Shield className={className} />;
    case 'Laboral': return <FileText className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'branches' | 'history' | 'nicaragua' | 'favorites'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customTerms, setCustomTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [expandedEra, setExpandedEra] = useState<string | null>('hist-roma');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [nicaraguaResources, setNicaraguaResources] = useState<LegalResource[]>(NICARAGUA_RESOURCES);
  const [customTerminology, setCustomTerminology] = useState<Term[]>([]);
  const [customOrganizations, setCustomOrganizations] = useState<Organization[]>([]);
  const [addType, setAddType] = useState<'Term' | 'Resource' | 'Terminology' | 'Organization'>('Term');
  const [isAddingResourceAI, setIsAddingResourceAI] = useState(false);
  const [isResearchingArticlesAI, setIsResearchingArticlesAI] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('lexicon_favorites');
    const savedCustom = localStorage.getItem('lexicon_custom_terms');
    const savedResources = localStorage.getItem('lexicon_custom_resources');
    const savedTerminology = localStorage.getItem('lexicon_custom_terminology');
    const savedOrganizations = localStorage.getItem('lexicon_custom_organizations');
    const savedDarkMode = localStorage.getItem('lexicon_dark_mode');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCustom) setCustomTerms(JSON.parse(savedCustom));
    if (savedResources) setNicaraguaResources([...NICARAGUA_RESOURCES, ...JSON.parse(savedResources)]);
    if (savedTerminology) setCustomTerminology(JSON.parse(savedTerminology));
    if (savedOrganizations) setCustomOrganizations(JSON.parse(savedOrganizations));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lexicon_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const allTerms = useMemo(() => [...initialTerms, ...customTerms], [customTerms]);

  const filteredTerms = useMemo(() => {
    return allTerms.filter(term => {
      const matchesSearch = term.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTerms, searchQuery, selectedCategory]);

  const featuredTerms = useMemo(() => allTerms.slice(0, 3), [allTerms]);

  const favoriteTerms = useMemo(() => {
    return allTerms.filter(term => favorites.includes(term.id));
  }, [allTerms, favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('lexicon_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingAI(true);
    const result = await searchAI(searchQuery);
    setIsSearchingAI(false);
    if (result) {
      setSelectedTerm(result);
    } else {
      alert("No se pudo encontrar el término con la IA. Intenta con otra palabra.");
    }
  };

  const handleAutoFill = async (word: string) => {
    if (!word.trim()) return;
    setIsGeneratingAI(true);
    const result = await generateDefinition(word);
    setIsGeneratingAI(false);
    if (result) {
      const form = document.getElementById('add-term-form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('definition') as HTMLTextAreaElement).value = result.definition || '';
        (form.elements.namedItem('etymology') as HTMLInputElement).value = result.etymology || '';
        (form.elements.namedItem('example') as HTMLInputElement).value = result.example || '';
        (form.elements.namedItem('synonyms') as HTMLInputElement).value = (result.synonyms || []).join(', ');
        (form.elements.namedItem('category') as HTMLSelectElement).value = result.category || 'General';
      }
    }
  };

  const handleAutoFillResource = async (title: string) => {
    if (!title.trim()) return;
    setIsGeneratingAI(true);
    const result = await generateResourceAI(title);
    setIsGeneratingAI(false);
    if (result) {
      const form = document.getElementById('add-term-form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('description') as HTMLInputElement).value = result.description || '';
        (form.elements.namedItem('content') as HTMLTextAreaElement).value = result.content || '';
      }
    }
  };

  const handleAutoFillOrganization = async (name: string) => {
    if (!name.trim()) return;
    setIsGeneratingAI(true);
    const result = await generateOrganizationAI(name);
    setIsGeneratingAI(false);
    if (result) {
      const form = document.getElementById('add-term-form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('fullName') as HTMLInputElement).value = result.fullName || '';
        (form.elements.namedItem('description') as HTMLTextAreaElement).value = result.description || '';
        (form.elements.namedItem('importance') as HTMLInputElement).value = result.importance || '';
      }
    }
  };

  const handleAutoFillTerminology = async (term: string) => {
    if (!term.trim()) return;
    setIsGeneratingAI(true);
    const result = await generateTerminologyAI(term);
    setIsGeneratingAI(false);
    if (result) {
      const form = document.getElementById('add-term-form') as HTMLFormElement;
      if (form) {
        (form.elements.namedItem('definition') as HTMLTextAreaElement).value = result.definition || '';
        (form.elements.namedItem('context') as HTMLInputElement).value = result.context || '';
      }
    }
  };

  const handleAddTerm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (addType === 'Term') {
      const newTerm: Term = {
        id: `custom-${Date.now()}`,
        word: formData.get('word') as string,
        definition: formData.get('definition') as string,
        etymology: formData.get('etymology') as string,
        example: formData.get('example') as string,
        synonyms: (formData.get('synonyms') as string).split(',').map(s => s.trim()),
        category: formData.get('category') as string,
        isCustom: true
      };
      const updatedCustom = [newTerm, ...customTerms];
      setCustomTerms(updatedCustom);
      localStorage.setItem('lexicon_custom_terms', JSON.stringify(updatedCustom));
    } else if (addType === 'Resource') {
      const newResource: LegalResource = {
        id: `custom-${Date.now()}`,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        type: formData.get('resourceType') as any,
        content: formData.get('content') as string
      };
      const updatedResources = [newResource, ...nicaraguaResources.filter(r => !r.id.startsWith('custom-'))];
      setNicaraguaResources(updatedResources);
      localStorage.setItem('lexicon_custom_resources', JSON.stringify(updatedResources.filter(r => r.id.startsWith('custom-'))));
    } else if (addType === 'Terminology') {
      const newTerminology = {
        term: formData.get('term') as string,
        definition: formData.get('definition') as string,
        context: formData.get('context') as string
      };
      const updatedTerminology = [newTerminology, ...customTerminology];
      setCustomTerminology(updatedTerminology);
      localStorage.setItem('lexicon_custom_terminology', JSON.stringify(updatedTerminology));
    } else if (addType === 'Organization') {
      const newOrganization: Organization = {
        name: formData.get('name') as string,
        fullName: formData.get('fullName') as string,
        description: formData.get('description') as string,
        importance: formData.get('importance') as string
      };
      const updatedOrganizations = [newOrganization, ...customOrganizations];
      setCustomOrganizations(updatedOrganizations);
      localStorage.setItem('lexicon_custom_organizations', JSON.stringify(updatedOrganizations));
    }
    
    setShowAddModal(false);
  };

  const handleAddResourceAI = async () => {
    const codeName = prompt("¿Qué código o ley nicaragüense deseas agregar? (Ej: Código Tributario, Ley de Autonomía)");
    if (!codeName) return;

    setIsAddingResourceAI(true);
    try {
      const result = await generateResourceAI(codeName);
      if (result) {
        const newResource: LegalResource = {
          ...result,
          id: `ai-res-${Date.now()}`
        };
        const updatedResources = [...nicaraguaResources, newResource];
        setNicaraguaResources(updatedResources);
        
        // Save only custom ones to local storage
        const customOnly = updatedResources.filter(r => r.id.startsWith('ai-res-'));
        localStorage.setItem('lexicon_custom_resources', JSON.stringify(customOnly));
        
        setSelectedResource(newResource);
      } else {
        alert("No se pudo generar el recurso con la IA. Intenta con otro nombre.");
      }
    } catch (error) {
      console.error("Error adding resource with AI:", error);
      alert("Error al generar el recurso con IA.");
    } finally {
      setIsAddingResourceAI(false);
    }
  };

  const handleResearchArticlesAI = async (title: string) => {
    const topic = prompt(`¿Qué tema o artículo específico deseas investigar dentro de "${title}"?`);
    if (!topic) return;

    setIsResearchingArticlesAI(true);
    try {
      const result = await researchArticlesAI(title, topic);
      if (result && result.articles) {
        setSelectedResource(prev => prev ? { ...prev, importantArticles: [...(prev.importantArticles || []), ...result.articles] } : null);
      } else {
        alert("No se pudieron investigar los artículos con la IA.");
      }
    } catch (error) {
      console.error("Error researching articles:", error);
      alert("Error al investigar artículos con IA.");
    } finally {
      setIsResearchingArticlesAI(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-legal-paper text-legal-ink transition-colors duration-300 font-serif">
      
      {/* Header Area */}
      <header className="p-6 pt-10 border-b border-legal-gold/20 bg-legal-midnight/5">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-legal-midnight leading-none font-display">Lexicon</h1>
            <p className="text-legal-gold font-bold tracking-[0.2em] text-sm mt-1 uppercase font-sans">Juris Digital</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isOnline ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-[10px] font-bold uppercase tracking-widest font-sans">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-legal-gold/10 text-legal-gold"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {activeTab === 'home' && (
          <>
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-slate/40 w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar término jurídico..."
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-dark-card border border-slate/10 dark:border-dark-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-slate dark:text-dark-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={handleAISearch}
                  disabled={isSearchingAI || !isOnline}
                  className="absolute inset-y-0 right-4 flex items-center text-gold disabled:opacity-50"
                >
                  {isSearchingAI ? (
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className={`w-5 h-5 ${!isOnline ? 'text-slate/30' : ''}`} />
                  )}
                </button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="stat-card">
                <span className="text-2xl font-bold text-gold">{allTerms.length}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate/40 dark:text-slate/50">Términos</span>
              </div>
              <div className="stat-card">
                <span className="text-2xl font-bold text-gold">{CATEGORIES.length}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate/40 dark:text-slate/50">Ramas</span>
              </div>
              <div className="stat-card">
                <Smartphone className="text-green-500 w-5 h-5 mb-1" />
                <span className="text-[10px] uppercase tracking-widest text-slate/40 dark:text-slate/50">Local</span>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 px-6 pb-28 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Ramas Section */}
              <section>
                <h2 className="text-xl font-bold text-midnight dark:text-white mb-6">Ramas del Derecho</h2>
                <div className="grid grid-cols-3 gap-4">
                  {CATEGORIES.slice(1, 4).map(cat => (
                    <div 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setActiveTab('branches'); }}
                      className="category-card bg-white border-legal-gold/20 hover:border-legal-gold transition-all"
                    >
                      <div className="text-legal-gold mb-3">
                        <CategoryIcon category={cat} className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-legal-midnight mb-1 font-sans">{cat}</span>
                      <span className="text-[10px] text-legal-ink/40 font-bold font-sans">{allTerms.filter(t => t.category === cat).length}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Destacados Section */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-midnight dark:text-white">Términos Destacados</h2>
                  <Star className="text-gold w-5 h-5" />
                </div>
                <div className="space-y-4">
                  {featuredTerms.map(term => (
                    <div 
                      key={term.id}
                      onClick={() => setSelectedTerm(term)}
                      className="premium-card p-5 flex justify-between items-center group cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-midnight dark:text-white group-hover:text-gold transition-colors">{term.word}</h3>
                          <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                            {term.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate/50 dark:text-slate/40 line-clamp-2 leading-relaxed">
                          {term.definition}
                        </p>
                      </div>
                      <ChevronRight className="text-slate/20 w-5 h-5 ml-4" />
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'branches' && (
            <motion.div 
              key="branches"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setActiveTab('home')} className="text-gold">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-midnight dark:text-white">Ramas del Derecho</h2>
              </div>

              <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'All' 
                      ? 'bg-gold text-midnight' 
                      : 'bg-white dark:bg-dark-card border border-slate/10 dark:border-dark-border text-slate/40'
                  }`}
                >
                  Todos
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-gold text-midnight' 
                        : 'bg-white dark:bg-dark-card border border-slate/10 dark:border-dark-border text-slate/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mt-6">
                {filteredTerms.map(term => (
                  <div 
                    key={term.id}
                    onClick={() => setSelectedTerm(term)}
                    className="premium-card p-5 flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-midnight dark:text-white mb-1">{term.word}</h3>
                      <p className="text-sm text-slate/50 dark:text-slate/40 line-clamp-2">{term.definition}</p>
                    </div>
                    <ChevronRight className="text-slate/20 w-5 h-5" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div 
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-legal-midnight font-display">Mis Favoritos</h2>
              {favoriteTerms.length > 0 ? (
                <div className="space-y-4">
                  {favoriteTerms.map(term => (
                    <div 
                      key={term.id}
                      onClick={() => setSelectedTerm(term)}
                      className="premium-card bg-white p-5 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-legal-midnight font-display">{term.word}</h3>
                        <button onClick={(e) => toggleFavorite(term.id, e)} className="text-legal-gold">
                          <Star className="w-5 h-5 fill-legal-gold" />
                        </button>
                      </div>
                      <p className="text-sm text-legal-ink/50 line-clamp-2 font-sans">{term.definition}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Star className="w-12 h-12 text-legal-gold/10 mx-auto mb-4" />
                  <p className="text-legal-ink/40 font-medium italic font-sans">No tienes favoritos guardados</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-legal-midnight font-display">Historia del Derecho</h2>
              <p className="text-legal-ink/40 text-sm -mt-4 font-sans italic">Evolución de la justicia a través de los siglos</p>

              <div className="space-y-4">
                {HISTORICAL_ERAS.map(era => (
                  <div key={era.id} className="premium-card bg-white border-legal-gold/10 overflow-hidden">
                    <button 
                      onClick={() => setExpandedEra(expandedEra === era.id ? null : era.id)}
                      className="w-full p-5 flex items-center gap-4 text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${era.id === 'hist-roma' ? 'bg-red-50 text-red-600' : 'bg-legal-gold/10 text-legal-gold'}`}>
                        {era.id === 'hist-roma' ? <Landmark /> : <ScrollText />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-legal-midnight font-display">{era.name}</h4>
                        <p className="text-[10px] font-bold text-legal-ink/40 uppercase tracking-widest font-sans">{era.period}</p>
                      </div>
                      <ChevronRight className={`text-legal-ink/20 w-5 h-5 transition-transform ${expandedEra === era.id ? 'rotate-90' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedEra === era.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-6 border-t border-legal-gold/5"
                        >
                          <div className="pt-6 space-y-6">
                            <p className="text-sm text-legal-ink/70 leading-relaxed font-sans">
                              {era.detailedInfo || era.description}
                            </p>
                            
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] flex items-center gap-2 font-sans">
                                <Sparkles className="w-3 h-3" /> Legado Jurídico
                              </h5>
                              <div className="grid grid-cols-1 gap-2">
                                {era.legacy?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-legal-midnight/5 rounded-xl border border-legal-midnight/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-legal-gold" />
                                    <span className="text-xs font-medium text-legal-midnight font-sans">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 bg-legal-gold/5 rounded-2xl border border-legal-gold/10 italic">
                              <h5 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-2 font-sans">Contribución Principal</h5>
                              <p className="text-xs text-legal-ink/60 font-serif leading-relaxed">
                                {era.keyContribution}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'nicaragua' && (
            <motion.div 
              key="nicaragua"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-legal-midnight font-display">Nicaragua</h2>
                  <p className="text-legal-ink/40 text-sm font-sans italic">Marco Jurídico Nacional</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <div className="w-1.5 h-6 bg-white border border-slate-200 rounded-full" />
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                </div>
              </div>

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] font-sans">Códigos y Leyes</h3>
                  <button 
                    onClick={handleAddResourceAI}
                    disabled={isAddingResourceAI}
                    className="text-[10px] font-bold text-blue-600 flex items-center gap-1 font-sans disabled:opacity-50"
                  >
                    {isAddingResourceAI ? (
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : <Plus className="w-3 h-3" />}
                    Agregar con IA
                  </button>
                </div>
                <div className="space-y-3">
                  {nicaraguaResources.map(res => (
                    <div 
                      key={res.id}
                      onClick={() => setSelectedResource(res)}
                      className="premium-card bg-white p-4 flex items-center gap-4 cursor-pointer group hover:border-legal-gold transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        res.type === 'Constitution' ? 'bg-blue-50 text-blue-600' : 
                        res.type === 'Code' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {res.type === 'Constitution' ? <Shield className="w-6 h-6" /> : 
                         res.type === 'Code' ? <Gavel className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-legal-midnight text-sm font-display group-hover:text-legal-gold transition-colors">{res.title}</h4>
                        <p className="text-[9px] font-bold text-legal-gold/60 mb-0.5 font-sans">{res.description}</p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-legal-ink/30 font-sans">
                          <ScrollText className="w-3 h-3" /> {res.importantArticles?.length || 0} Artículos clave
                        </div>
                      </div>
                      <ChevronRight className="text-legal-ink/10 w-4 h-4" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] font-sans">Terminología Local</h3>
                <div className="grid grid-cols-1 gap-3">
                  {NICARAGUA_TERMINOLOGY.map(item => (
                    <div key={item.term} className="premium-card bg-white p-4 border-l-4 border-l-blue-600">
                      <h4 className="font-bold text-legal-midnight font-display mb-1">{item.term}</h4>
                      <p className="text-xs text-legal-ink/70 leading-relaxed font-sans mb-2">{item.definition}</p>
                      <p className="text-[10px] text-legal-ink/40 font-sans italic">Uso: {item.context}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] font-sans">Organismos del Estado</h3>
                <div className="grid grid-cols-1 gap-3">
                  {NICARAGUA_ORGANIZATIONS.map(org => (
                    <div key={org.name} className="premium-card bg-white p-5 border-l-4 border-l-legal-gold">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-legal-midnight font-display">{org.name}</h4>
                        <Building2 className="w-4 h-4 text-legal-gold/40" />
                      </div>
                      <p className="text-[10px] font-bold text-legal-ink/60 mb-2 font-sans uppercase tracking-wider">{org.fullName}</p>
                      <p className="text-xs text-legal-ink/50 leading-relaxed font-sans mb-3">{org.description}</p>
                      <div className="p-3 bg-legal-gold/5 rounded-xl border border-legal-gold/10">
                        <p className="text-[9px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Importancia</p>
                        <p className="text-[10px] text-legal-midnight italic font-serif">{org.importance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-legal-gold/10 px-4 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'home' ? 'text-gold scale-110' : 'text-slate/30'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Inicio</span>
        </button>

        <button 
          onClick={() => setActiveTab('branches')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'branches' ? 'text-gold scale-110' : 'text-slate/30'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Ramas</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'history' ? 'text-gold scale-110' : 'text-slate/30'}`}
        >
          <Columns className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Historia</span>
        </button>

        <button 
          onClick={() => setActiveTab('nicaragua')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'nicaragua' ? 'text-gold scale-110' : 'text-slate/30'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Nicaragua</span>
        </button>

        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'favorites' ? 'text-gold scale-110' : 'text-slate/30'}`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Favoritos</span>
        </button>
      </nav>

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gold text-midnight rounded-2xl shadow-2xl shadow-gold/20 flex items-center justify-center z-30 hover:scale-110 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modals */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-legal-paper flex flex-col max-w-md mx-auto shadow-2xl"
          >
            <div className="p-6 pt-12 flex justify-between items-center bg-legal-midnight text-white">
              <button onClick={() => setSelectedResource(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold font-display truncate max-w-[200px]">{selectedResource.title}</h3>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-24">
              <section>
                <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-4 font-sans">Descripción General</h4>
                <p className="text-lg text-legal-midnight font-serif leading-relaxed">{selectedResource.description}</p>
              </section>

              <section className="bg-legal-midnight/5 p-8 rounded-3xl border border-legal-gold/10">
                <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-4 font-sans">Contenido Principal</h4>
                <p className="text-sm text-legal-ink/70 font-serif leading-relaxed italic">
                  {selectedResource.content}
                </p>
              </section>

              {selectedResource.importantArticles && selectedResource.importantArticles.length > 0 && (
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] font-sans flex items-center gap-2">
                      <ScrollText className="w-4 h-4" /> Artículos Destacados
                    </h4>
                    <button 
                      onClick={() => handleResearchArticlesAI(selectedResource.title)}
                      disabled={isResearchingArticlesAI}
                      className="text-[10px] font-bold text-blue-600 flex items-center gap-1 font-sans disabled:opacity-50"
                    >
                      {isResearchingArticlesAI ? (
                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : <Sparkles className="w-3 h-3" />}
                      Investigar con IA
                    </button>
                  </div>
                  <div className="space-y-4">
                    {selectedResource.importantArticles.map((art, idx) => (
                      <div key={idx} className="p-5 bg-white border border-legal-gold/10 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-legal-gold font-sans">{art.number}</span>
                          <div className="h-px flex-1 bg-legal-gold/10" />
                        </div>
                        <p className="text-sm text-legal-midnight font-serif leading-relaxed italic">
                          {art.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTerm && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-50 bg-legal-paper flex flex-col max-w-md mx-auto shadow-2xl"
          >
            <div className="p-6 pt-12 flex justify-between items-center border-b border-legal-gold/10 bg-legal-midnight/5">
              <button onClick={() => setSelectedTerm(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-legal-gold">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => toggleFavorite(selectedTerm.id, e)}
                className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${favorites.includes(selectedTerm.id) ? 'text-legal-gold' : 'text-legal-ink/20'}`}
              >
                <Star className={`w-5 h-5 ${favorites.includes(selectedTerm.id) ? 'fill-legal-gold' : ''}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-24 no-scrollbar">
              <div className="mt-10 mb-10">
                <span className="px-3 py-1 bg-legal-gold/10 text-legal-gold text-[10px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block font-sans">
                  {selectedTerm.category}
                </span>
                <h2 className="text-4xl font-bold text-legal-midnight mb-4 font-display">{selectedTerm.word}</h2>
                {selectedTerm.etymology && (
                  <p className="text-sm italic text-legal-ink/40 font-serif">{selectedTerm.etymology}</p>
                )}
              </div>

              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-4 font-sans">Definición</h4>
                  <p className="text-lg text-legal-ink/80 leading-relaxed font-serif">{selectedTerm.definition}</p>
                </section>

                <section className="bg-white p-8 rounded-3xl border border-legal-gold/10 shadow-sm">
                  <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-sans">
                    <FileText className="w-4 h-4" /> Contexto Legal
                  </h4>
                  <p className="text-sm text-legal-ink/50 leading-relaxed italic font-serif">"{selectedTerm.example}"</p>
                </section>

                {selectedTerm.synonyms.length > 0 && (
                  <section>
                    <h4 className="text-[10px] font-bold text-legal-gold uppercase tracking-[0.2em] mb-4 font-sans">Sinónimos</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.synonyms.map(syn => (
                        <span key={syn} className="px-4 py-2 bg-legal-midnight/5 rounded-xl text-xs font-medium text-legal-ink/50 font-sans">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals - Consolidated at the end to prevent nesting issues */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-legal-midnight/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-legal-paper w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-legal-gold/20">
              <div className="p-6 bg-legal-midnight text-white flex justify-between items-center">
                <h3 className="text-xl font-bold font-display">
                  {addType === 'Term' ? 'Nuevo Término' : 
                   addType === 'Resource' ? 'Nueva Ley/Código' : 
                   addType === 'Terminology' ? 'Nueva Terminología' : 'Nueva Organización'}
                </h3>
                <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 border-b border-legal-gold/10">
                <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-2 font-sans">Tipo de Contenido</label>
                <select value={addType} onChange={(e) => setAddType(e.target.value as any)} className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans">
                  <option value="Term">Término</option>
                  <option value="Resource">Ley/Código</option>
                  <option value="Terminology">Terminología Local</option>
                  <option value="Organization">Organización</option>
                </select>
              </div>
              <form id="add-term-form" onSubmit={handleAddTerm} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {addType === 'Term' && (
                  <>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest font-sans">Palabra</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const word = (document.getElementById('add-term-form') as HTMLFormElement).word.value;
                            handleAutoFill(word);
                          }}
                          disabled={isGeneratingAI}
                          className="text-[10px] font-bold text-legal-gold flex items-center gap-1 disabled:opacity-50 font-sans"
                        >
                          {isGeneratingAI ? 'Generando...' : <><Sparkles className="w-3 h-3" /> IA Auto-fill</>}
                        </button>
                      </div>
                      <input name="word" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Definición</label>
                      <textarea name="definition" required rows={3} className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Categoría</label>
                        <select name="category" className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Etimología</label>
                        <input name="etymology" className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Ejemplo de Uso</label>
                      <input name="example" className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Sinónimos (separados por coma)</label>
                      <input name="synonyms" className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans" />
                    </div>
                  </>
                )}
                {addType === 'Resource' && (
                  <>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest font-sans">Título</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const title = (document.getElementById('add-term-form') as HTMLFormElement).elements.namedItem('title') as HTMLInputElement;
                            handleAutoFillResource(title.value);
                          }}
                          disabled={isGeneratingAI || !isOnline}
                          className="text-[10px] font-bold text-legal-gold flex items-center gap-1 disabled:opacity-50 font-sans"
                        >
                          {isGeneratingAI ? 'Generando...' : <><Sparkles className="w-3 h-3" /> {isOnline ? 'IA Auto-fill' : 'Offline'}</>}
                        </button>
                      </div>
                      <input name="title" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Descripción</label>
                      <input name="description" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Tipo</label>
                      <select name="resourceType" className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none font-sans">
                        <option value="Constitution">Constitución</option>
                        <option value="Code">Código</option>
                        <option value="Procedural">Procesal</option>
                        <option value="Special">Especial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Contenido</label>
                      <textarea name="content" required rows={3} className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                  </>
                )}
                {addType === 'Terminology' && (
                  <>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest font-sans">Término</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const term = (document.getElementById('add-term-form') as HTMLFormElement).elements.namedItem('term') as HTMLInputElement;
                            handleAutoFillTerminology(term.value);
                          }}
                          disabled={isGeneratingAI || !isOnline}
                          className="text-[10px] font-bold text-legal-gold flex items-center gap-1 disabled:opacity-50 font-sans"
                        >
                          {isGeneratingAI ? 'Generando...' : <><Sparkles className="w-3 h-3" /> {isOnline ? 'IA Auto-fill' : 'Offline'}</>}
                        </button>
                      </div>
                      <input name="term" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Definición</label>
                      <textarea name="definition" required rows={3} className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Contexto</label>
                      <input name="context" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                  </>
                )}
                {addType === 'Organization' && (
                  <>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest font-sans">Nombre (Acrónimo)</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const name = (document.getElementById('add-term-form') as HTMLFormElement).elements.namedItem('name') as HTMLInputElement;
                            handleAutoFillOrganization(name.value);
                          }}
                          disabled={isGeneratingAI || !isOnline}
                          className="text-[10px] font-bold text-legal-gold flex items-center gap-1 disabled:opacity-50 font-sans"
                        >
                          {isGeneratingAI ? 'Generando...' : <><Sparkles className="w-3 h-3" /> {isOnline ? 'IA Auto-fill' : 'Offline'}</>}
                        </button>
                      </div>
                      <input name="name" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Nombre Completo</label>
                      <input name="fullName" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Descripción</label>
                      <textarea name="description" required rows={3} className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-legal-gold uppercase tracking-widest mb-1 font-sans">Importancia</label>
                      <input name="importance" required className="w-full p-3 bg-white border border-legal-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/20 font-sans" />
                    </div>
                  </>
                )}
                <button type="submit" className="w-full py-4 bg-legal-midnight text-white rounded-2xl font-bold shadow-xl shadow-legal-gold/10 font-sans hover:bg-opacity-90 transition-all">
                  Guardar {addType === 'Term' ? 'Término' : addType === 'Resource' ? 'Ley/Código' : addType === 'Terminology' ? 'Terminología' : 'Organización'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
