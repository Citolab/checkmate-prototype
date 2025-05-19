import React from 'react';

export function HeaderBar(props) {
    return (<header className="bg-white shadow-md sticky top-0 z-10 w-full">
        <div className="w-full px-4">
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    <div className="w-12 h-12 mr-3">
                        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#E81F76" />
                            <path d="M14 15C14 12.2386 16.2386 10 19 10H28C30.7614 10 33 12.2386 33 15V25C33 27.7614 30.7614 30 28 30H19C16.2386 30 14 27.7614 14 25V15Z" fill="#003082" />
                            <path d="M7 15C7 12.2386 9.23858 10 12 10H16V30H12C9.23858 30 7 27.7614 7 25V15Z" fill="#66CCFF" />
                        </svg>
                    </div>
                    <div className="flex">
                        <a href="/" className={`cursor-pointer px-5 py-4 font-medium border-b-2 ${props.currentTab === 'nakijken' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`} onClick={() => props.setCurrentTab('nakijken')}>
                            Nakijken
                        </a>
                        <a href="/rapportage" className={`cursor-pointer px-5 py-4 font-medium border-b-2 ${props.currentTab === 'rapportage' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:border-gray-300'}`} onClick={() => props.setCurrentTab('rapportage')}>
                            Rapportage
                        </a>
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm hidden md:block">Monique Esvelt</span>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">ME</span>
                    </div>
                </div>
            </div>
        </div>
    </header>);
}
