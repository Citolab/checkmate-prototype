import React, { useState, useEffect, useRef } from 'react';

const ScoringSystem = () => {
  // States voor de applicatie
  const [scores, setScores] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false); // Default uit
  const [hideScored, setHideScored] = useState(false); // Default uit
  const [animatingItems, setAnimatingItems] = useState({});
  const [visibleAIScores, setVisibleAIScores] = useState({}); // Voor individuele AI-scores

  // Ref voor scrolling
  const rightColumnRef = useRef(null);

  // Vraag en antwoordmodel
  const question = {
    title: "Salamander",
    text: "De kamsalamander is zeer zeldzaam in Nederland. Hij leeft vooral in de buurt van bossen en heggen. De voortplanting vindt plaats in water. Een vrouwtje legt dan zo'n 200 eieren. De larven eten watervlooien.",
    instruction: "Noteer de abiotische factor uit de tekst die voor de kamsalamander belangrijk is.",
    correctAnswer: "water"
  };

  // AI-uitleg voor antwoorden
  const aiExplanations = {
    1: {
      explanation: "Dit antwoord noemt direct en correct 'water' als abiotische factor. Water is essentieel voor de voortplanting van de kamsalamander zoals vermeld in de tekst.",
      similarAnswers: [
        { text: "water", score: 2, date: "12-04-2025" },
        { text: "Het water", score: 2, date: "23-03-2025" },
        { text: "water als abiotische factor", score: 2, date: "05-02-2025" },
        { text: "Water voor voortplanting", score: 2, date: "18-01-2025" }
      ],
      confidence: 98
    },
    2: {
      explanation: "Dit antwoord noemt correct 'Water' met een hoofdletter en een punt, maar benoemt dezelfde correcte abiotische factor als het juiste antwoord.",
      similarAnswers: [
        { text: "Water.", score: 2, date: "27-03-2025" },
        { text: "Water", score: 2, date: "14-02-2025" },
        { text: "Het water.", score: 2, date: "19-01-2025" }
      ],
      confidence: 97
    },
    3: {
      explanation: "Dit antwoord beschrijft de leefomgeving van de kamsalamander maar noemt geen abiotische factor. Bossen en heggen zijn biotische factoren (levende organismen), terwijl de vraag specifiek naar een abiotische factor vroeg.",
      similarAnswers: [
        { text: "leeft in de buurt van bossen", score: 0, date: "15-04-2025" },
        { text: "in de buurt van heggen", score: 0, date: "22-03-2025" },
        { text: "omgeving met bossen", score: 0, date: "09-02-2025" },
        { text: "bij bosgebieden en heggen", score: 0, date: "21-01-2025" }
      ],
      confidence: 94
    },
    8: {
      explanation: "Dit antwoord noemt 'temperatuur' als abiotische factor, wat op zich correct is als abiotische factor, maar niet expliciet genoemd wordt in de tekst als belangrijk voor de kamsalamander. Het krijgt daarom een gedeeltelijke score.",
      similarAnswers: [
        { text: "temperatuur", score: 1, date: "29-03-2025" },
        { text: "de temperatuur van het water", score: 1, date: "12-02-2025" },
        { text: "omgevingstemperatuur", score: 1, date: "05-01-2025" }
      ],
      confidence: 82
    },
    11: {
      explanation: "Dit antwoord bevat 'water' als correcte abiotische factor, maar noemt ook bossen en heggen, wat biotische factoren zijn. Het krijgt een gedeeltelijke score omdat het juiste antwoord erin zit, maar vermengd met incorrecte elementen.",
      similarAnswers: [
        { text: "omgeving met water en bossen", score: 1, date: "18-04-2025" },
        { text: "bossen, heggen en wateromgeving", score: 1, date: "03-03-2025" },
        { text: "natuurlijke omgeving met water", score: 1, date: "27-01-2025" }
      ],
      confidence: 85
    },
    14: {
      explanation: "Dit antwoord bevat 'water' als correcte abiotische factor, maar noemt ook bossen en heggen, wat biotische factoren zijn. Het krijgt een gedeeltelijke score omdat het juiste antwoord erin zit, maar vermengd met incorrecte elementen.",
      similarAnswers: [
        { text: "water en bossen", score: 1, date: "11-04-2025" },
        { text: "water, bossen en begroeiing", score: 1, date: "25-02-2025" },
        { text: "water in bosrijke omgeving", score: 1, date: "08-01-2025" }
      ],
      confidence: 88
    }
  };

  // Voor antwoorden zonder specifieke uitleg
  const getDefaultExplanation = (answerId, score) => {
    const answer = answerGroups.flatMap(g => g.answers).find(a => a.id === answerId);
    if (!answer) return null;

    let explanation = "";
    let similarAnswers = [];
    let confidence = 0;

    if (score === 0) {
      explanation = `Het antwoord "${answer.text}" bevat geen correcte abiotische factor voor de kamsalamander. De tekst geeft aan dat water de belangrijke abiotische factor is, maar dit wordt niet genoemd in het antwoord.`;
      similarAnswers = [
        { text: "de larven eten watervlooien", score: 0, date: "20-03-2025" },
        { text: "zeldzaamheid", score: 0, date: "17-02-2025" },
        { text: "voedsel voor de larven", score: 0, date: "12-01-2025" }
      ];
      confidence = 78;
    } else if (score === 1) {
      explanation = `Het antwoord "${answer.text}" bevat elementen die deels correct zijn, maar mist precisie of bevat ook incorrecte elementen. De tekst identificeert water als de belangrijke abiotische factor.`;
      similarAnswers = [
        { text: "wateromgeving", score: 1, date: "05-04-2025" },
        { text: "vochtige gebieden", score: 1, date: "19-02-2025" },
        { text: "waterpoel of vijver", score: 1, date: "25-01-2025" }
      ];
      confidence = 75;
    }

    return { explanation, similarAnswers, confidence };
  };

  // Antwoorden gegroepeerd
  const answerGroups = [
    {
      title: "Correcte antwoorden",
      answers: [
        { id: 1, text: "water", aiScore: 2 },
        { id: 2, text: "Water.", aiScore: 2 }
      ]
    },
    {
      title: "Omgeving-gerelateerde antwoorden",
      answers: [
        { id: 3, text: "leeft vooral in de buurt van bossen en heggen", aiScore: 0 },
        { id: 4, text: "Hij leeft vooral in de buurt van bossen en heggen.", aiScore: 0 },
        { id: 5, text: "bossen en heggen", aiScore: 0 },
        { id: 6, text: "leven in buurt van bossen en heggen", aiScore: 0 }
      ]
    },
    {
      title: "Overige antwoorden",
      answers: [
        { id: 7, text: "nestgelegenheden", aiScore: 0 },
        { id: 8, text: "de temperatuur", aiScore: 1 },
        { id: 9, text: "andere dieren die de eitjes op eten", aiScore: 0 },
        { id: 10, text: "watervlooien", aiScore: 0 },
        { id: 11, text: "omgeving (bossen, heggen en water in de buurt)", aiScore: 1 },
        { id: 12, text: "bosgroei", aiScore: 0 },
        { id: 13, text: "de larven eten de watervlooien op.", aiScore: 0 },
        { id: 14, text: "water bossen en heggen", aiScore: 1 },
        { id: 15, text: "vele verschillende kleuren", aiScore: 0 },
        { id: 16, text: "de kamsalamander is zeer zeldzaam in Nederland.", aiScore: 0 }
      ]
    }
  ];

  // Effect om automatisch correcte antwoorden in te vullen bij eerste render
  useEffect(() => {
    // Haal alle antwoorden uit de "Correcte antwoorden" groep
    const correctGroup = answerGroups.find(group => group.title === "Correcte antwoorden");
    if (correctGroup) {
      const correctAnswers = correctGroup.answers;

      // Voeg score 2 toe voor water en Water. antwoorden
      const correctScores = {};
      correctAnswers.forEach(answer => {
        // Vul antwoorden altijd in met score 2, niet met de AI-score
        if (answer.text.toLowerCase() === "water" || answer.text.toLowerCase() === "water.") {
          correctScores[answer.id] = 2;
        }
      });

      // Update de scores state zonder bestaande scores te overschrijven
      setScores(prevScores => ({
        ...prevScores,
        ...correctScores
      }));
    }
  }, []);

  // Add a click event listener to close the popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePopup && !event.target.closest('.ai-suggestie-popup')) {
        setActivePopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  // Score toekennen of verwijderen
  const handleScoreChange = (answerId, score) => {
    // Als dezelfde score opnieuw wordt aangeklikt, verwijder de score
    if (scores[answerId] === score) {
      const newScores = { ...scores };
      delete newScores[answerId];
      setScores(newScores);
    } else {
      // Anders, stel de nieuwe score in
      setScores({
        ...scores,
        [answerId]: score
      });

      // Als we gescoorde items verbergen, voeg dit item toe aan animerende items
      if (hideScored) {
        setAnimatingItems(prev => ({ ...prev, [answerId]: true }));

        // Verwijder het item uit animerende items na animatie
        setTimeout(() => {
          setAnimatingItems(prev => {
            const newAnimating = { ...prev };
            delete newAnimating[answerId];
            return newAnimating;
          });
        }, 500); // 500ms komt overeen met de transitieduur
      }
    }
  };

  // Toggle voor het verbergen van gescoorde antwoorden
  const toggleHideScored = () => {
    if (!hideScored) {
      // Als we gescoorde items gaan verbergen, eerst alle gescoorde items animeren
      const animating = {};
      Object.keys(scores).forEach(id => {
        animating[id] = true;
      });

      setAnimatingItems(animating);

      // Na de animatie de toggle updaten
      setTimeout(() => {
        setHideScored(true);
        setAnimatingItems({});
      }, 500);
    } else {
      // Direct tonen bij uitschakelen
      setHideScored(false);
    }
  };

  // Popup tonen/verbergen
  const togglePopup = (answerId) => {
    if (activePopup === answerId) {
      setActivePopup(null);
    } else {
      setActivePopup(answerId);

      // Als AI-suggesties niet standaard zichtbaar zijn, maak deze specifieke zichtbaar
      if (!showAISuggestions) {
        setVisibleAIScores(prev => ({
          ...prev,
          [answerId]: true
        }));
      }
    }
  };

  // Antwoord opzoeken voor popup
  const getAnswerById = (id) => {
    return answerGroups.flatMap(g => g.answers).find(a => a.id === id);
  };

  // AI-uitleg ophalen
  const getAIExplanation = (answerId) => {
    if (aiExplanations[answerId]) {
      return aiExplanations[answerId];
    } else {
      const answer = getAnswerById(answerId);
      return getDefaultExplanation(answerId, answer.aiScore);
    }
  };

  // Tekst markeren voor het woord 'water'
  const highlightWaterWord = (text) => {
    // Gebruik regex om alle instanties van 'water' (case-insensitive) te vinden
    // en vervang ze met gemarkeerde versie
    const regex = /(water)/gi;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === 'water') {
        return <span key={index} className="bg-purple-200 px-1 rounded">{part}</span>;
      }
      return part;
    });
  };

  // Bepaal welke antwoorden getoond moeten worden op basis van filters
  const getFilteredAnswers = (group) => {
    if (!hideScored) {
      return group.answers;
    }

    return group.answers.filter(answer => !scores.hasOwnProperty(answer.id) || animatingItems[answer.id]);
  };

  return (
    <div className="flex bg-gray-50 p-6 rounded-lg h-dvh mx-auto">
      {/* Linker kolom - Vraag */}
      <div className="w-1/4 mr-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{question.title}</h2>
          <p className="text-gray-700 mb-4">{question.text}</p>
          <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800">{question.instruction}</h3>
          </div>
          <div className="mt-4">
            <img
              src="/api/placeholder/260/180"
              alt="Afbeelding van een kamsalamander"
              className="rounded-lg mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Rechter kolom - Antwoordmodel en antwoorden */}
      <div ref={rightColumnRef} className="flex-1 flex flex-col">
        {/* Voortgangsbalk in grijze gebied */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-700">Voortgang beoordeling</div>
            <div className="text-sm text-gray-600">
              {Object.keys(scores).length} van {answerGroups.reduce((sum, group) => sum + group.answers.length, 0)} antwoorden
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(Object.keys(scores).length / answerGroups.reduce((sum, group) => sum + group.answers.length, 0)) * 100}%` }}>
            </div>
          </div>
        </div>

        {/* Antwoordmodel los bovenin */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold">Antwoordmodel</h3>
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">✓</span>
          </div>
          <p className="text-lg font-bold text-gray-800 mt-2">{question.correctAnswer}</p>
        </div>

        {/* Toggles direct boven leerlingantwoorden */}
        <div className="flex justify-end items-center mb-3 gap-6">

          {/* Add a button to apply all AI-suggested scores */}
          {showAISuggestions && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const newScores = {};
                  answerGroups.forEach(group => {
                    group.answers.forEach(answer => {
                      if (answer.aiScore !== undefined) {
                        newScores[answer.id] = answer.aiScore;
                      }
                    });
                  });
                  setScores(prevScores => ({ ...prevScores, ...newScores }));
                }}
                className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-1 rounded-lg text-sm "
              >
                Pas alle AI-suggesties toe
              </button>
            </div>
          )}

          {/* Toggle voor AI suggesties */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">AI-suggesties</span>
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showAISuggestions ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAISuggestions ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Toggle voor het verbergen van gescoorde antwoorden */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Verberg gescoorde</span>
            <button
              onClick={toggleHideScored}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hideScored ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hideScored ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>


        </div>





        {/* Scrollbare antwoorden container */}
        <div className="pr-1" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          {/* Antwoordentabel zonder blauwe header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-grow relative">
            {/* Kolomlabels */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center">
              <div className="flex-grow font-medium text-gray-700">Antwoord</div>
              <div className="flex items-center">
                <div className="w-32 text-center font-medium text-gray-700 mr-2">Score</div>
                <div className="w-20 text-center font-medium text-gray-700">AI</div>
              </div>
            </div>

            {answerGroups.map((group, groupIndex) => {
              const filteredAnswers = getFilteredAnswers(group);

              // Skip this group if it has no visible answers
              if (filteredAnswers.length === 0) return null;

              return (
                <div key={groupIndex} className="border-b border-gray-200 last:border-b-0">
                  <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700 sticky z-10">
                    {group.title}
                  </div>

                  {filteredAnswers.map((answer) => (
                    <div
                      key={answer.id}
                      className={`px-4 py-3 border-t border-gray-100 flex items-center hover:bg-gray-50 ${scores.hasOwnProperty(answer.id) && !hideScored ? 'bg-gray-50' : ''}`}
                      style={{
                        transition: 'all 0.5s ease',
                        maxHeight: animatingItems[answer.id] ? '0' : '100px',
                        opacity: animatingItems[answer.id] ? '0' : '1',
                        overflow: animatingItems[answer.id] ? 'hidden' : 'visible'
                      }}
                    >
                      <div className="flex-grow">
                        <p className={`text-gray-800 ${scores.hasOwnProperty(answer.id) && !hideScored ? 'text-gray-500' : ''}`}>{highlightWaterWord(answer.text)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Docent scoring buttons met label */}
                        <div className="flex gap-2 justify-center" style={{ width: '132px' }}>
                          {[0, 1, 2].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange(answer.id, score)}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center
                                ${scores[answer.id] === score ?
                                  (score === answer.aiScore ?
                                    'bg-purple-600 text-white border-purple-600' :
                                    'bg-gray-700 text-white border-gray-700') :
                                  'border-gray-300 text-gray-600'}`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>

                        {/* AI-suggestie of vraagteken knop */}
                        <div className="flex items-center justify-center" style={{ width: '80px' }}>
                          {/* Pijl om AI-suggestie over te nemen (altijd zichtbaar maar mogelijk disabled) */}
                          <button
                            onClick={() => handleScoreChange(answer.id, answer.aiScore)}
                            disabled={!showAISuggestions && !visibleAIScores[answer.id] || scores[answer.id] === answer.aiScore}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                              ${scores[answer.id] === answer.aiScore || (!showAISuggestions && !visibleAIScores[answer.id]) ?
                                'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed invisible' :
                                'bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300'}`}
                            title={scores[answer.id] === answer.aiScore ? "Score is al gelijk aan AI-suggestie" : "Overnemen van AI-suggestie"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {/* AI-score or vraagteken button */}
                          <button
                            onClick={() => togglePopup(answer.id)}
                            className={`ml-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border bg-purple-100 text-purple-800 border-purple-300`}
                            title="AI-suggestie (klik voor details)"
                          >
                            <span className={`${scores[answer.id] === answer.aiScore || showAISuggestions || visibleAIScores[answer.id] ? '' : 'blur-sm'}`}>
                              {answer.aiScore}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* AI-suggestie popup */}
                      {activePopup === answer.id && (
                        <div 
                          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 right-24 mt-2 ai-suggestie-popup"
                          style={{ zIndex: 9999 }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-800">AI-suggestie toelichting</h3>
                            <button
                              onClick={() => setActivePopup(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium text-gray-600">Antwoord:</span>
                              <span className="text-gray-800">"{highlightWaterWord(answer.text)}"</span>
                            </div>

                            <div className="flex flex-col mb-3">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">Voorgestelde score:</span>
                                <span className="ml-2 w-6 h-6 bg-purple-100 border border-purple-300 rounded-full inline-flex items-center justify-center font-bold text-sm text-purple-800">
                                  {answer.aiScore}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-600 mr-2">Zekerheid:</span>
                                <div className="flex-grow">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full"
                                      style={{
                                        width: `${getAIExplanation(answer.id)?.confidence || 0}%`,
                                        backgroundColor: `rgba(147, 51, 234, ${(getAIExplanation(answer.id)?.confidence || 0) / 100})`
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-right text-gray-600 mt-1">
                                    {getAIExplanation(answer.id)?.confidence || 0}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Vergelijkbare antwoorden uit database:</h4>
                            <div className="max-h-48 overflow-y-auto pr-2 mb-4">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left py-2 px-2">Antwoord</th>
                                    <th className="text-center py-2 w-16">Score</th>
                                    <th className="text-right py-2 px-2 w-24">Datum</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getAIExplanation(answer.id)?.similarAnswers.map((similar, idx) => (
                                    <tr key={idx} className="border-t border-gray-100">
                                      <td className="py-2 px-2 text-gray-800">{highlightWaterWord(similar.text)}</td>
                                      <td className="py-2 text-center">
                                        <span className="w-6 h-6 bg-gray-100 border rounded-full inline-flex items-center justify-center text-xs font-medium text-gray-800">
                                          {similar.score}
                                        </span>
                                      </td>
                                      <td className="py-2 px-2 text-right text-gray-600">{similar.date}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">AI feedback:</h4>
                              <div className="text-sm text-gray-700 bg-purple-50 p-3 rounded-md border border-purple-100">
                                {getAIExplanation(answer.id)?.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringSystem;