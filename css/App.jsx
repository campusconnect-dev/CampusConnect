import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

type Category = 'Library Books' | 'Study Resources' | 'Student Marketplace' | 'Book Exchange' | 'Lost & Found' | 'Book Requests'
type Item = {
  id: number
  title: string
  category: Category
  description: string
  meta: string
  subject: string
  semester?: string
  price?: number
  condition?: string
  available: boolean
  tags: string[]
  cover: string
}

const items: Item[] = [
  { id: 1, title: 'Java: The Complete Reference', category: 'Library Books', description: 'A comprehensive guide to core Java, object-oriented programming, collections, and modern Java features.', meta: 'Herbert Schildt · McGraw Hill', subject: 'Programming', semester: 'Semester V', available: true, tags: ['Java', 'TYBSc IT', 'OOP'], cover: 'java' },
  { id: 2, title: 'Python Fundamentals — Beginner Notes', category: 'Study Resources', description: 'Student-created revision notes covering syntax, functions, data structures, and beginner exercises.', meta: 'CampusConnect Notes · PDF', subject: 'Programming', semester: 'Semester III', available: true, tags: ['Python', 'Beginner', 'Notes'], cover: 'python' },
  { id: 3, title: 'Programming with Java', category: 'Student Marketplace', description: 'Well-kept textbook with highlighted definitions and solved university questions.', meta: 'E. Balagurusamy · McGraw Hill', subject: 'Programming', semester: 'Semester V', price: 250, condition: 'Good', available: true, tags: ['Java', 'Second-hand', 'Textbook'], cover: 'market' },
  { id: 4, title: 'Artificial Intelligence: A Modern Approach', category: 'Library Books', description: 'Foundational concepts in intelligent agents, search, knowledge, reasoning, and machine learning.', meta: 'Russell & Norvig · Pearson', subject: 'Artificial Intelligence', semester: 'Semester VI', available: false, tags: ['AI', 'Machine Learning', 'Reference'], cover: 'ai' },
  { id: 5, title: 'Semester V IT Resource Pack', category: 'Study Resources', description: 'A curated set of syllabus notes, practical references, and previous-year question papers.', meta: 'Department resource · ZIP', subject: 'Information Technology', semester: 'Semester V', available: true, tags: ['Semester V', 'TYBSc IT', 'Question Papers'], cover: 'notes' },
  { id: 6, title: 'Data Structures Textbook Exchange', category: 'Book Exchange', description: 'Offering a data structures textbook in exchange for a database management book.', meta: 'Posted by Riya S. · 2 days ago', subject: 'Computer Science', semester: 'Semester IV', condition: 'Good', available: true, tags: ['Exchange', 'Data Structures', 'DBMS'], cover: 'exchange' },
  { id: 7, title: 'College ID Card', category: 'Lost & Found', description: 'Blue college identity card found near the second-floor reading room.', meta: 'Found at Main Library · Today', subject: 'General', available: true, tags: ['Found', 'ID Card', 'Library'], cover: 'lost' },
  { id: 8, title: 'Engineering Mathematics II', category: 'Student Marketplace', description: 'Second-hand mathematics textbook with minimal markings and a clean cover.', meta: 'TechKnowledge Publications', subject: 'Mathematics', semester: 'Semester II', price: 180, condition: 'Like new', available: true, tags: ['Mathematics', 'Second-hand'], cover: 'math' },
  { id: 9, title: 'Request: Operating Systems Reference', category: 'Book Requests', description: 'Looking to borrow or buy an introductory operating systems textbook before practical exams.', meta: 'Requested by Arjun P. · Yesterday', subject: 'Computer Science', semester: 'Semester IV', available: true, tags: ['Request', 'Operating Systems'], cover: 'request' },
]

const suggestions = ['Java Programming Books', 'Python Study Notes', 'Semester V Resources', 'Books Under ₹300', 'Second-hand Textbooks', 'Lost & Found']
const categories = ['All', 'Library Books', 'Study Resources', 'Student Marketplace', 'Book Exchange', 'Lost & Found', 'Book Requests']

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    market: <><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/></>,
    volume: <><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/></>,
    mute: <><path d="M11 5 6 9H2v6h4l5 4V5ZM22 9l-6 6M16 9l6 6"/></>,
    stop: <><rect x="6" y="6" width="12" height="12" rx="1"/></>,
    pause: <><path d="M9 5v14M15 5v14"/></>,
    play: <><path d="m7 4 13 8-13 8V4Z"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function parseQuery(query: string) {
  const q = query.toLowerCase()
  const terms = q.replace(/[₹,?.]/g, ' ').split(/\s+/).filter((word) => word.length > 2)
  const maxPrice = q.match(/(?:under|below|less than|within)\s*₹?\s*(\d+)/)?.[1]
  let category = 'All'
  if (/lost|found|id card/.test(q)) category = 'Lost & Found'
  else if (/exchange|swap/.test(q)) category = 'Book Exchange'
  else if (/request|looking for/.test(q)) category = 'Book Requests'
  else if (/second.hand|market|buy|affordable|price|under/.test(q)) category = 'Student Marketplace'
  else if (/notes|resource|question paper|study/.test(q)) category = 'Study Resources'
  return { terms, maxPrice: maxPrice ? Number(maxPrice) : undefined, category }
}

function App() {
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [subject, setSubject] = useState('All subjects')
  const [semester, setSemester] = useState('All semesters')
  const [condition, setCondition] = useState('Any condition')
  const [availability, setAvailability] = useState('Any availability')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('Relevance')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [assistantState, setAssistantState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceMessage, setVoiceMessage] = useState('Tap the microphone and ask CampusConnect anything.')
  const recognitionRef = useRef<any>(null)
  const lastSpokenQuery = useRef('')
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('campusconnect-searches') || '[]') } catch { return [] }
  })

  const doSearch = (value = query) => {
    const clean = value.trim()
    if (!clean) { setError('Type what you would like to find.'); return }
    setError('')
    setQuery(clean)
    setLoading(true)
    setAssistantState('processing')
    setVoiceMessage('Searching the campus catalog…')
    const parsed = parseQuery(clean)
    setCategory(parsed.category)
    if (parsed.maxPrice) setMaxPrice(String(parsed.maxPrice))
    setTimeout(() => {
      setSearchedQuery(clean)
      setLoading(false)
      setAssistantState('idle')
      const next = [clean, ...recent.filter((item) => item !== clean)].slice(0, 5)
      setRecent(next)
      localStorage.setItem('campusconnect-searches', JSON.stringify(next))
    }, 450)
  }

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel()
    setAssistantState('idle')
  }

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1
    utterance.onstart = () => setAssistantState('speaking')
    utterance.onend = () => setAssistantState('idle')
    utterance.onerror = () => setAssistantState('error')
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    stopSpeaking()
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setAssistantState('error')
      setVoiceMessage('Voice recognition is not supported in this browser. You can still type your search.')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onstart = () => {
      setError('')
      setAssistantState('listening')
      setVoiceMessage('Listening… speak naturally.')
    }
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('')
      setQuery(transcript)
      if (event.results[event.results.length - 1].isFinal) {
        setVoiceMessage(`I heard: “${transcript}”`)
        doSearch(transcript)
      }
    }
    recognition.onerror = (event: any) => {
      setAssistantState('error')
      const denied = event.error === 'not-allowed' || event.error === 'service-not-allowed'
      setVoiceMessage(denied ? 'Microphone access was denied. Allow access in your browser settings or type your search.' : 'I couldn’t hear that clearly. Please try again or type your search.')
    }
    recognition.onend = () => {
      if (assistantState === 'listening') setAssistantState('idle')
    }
    try { recognition.start() } catch {
      setAssistantState('error')
      setVoiceMessage('The microphone is already in use. Please try again.')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setAssistantState('idle')
    setVoiceMessage('Listening stopped. You can edit your query or try again.')
  }

  const results = useMemo(() => {
    if (!searchedQuery) return []
    const parsed = parseQuery(searchedQuery)
    let data = items.map((item) => {
      const haystack = `${item.title} ${item.description} ${item.meta} ${item.subject} ${item.semester} ${item.tags.join(' ')}`.toLowerCase()
      const score = parsed.terms.reduce((sum, term) => {
        const synonyms: Record<string, string[]> = { affordable: ['price', 'marketplace', 'second-hand'], cheap: ['price', 'marketplace'], ai: ['artificial intelligence', 'machine learning'], textbooks: ['book', 'textbook'], beginner: ['fundamentals', 'introductory'] }
        return sum + (haystack.includes(term) ? 3 : (synonyms[term] || []).some((word) => haystack.includes(word)) ? 2 : 0)
      }, 0)
      return { item, score }
    })
    if (category !== 'All') data = data.filter(({ item }) => item.category === category)
    if (subject !== 'All subjects') data = data.filter(({ item }) => item.subject === subject)
    if (semester !== 'All semesters') data = data.filter(({ item }) => item.semester === semester)
    if (condition !== 'Any condition') data = data.filter(({ item }) => item.condition === condition)
    if (availability === 'Available now') data = data.filter(({ item }) => item.available)
    const budget = Number(maxPrice || parsed.maxPrice || 0)
    if (budget) data = data.filter(({ item }) => item.price !== undefined && item.price <= budget)
    data = data.filter(({ score }) => score > 0 || category !== 'All')
    if (sort === 'Price: low to high') data.sort((a, b) => (a.item.price ?? Infinity) - (b.item.price ?? Infinity))
    else if (sort === 'Price: high to low') data.sort((a, b) => (b.item.price ?? -1) - (a.item.price ?? -1))
    else data.sort((a, b) => b.score - a.score)
    return data.map(({ item }) => item)
  }, [searchedQuery, category, subject, semester, condition, availability, maxPrice, sort])

  useEffect(() => {
    if (!searchedQuery || loading || lastSpokenQuery.current === searchedQuery) return
    lastSpokenQuery.current = searchedQuery
    const message = results.length
      ? `I found ${results.length} ${results.length === 1 ? 'result' : 'results'} for ${searchedQuery}. Here ${results.length === 1 ? 'it is' : 'are the results'}.`
      : `I couldn't find an exact match for ${searchedQuery}. Try a broader search or another category.`
    setVoiceMessage(message)
    speak(message)
  }, [searchedQuery, loading, results])

  useEffect(() => () => {
    recognitionRef.current?.abort()
    window.speechSynthesis?.cancel()
  }, [])

  const clearFilters = () => {
    setCategory('All'); setSubject('All subjects'); setSemester('All semesters'); setCondition('Any condition'); setAvailability('Any availability'); setMaxPrice(''); setSort('Relevance')
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm"><Icon name="book" size={19}/></div>
            <div><div className="text-lg font-bold tracking-tight">Campus<span className="text-blue-600">Connect</span></div><div className="hidden text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400 sm:block">Student discovery hub</div></div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {['Dashboard', 'Library', 'Marketplace', 'Resources', 'Lost & Found'].map((link) => <button key={link} className={`rounded-lg px-3 py-2 text-sm font-medium ${link === 'Dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{link}</button>)}
          </nav>
          <div className="flex items-center gap-2"><button className="grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Icon name="bell"/></button><div className="grid size-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">AS</div></div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-blue-100 bg-white">
          <div className="hero-grid absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><Icon name="spark" size={14}/> AI-powered search <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">Demo</span></div>
            <h1 className="text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-5xl">Your Campus. <span className="text-blue-600">One Smart Search.</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Find books, study resources, and campus listings effortlessly.</p>
            <form onSubmit={(event: FormEvent) => { event.preventDefault(); doSearch() }} className="mx-auto mt-8 max-w-3xl">
              <div className={`flex items-center rounded-2xl border bg-white p-2 shadow-[0_18px_50px_-20px_rgba(37,99,235,.35)] transition ${error ? 'border-red-400' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100'}`}>
                <div className="ml-2 text-slate-400"><Icon name="search" size={22}/></div>
                <input value={query} onChange={(event) => { setQuery(event.target.value); setError('') }} aria-label="Search CampusConnect" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-slate-400" placeholder="Ask CampusConnect anything..." />
                {query && <button type="button" onClick={() => { setQuery(''); setError('') }} className="grid size-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search"><Icon name="close" size={18}/></button>}
                <button type="button" onClick={assistantState === 'listening' ? stopListening : startListening} className={`relative grid size-11 shrink-0 place-items-center rounded-xl transition ${assistantState === 'listening' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`} aria-label={assistantState === 'listening' ? 'Stop listening' : 'Search by voice'} aria-pressed={assistantState === 'listening'}>
                  {assistantState === 'listening' && <span className="absolute inset-0 animate-ping rounded-xl bg-red-400 opacity-30"/>}
                  <span className="relative"><Icon name={assistantState === 'listening' ? 'stop' : 'mic'} size={19}/></span>
                </button>
                <button disabled={loading} className="ml-1 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"><Icon name="search" size={17}/><span className="hidden sm:inline">Search</span></button>
              </div>
              {error && <p role="alert" className="mt-2 text-left text-sm font-medium text-red-600">{error}</p>}
            </form>
            <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 text-left shadow-sm sm:flex-row sm:items-center">
              <div className={`relative grid size-11 shrink-0 place-items-center rounded-xl ${assistantState === 'error' ? 'bg-red-50 text-red-600' : assistantState === 'listening' ? 'bg-red-50 text-red-600' : assistantState === 'speaking' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {assistantState === 'speaking' ? <div className="voice-bars" aria-hidden="true"><span/><span/><span/><span/></div> : <Icon name={assistantState === 'listening' ? 'mic' : assistantState === 'error' ? 'close' : 'spark'} size={20}/>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className={`size-2 rounded-full ${assistantState === 'error' ? 'bg-red-500' : assistantState === 'listening' ? 'animate-pulse bg-red-500' : assistantState === 'speaking' ? 'animate-pulse bg-emerald-500' : assistantState === 'processing' ? 'animate-pulse bg-amber-500' : 'bg-slate-300'}`}/><span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">{assistantState}</span></div>
                <p aria-live="polite" className="mt-1 truncate text-sm font-medium text-slate-700">{voiceMessage}</p>
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                {assistantState === 'speaking' ? <button type="button" onClick={() => { window.speechSynthesis.pause(); setAssistantState('idle') }} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Pause voice response"><Icon name="pause" size={17}/></button> : <button type="button" onClick={() => { if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setAssistantState('speaking') } else speak(voiceMessage) }} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40" aria-label="Play voice response" disabled={!voiceMessage}><Icon name="play" size={17}/></button>}
                <button type="button" onClick={stopSpeaking} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Stop voice response"><Icon name="stop" size={16}/></button>
                <button type="button" onClick={() => { const next = !voiceEnabled; setVoiceEnabled(next); if (!next) stopSpeaking(); setVoiceMessage(next ? 'Voice responses enabled.' : 'Voice responses muted. Voice search still works.') }} className={`grid size-9 place-items-center rounded-lg ${voiceEnabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`} aria-label={voiceEnabled ? 'Mute voice responses' : 'Enable voice responses'} aria-pressed={!voiceEnabled}><Icon name={voiceEnabled ? 'volume' : 'mute'} size={18}/></button>
              </div>
            </div>
            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setQuery(suggestion); doSearch(suggestion) }} className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700">{suggestion}</button>)}
            </div>
          </div>
        </section>

        {!searchedQuery && !loading ? (
          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[['book','Explore the library','Find textbooks, references, and academic titles.'],['market','Student marketplace','Discover affordable books sold by students.'],['spark','Study smarter','Access notes, resource packs, and past papers.']].map(([icon,title,copy]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={icon}/></div><h2 className="font-bold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></article>)}
            </div>
            {recent.length > 0 && <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Icon name="history" size={18}/> Recent searches</h2><button onClick={() => { setRecent([]); localStorage.removeItem('campusconnect-searches') }} className="text-xs font-semibold text-slate-500 hover:text-blue-600">Clear history</button></div><div className="mt-4 flex flex-wrap gap-2">{recent.map((entry) => <button key={entry} onClick={() => { setQuery(entry); doSearch(entry) }} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700">{entry}</button>)}</div></div>}
          </section>
        ) : loading ? (
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><div className="mb-6 h-6 w-64 animate-pulse rounded bg-slate-200"/><div className="grid gap-6 lg:grid-cols-[240px_1fr]"><div className="h-72 animate-pulse rounded-2xl bg-slate-200"/><div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map((x) => <div key={x} className="h-64 animate-pulse rounded-2xl bg-slate-200"/>)}</div></div></div>
        ) : (
          <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Smart search results</p><h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{results.length ? `Here’s what we found for “${searchedQuery}”` : 'No exact matches found'}</h2><p className="mt-1 text-sm text-slate-500">{results.length ? `${results.length} verified demo record${results.length === 1 ? '' : 's'} matched your search.` : 'Try broadening your search or choosing a related category below.'}</p></div>
              <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold lg:hidden"><Icon name="sliders" size={17}/> Filters</button>
            </div>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{categories.map((tab) => <button key={tab} onClick={() => setCategory(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${category === tab ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{tab}</button>)}</div>
            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
              <aside className={`${filterOpen ? 'block' : 'hidden'} h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block`}>
                <div className="mb-5 flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold"><Icon name="sliders" size={18}/> Filters</h3><button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Clear all</button></div>
                <FilterSelect label="Subject" value={subject} setValue={setSubject} options={['All subjects','Programming','Artificial Intelligence','Information Technology','Computer Science','Mathematics','General']}/>
                <FilterSelect label="Semester" value={semester} setValue={setSemester} options={['All semesters','Semester II','Semester III','Semester IV','Semester V','Semester VI']}/>
                {(category === 'All' || category === 'Student Marketplace') && <><label className="mb-2 mt-5 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="price">Maximum price</label><div className="relative"><span className="absolute left-3 top-2.5 text-sm text-slate-400">₹</span><input id="price" min="0" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))} placeholder="Any price" className="w-full rounded-xl border border-slate-200 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></div></>}
                {(category === 'All' || category === 'Student Marketplace' || category === 'Book Exchange') && <FilterSelect label="Condition" value={condition} setValue={setCondition} options={['Any condition','Like new','Good']}/>}
                <FilterSelect label="Availability" value={availability} setValue={setAvailability} options={['Any availability','Available now']}/>
                <div className="mt-5 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-800"><strong>Prototype mode.</strong> Results come from the demo catalog. No live AI or Firebase data is connected.</div>
              </aside>
              <div>
                <div className="mb-4 flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{results.length ? `${results.length} results` : 'Suggestions'}</span><select aria-label="Sort results" value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"><option>Relevance</option><option>Price: low to high</option><option>Price: high to low</option></select></div>
                {results.length ? <div className="grid gap-4 md:grid-cols-2">{results.map((item) => <ResultCard key={item.id} item={item}/>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Icon name="search" size={26}/></div><h3 className="mt-5 text-lg font-bold">We couldn’t find an exact match</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try a broader phrase, clear filters, or explore one of these related searches.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{suggestions.slice(0,4).map((s) => <button key={s} onClick={() => { setQuery(s); clearFilters(); doSearch(s) }} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{s}</button>)}</div></div>}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-400">CampusConnect Smart Search · Interactive demo using sample campus data</footer>
    </div>
  )
}

function FilterSelect({ label, value, setValue, options }: { label: string; value: string; setValue: (value: string) => void; options: string[] }) {
  return <div className="mt-5 first:mt-0"><label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label><select value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{options.map((option) => <option key={option}>{option}</option>)}</select></div>
}

function ResultCard({ item }: { item: Item }) {
  const categoryStyles: Record<Category, string> = { 'Library Books': 'bg-blue-50 text-blue-700', 'Study Resources': 'bg-violet-50 text-violet-700', 'Student Marketplace': 'bg-emerald-50 text-emerald-700', 'Book Exchange': 'bg-amber-50 text-amber-700', 'Lost & Found': 'bg-rose-50 text-rose-700', 'Book Requests': 'bg-cyan-50 text-cyan-700' }
  return <article className="group flex min-h-64 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
    <div className="flex gap-4">
      <div className={`cover-${item.cover} relative grid h-28 w-20 shrink-0 place-items-center overflow-hidden rounded-lg text-white shadow-md`}><Icon name={item.category === 'Lost & Found' ? 'search' : 'book'} size={26}/><span className="absolute bottom-2 text-[8px] font-bold uppercase tracking-widest opacity-80">Campus</span></div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${categoryStyles[item.category]}`}>{item.category}</span>{item.available ? <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500"/>Available</span> : <span className="text-[10px] font-semibold text-amber-600">Checked out</span>}</div><h3 className="mt-2 line-clamp-2 font-bold leading-5 text-slate-900">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</p>{item.price !== undefined && <p className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">₹{item.price}<span className="ml-1 text-xs font-medium text-slate-400">· {item.condition}</span></p>}</div>
    </div>
    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>
    <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.slice(0,3).map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">#{tag}</span>)}</div>
    <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4"><div className="text-xs text-slate-500">{item.subject}{item.semester && <><br/><span className="text-slate-400">{item.semester}</span></>}</div><button onClick={() => alert(`Demo details: ${item.title}`)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">View details <Icon name="arrow" size={15}/></button></div>
  </article>
}

export default App
