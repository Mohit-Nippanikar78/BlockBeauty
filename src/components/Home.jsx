import React, { useRef, useState, useEffect } from 'react'
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import Editor from '@monaco-editor/react';

const bgs = [
    { bgName: "Indigo", classStr: "bg-gradient-to-r from-violet-600 to-indigo-600" },
    { bgName: "Yellow", classStr: "bg-gradient-to-r from-amber-200 to-yellow-400" },
    { bgName: "Emerald", classStr: "bg-gradient-to-r from-emerald-500 to-emerald-900" },
    { bgName: "Red", classStr: "bg-gradient-to-r from-red-500 to-orange-500" },
    { bgName: "Cyan", classStr: "bg-gradient-to-r from-cyan-500 to-blue-500" }
];

const pad = [
    { padName: "4", classStr: "p-4" },
    { padName: "8", classStr: "p-8" },
    { padName: "12", classStr: "p-12" },
    { padName: "16", classStr: "p-16" },
]

const widthOptions = [
    { name: "Small", value: 480 },
    { name: "Medium", value: 640 },
    { name: "Large", value: 768 },
    { name: "XL", value: 900 }
];

const heightOptions = [
    { name: "Small", value: 400 },
    { name: "Medium", value: 500 },
    { name: "Large", value: 600 },
    { name: "XL", value: 750 }
];

const themes = [
    { name: "Dark", value: "vs-dark" },
    { name: "Light", value: "light" },
    { name: "High Contrast", value: "hc-black" }
];

const languages = [
    { name: "JavaScript", value: "javascript" },
    { name: "TypeScript", value: "typescript" },
    { name: "HTML", value: "html" },
    { name: "CSS", value: "css" },
    { name: "Python", value: "python" },
    { name: "Java", value: "java" },
    { name: "C#", value: "csharp" },
    { name: "JSON", value: "json" }
];

const Home = () => {
    const [bgColor, setBgColor] = useState(0);
    const [activePad, setActivePad] = useState(0);
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(600);
    const [fileName, setFileName] = useState("Untitled-1");
    const [code, setCode] = useState("// Type your code here");
    const [theme, setTheme] = useState(themes[0].value);
    const [language, setLanguage] = useState(languages[0].value);
    const divRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            
            // Auto-adjust width and height for mobile
            if (mobile) {
                setWidth(Math.min(window.innerWidth - 40, 900));
                setHeight(Math.min(window.innerHeight - 120, 800));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleWidthResize = (event) => {
        const initialX = event.clientX;
        const handleMouseMove = (event) => {
            const newWidth = width - (event.clientX - initialX);
            if (newWidth < 400) {
                setWidth(400);
            } else if (newWidth > 900) {
                setWidth(900);
            } else {
                setWidth(newWidth);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleHeightResize = (event) => {
        const initialY = event.clientY;
        const handleMouseMove = (event) => {
            const newHeight = height + (event.clientY - initialY);
            if (newHeight < 400) {
                setHeight(400);
            } else if (newHeight > 800) {
                setHeight(800);
            } else {
                setHeight(newHeight);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <div className="min-h-screen h-full relative flex flex-col-reverse md:flex-row bg-[#1a1a2e] text-white font-sans">
            {/* Sidebar Controls */}
            <div className="w-full md:w-64 h-auto md:h-screen bg-[#242442]/95 border-t md:border-t-0 md:border-r border-[#353558]/40 p-5 flex flex-col gap-4 z-20 md:fixed md:left-0 md:top-0">
                <div className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <img src="/images/logo.png" alt="BlockBeauty Logo" className="h-10 w-10" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold">BlockBeauty</span>
                </div>
                
                <div className="space-y-4">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wider">Appearance</div>
                    <BgColorBtn setBgColor={setBgColor} />
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                    <PaddingBtn setActivePad={setActivePad} activePad={activePad} />
                    
                    {/* Hide width and height controls on mobile */}
                    <div className="hidden md:block">
                        <div className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 tracking-wider">Dimensions</div>
                        <WidthSelector width={width} setWidth={setWidth} />
                        <HeightSelector height={height} setHeight={setHeight} />
                    </div>
                    
                    <div className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 tracking-wider">Code</div>
                    <LanguageSelector language={language} setLanguage={setLanguage} />
                    
                    <div className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 tracking-wider">Actions</div>
                    <SaveImageBtn divRef={divRef} />
                </div>
                
                <div className="mt-auto text-center text-xs text-gray-400 py-4 border-t border-[#353558]/40 md:mt-8">
                    Made By <span className="block text-sm text-white font-semibold mt-1">Mohit Nippanikar</span>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center md:ml-64 p-4 md:p-8">
                {/* Editor Window */}
                <div 
                    ref={divRef} 
                    style={{ 
                        width: isMobile ? '100%' : width, 
                        height: isMobile ? 'auto' : height,
                        minHeight: isMobile ? '70vh' : 'auto'
                    }} 
                    className={`relative z-10 ${pad[activePad].classStr} rounded-xl shadow-2xl ${bgs[bgColor].classStr} overflow-hidden w-full md:w-auto mb-8 md:mb-0`}
                >
                    <div className="w-full h-full shadow-2xl subpixel-antialiased border-[#353558] rounded-xl bg-black bg-opacity-30 border-2 mx-auto backdrop-blur-sm">
                        <div className="flex items-center h-12 rounded-t border-b-2 border-[#353558] text-center bg-[#242442] bg-opacity-80">
                            <div className="ml-4 bg-red-500 hover:bg-red-600 transition-colors shadow-inner rounded-full w-3 h-3"></div>
                            <div className="ml-2 bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-inner rounded-full w-3 h-3"></div>
                            <div className="ml-2 bg-green-500 hover:bg-green-600 transition-colors shadow-inner rounded-full w-3 h-3"></div>

                            <div className="mx-auto pr-16 font-bold opacity-90">
                                <input 
                                    className='bg-transparent text-center focus:outline-none focus:border-pink-500 px-3 py-1 rounded text-sm'
                                    type="text" 
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={`${isMobile ? "h-[70vh]" : "h-[calc(100%-3rem)]"} overflow-auto font-medium tracking-wide`}>
                            <Editor
                                height="100%"
                                language={language}
                                theme={theme}
                                value={code}
                                onChange={handleEditorChange}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                    padding: { top: 10 },
                                    overviewRulerBorder: false,
                                    automaticLayout: true
                                }}
                            />
                        </div>
                    </div>
                    {/* Width resize handle - hide on mobile */}
                    <div onMouseDown={handleWidthResize} className='hidden md:block h-full w-1 rounded-full top-0 -left-10 bg-opacity-10 cursor-col-resize bg-white absolute hover:bg-opacity-30'></div>
                    
                    {/* Height resize handle - hide on mobile */}
                    <div onMouseDown={handleHeightResize} className='hidden md:block w-8 h-2 rounded-full left-1/2 -bottom-4 -translate-x-1/2 bg-opacity-10 cursor-row-resize bg-white absolute hover:bg-opacity-30'></div>
                </div>
                
                {/* Dimensions Indicator - hide on mobile */}
                <div className='hidden md:block mt-6 text-xs text-gray-400'>
                    <span>Width: {width}px</span> <span className="mx-2">|</span> <span>Height: {height}px</span>
                </div>
            </div>
        </div>
    )
};

const BgColorBtn = ({ setBgColor }) => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="flex flex-col relative">
            <button 
                onClick={() => setToggle(v => !v)} 
                className="w-full bg-[#2d2d52]/90 border-[#353558]/60 border hover:bg-[#353558] transition-all font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center gap-2 group justify-between"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-blue-400 group-hover:text-blue-300">format_color_fill</span>
                    <span>Background</span>
                </div>
                <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${toggle ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div className={`${toggle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"} absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-[#2d2d52]/95 divide-y divide-[#353558]/30 rounded-xl shadow-xl border border-[#353558]/50 transition-all duration-200`}>
                <ul className="py-2 text-sm text-gray-200 w-64 grid grid-cols-2">
                    {bgs.map((bg, index) => (
                        <li key={index} onClick={() => { setBgColor(index); setToggle(false) }} className="flex w-full items-center gap-2 hover:bg-[#353558]/50 px-4 py-2.5 cursor-pointer transition-all" role="option">
                            <div className={`w-5 h-5 rounded-full ${bg.classStr} shadow-md`}></div>
                            {bg.bgName}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const ThemeSelector = ({ theme, setTheme }) => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="flex flex-col relative">
            <button 
                onClick={() => setToggle(v => !v)} 
                className="w-full bg-[#2d2d52]/90 border-[#353558]/60 border hover:bg-[#353558] transition-all font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center gap-2 group justify-between"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-purple-400 group-hover:text-purple-300">palette</span>
                    <span>Theme</span>
                </div>
                <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${toggle ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div className={`${toggle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"} absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-[#2d2d52]/95 divide-y divide-[#353558]/30 rounded-xl shadow-xl border border-[#353558]/50 transition-all duration-200`}>
                <ul className="py-1 text-sm text-gray-200 w-44">
                    {themes.map((t, index) => (
                        <li key={index} onClick={() => { setTheme(t.value); setToggle(false) }} className={`px-4 py-2.5 cursor-pointer hover:bg-[#353558]/50 transition-all flex items-center gap-2 ${theme === t.value ? 'text-pink-300 bg-[#353558]/30 font-medium' : ''}`}>
                            {theme === t.value && <span className="material-icons-outlined text-sm">check</span>}
                            {t.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const LanguageSelector = ({ language, setLanguage }) => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="flex flex-col relative">
            <button 
                onClick={() => setToggle(v => !v)} 
                className="w-full bg-[#2d2d52]/90 border-[#353558]/60 border hover:bg-[#353558] transition-all font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center gap-2 group justify-between"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-green-400 group-hover:text-green-300">code</span>
                    <span>Language</span>
                </div>
                <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${toggle ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div className={`${toggle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"} absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-[#2d2d52]/95 divide-y divide-[#353558]/30 rounded-xl shadow-xl border border-[#353558]/50 transition-all duration-200`}>
                <ul className="py-1 text-sm text-gray-200 w-44 max-h-60 overflow-y-auto">
                    {languages.map((lang, index) => (
                        <li key={index} onClick={() => { setLanguage(lang.value); setToggle(false) }} className={`px-4 py-2.5 cursor-pointer hover:bg-[#353558]/50 transition-all flex items-center gap-2 ${language === lang.value ? 'text-green-300 bg-[#353558]/30 font-medium' : ''}`}>
                            {language === lang.value && <span className="material-icons-outlined text-sm">check</span>}
                            {lang.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const SaveImageBtn = ({ divRef }) => {
    const handleDownloadImage = async () => {
        if (divRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(divRef.current);
            saveAs(dataUrl, 'blockbeauty.png');
        } catch (error) {
            console.error('Oops, something went wrong!', error);
        }
    };
    return (
        <button 
            onClick={handleDownloadImage} 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center gap-2 text-white justify-center shadow-lg"
            type="button"
        >
            <span className="material-icons-outlined text-lg">download</span>
            <span>Save Image</span>
        </button>
    )
}

const PaddingBtn = ({ setActivePad, activePad }) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 bg-[#2d2d52]/90 border-[#353558]/60 border rounded-lg text-sm px-4 py-2 mb-1.5">
                <span className="material-icons-outlined text-lg text-amber-400 mr-1">padding</span>
                <span className="font-medium">Padding</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
            {pad.map((p, i) => (
                    <button 
                        key={i} 
                        onClick={() => { setActivePad(i) }} 
                        className={`px-2 py-2 rounded-md transition-all font-medium text-sm ${activePad === i ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : 'bg-[#2d2d52]/90 border-[#353558]/60 border hover:bg-[#353558]/70 text-gray-300'}`}
                        type="button"
                    >
                        {p.padName}
                    </button>
                ))}
            </div>
        </div>
    )
}

const WidthSelector = ({ width, setWidth }) => {
    const [toggle, setToggle] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setToggle(false);
            }
        };
        if (toggle) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [toggle]);

    useEffect(() => {
        if (toggle && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const popupHeight = 340; // Approximate height of popup
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
                setDropUp(true);
            } else {
                setDropUp(false);
            }
        }
    }, [toggle]);
    
    return (
        <div className="flex flex-col relative" ref={dropdownRef}>
            <button 
                ref={buttonRef}
                onClick={() => setToggle(v => !v)} 
                className="w-full bg-[#16163a] hover:bg-[#1e1e48] transition-all font-medium rounded-lg text-sm px-4 py-3 text-left flex items-center justify-between"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Width</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-semibold">{width}px</span>
                    <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${toggle ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </div>
            </button>
            <div className={`${toggle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"} absolute left-full ml-2 ${dropUp ? 'bottom-0' : 'top-0'} z-30 bg-[#2d2d52]/95 divide-y divide-[#353558]/30 rounded-xl shadow-xl border border-[#353558]/50 transition-all duration-200`}>
                <div className="w-72 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white text-base flex items-center gap-2">
                            <span className="material-icons-outlined text-amber-400">width</span>
                            Width
                        </h3>
                        <div className="bg-[#353558]/70 px-3 py-1 rounded-md">
                            <span className="text-amber-300 font-bold text-lg">{width}</span>
                            <span className="text-amber-300/70 text-sm ml-0.5">px</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-5 mt-5">
                        <div className="relative">
                            <input 
                                type="range" 
                                min="400" 
                                max="900" 
                                step="10"
                                value={width} 
                                onChange={(e) => setWidth(parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#353558] accent-amber-500"
                            />
                            <div className="absolute -top-6 left-0 right-0">
                                <div className="w-full flex justify-between items-center">
                                    <span className="text-xs text-gray-400">400px</span>
                                    <span className="text-xs text-gray-400">900px</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                            <button 
                                onClick={() => setWidth(Math.max(400, width - 10))}
                                className="px-2 py-1 rounded bg-[#353558]/60 hover:bg-[#353558] text-white font-medium"
                            >
                                <span className="material-icons-outlined text-base">remove</span>
                            </button>
                            <div className="relative w-20">
                                <input 
                                    type="number" 
                                    min="400" 
                                    max="900"
                                    value={width}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val >= 400 && val <= 900) setWidth(val);
                                    }}
                                    className="w-full bg-[#353558]/70 border border-[#353558] rounded px-2 py-1 text-center text-white"
                                />
                                <span className="absolute right-2 top-1.5 text-gray-400 text-xs">px</span>
                            </div>
                            <button 
                                onClick={() => setWidth(Math.min(900, width + 10))}
                                className="px-2 py-1 rounded bg-[#353558]/60 hover:bg-[#353558] text-white font-medium"
                            >
                                <span className="material-icons-outlined text-base">add</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-3">Quick Presets</div>
                        <div className="grid grid-cols-2 gap-3">
                            {widthOptions.map((opt) => (
                                <button 
                                    key={opt.value} 
                                    onClick={() => { setWidth(opt.value); }} 
                                    className={`px-3 py-3 rounded-lg transition-all text-center ${Math.abs(width - opt.value) < 10 
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-lg ring-2 ring-amber-500/50' 
                                        : 'bg-[#353558]/40 hover:bg-[#353558]/70 text-gray-300'}`}
                                >
                                    {opt.name}
                                    <span className="block text-xs mt-1 opacity-80">{opt.value}px</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setToggle(false)}
                        className="w-full text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2.5 rounded-lg transition-all shadow-md font-medium"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

const HeightSelector = ({ height, setHeight }) => {
    const [toggle, setToggle] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setToggle(false);
            }
        };
        if (toggle) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [toggle]);

    useEffect(() => {
        if (toggle && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const popupHeight = 340; // Approximate height of popup
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
                setDropUp(true);
            } else {
                setDropUp(false);
            }
        }
    }, [toggle]);
    
    return (
        <div className="flex flex-col relative" ref={dropdownRef}>
            <button 
                ref={buttonRef}
                onClick={() => setToggle(v => !v)} 
                className="w-full bg-[#16163a] hover:bg-[#1e1e48] transition-all font-medium rounded-lg text-sm px-4 py-3 text-left flex items-center justify-between"
                type="button"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Height</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-teal-400 font-semibold">{height}px</span>
                    <svg className={`w-2.5 h-2.5 text-gray-400 transition-transform ${toggle ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </div>
            </button>
            <div className={`${toggle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"} absolute left-full ml-2 ${dropUp ? 'bottom-0' : 'top-0'} z-30 bg-[#2d2d52]/95 divide-y divide-[#353558]/30 rounded-xl shadow-xl border border-[#353558]/50 transition-all duration-200`}>
                <div className="w-72 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white text-base flex items-center gap-2">
                            <span className="material-icons-outlined text-teal-400">height</span>
                            Height
                        </h3>
                        <div className="bg-[#353558]/70 px-3 py-1 rounded-md">
                            <span className="text-teal-300 font-bold text-lg">{height}</span>
                            <span className="text-teal-300/70 text-sm ml-0.5">px</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-5 mt-5">
                        <div className="relative">
                            <input 
                                type="range" 
                                min="400" 
                                max="800" 
                                step="10"
                                value={height} 
                                onChange={(e) => setHeight(parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#353558] accent-teal-500"
                            />
                            <div className="absolute -top-6 left-0 right-0">
                                <div className="w-full flex justify-between items-center">
                                    <span className="text-xs text-gray-400">400px</span>
                                    <span className="text-xs text-gray-400">800px</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                            <button 
                                onClick={() => setHeight(Math.max(400, height - 10))}
                                className="px-2 py-1 rounded bg-[#353558]/60 hover:bg-[#353558] text-white font-medium"
                            >
                                <span className="material-icons-outlined text-base">remove</span>
                            </button>
                            <div className="relative w-20">
                                <input 
                                    type="number" 
                                    min="400" 
                                    max="800"
                                    value={height}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val >= 400 && val <= 800) setHeight(val);
                                    }}
                                    className="w-full bg-[#353558]/70 border border-[#353558] rounded px-2 py-1 text-center text-white"
                                />
                                <span className="absolute right-2 top-1.5 text-gray-400 text-xs">px</span>
                            </div>
                            <button 
                                onClick={() => setHeight(Math.min(800, height + 10))}
                                className="px-2 py-1 rounded bg-[#353558]/60 hover:bg-[#353558] text-white font-medium"
                            >
                                <span className="material-icons-outlined text-base">add</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-3">Quick Presets</div>
                        <div className="grid grid-cols-2 gap-3">
                            {heightOptions.map((opt) => (
                                <button 
                                    key={opt.value} 
                                    onClick={() => { setHeight(opt.value); }} 
                                    className={`px-3 py-3 rounded-lg transition-all text-center ${Math.abs(height - opt.value) < 10 
                                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg ring-2 ring-teal-500/50' 
                                        : 'bg-[#353558]/40 hover:bg-[#353558]/70 text-gray-300'}`}
                                >
                                    {opt.name}
                                    <span className="block text-xs mt-1 opacity-80">{opt.value}px</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setToggle(false)}
                        className="w-full text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2.5 rounded-lg transition-all shadow-md font-medium"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home