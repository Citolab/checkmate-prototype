import { useState, useEffect, useRef } from "react";
import jsonData from "./data.json";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip";
// import { TooltipArrow } from '@radix-ui/react-tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { PopoverArrow, PopoverClose } from "@radix-ui/react-popover";
import { TooltipArrow, TooltipPortal } from "@radix-ui/react-tooltip";
import { UserIcon } from "@heroicons/react/solid";

const CandidatePopover = ({ names = [] }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <UserIcon className="w-5 h-5 text-gray-600" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="p-4 bg-white rounded shadow-md">
      <h4 className="font-bold text-gray-700 mb-2">Kandidaten</h4>
      <ul className="text-sm text-gray-600">
        {names.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </PopoverContent>
  </Popover>
);

const AISuggestionPopup = ({
  question,
  answer,
  getAIExplanation,
  highlightWaterWord,
  handleScoreChange,
  visibleAIScores,
  scores
}) => {


  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-800">Toelichting</h3>
        <PopoverClose className="text-gray-400 hover:text-gray-600">
          ✕
        </PopoverClose>
      </div>

      <div className="mb-4">
        <div className="flex flex-col mb-3">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Voorgestelde score:
            </span>
            <span className="ml-2 w-8 h-8 bg-purple-100 border border-purple-300 rounded-full inline-flex items-center justify-center font-bold text-sm text-purple-800">
              {answer.aiScore}
            </span>



            <span className="text-sm text-purple-600 ml-2">
              {getAIExplanation(answer.id)?.confidence || 0}% zeker
            </span>
          </div>

          {/* Thumbs up and down for feedback using SVG icons */}
          <div className="flex items-center justify-between space-x-2">

            <div className="flex items-center mt-2 space-x-2">
              <button
                className="w-8 h-8 fill-green-600 rounded-full flex items-center justify-center text-sm font-semibold transition-colors bg-green-100 text-green-600 border border-green-300"
                title="Thumbs up - Agree with AI suggestion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <title>thumb-up</title>
                  <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" />
                </svg>
              </button>
              <button
                className="w-8 h-8 fill-red-600 rounded-full flex items-center justify-center text-sm font-semibold transition-colors bg-red-100 text-red-600 border border-red-300"
                title="Thumbs down - Disagree with AI suggestion"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <title>thumb-down</title>
                  <path d="M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z" />
                </svg>
              </button>
            </div>



            <PopoverClose onClick={() =>
                  handleScoreChange(answer.id, answer.aiScore)
                }
                disabled={
                  (
                    !visibleAIScores[answer.id]) ||
                  scores[answer.id] === answer.aiScore
                }
                className={` px-2 py-1 rounded-md  self-end text-sm transition
                              ${answer.confidence <= 10 ? `invisible` : ""}    
                              ${scores[answer.id] === answer.aiScore ||
                    (
                      !visibleAIScores[answer.id])
                    ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
                    : "bg-purple-600  text-white hover:bg-purple-700"
                  }`}
                title={
                  scores[answer.id] === answer.aiScore
                    ? "Score is al gelijk aan AI-suggestie"
                    : "Overnemen van AI-suggestie"
                }>

      
                {scores[answer.id] === answer.aiScore
                  ? "al overgenomen"
                  : "overnemen"}
      

            </PopoverClose>

          </div>


        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2 text-sm">
          Door scores van vergelijkbare antwoorden
        </h4>
        <div className="max-h-48 overflow-y-auto pr-2 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-2">Antwoord</th>
                <th className="text-center py-2 w-16">Score</th>
              </tr>
            </thead>
            <tbody>
              {getAIExplanation(answer.id)?.similarAnswers.map(
                (similar, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="py-2 px-2 text-gray-800">
                      {highlightWaterWord(similar.text)}
                    </td>
                    <td className="py-2 text-center">
                      <span className="w-6 h-6 bg-gray-100 border rounded-full inline-flex items-center justify-center text-xs font-medium text-gray-800">
                        {similar.score}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Generative AI feedback:
          </h4>
          <div className="text-sm text-gray-700 bg-purple-50 p-3 rounded-md border border-purple-100 flex justify-center">
            {/* {getAIExplanation(answer.id)?.explanation} */}
            <button
              onClick={() => {
                const prompt = `Vraag: ${question.title} ${question.text}\nAntwoordmodel: ${question.correctAnswer}\nAntwoord van leerling: ${answer.text}\nMaximale score: 2\n\nMet deze vraag, dit antwoordmodel en deze maximale score, wat zou jij de leerling als score geven?`;
                navigator.clipboard.writeText(prompt);
                alert("Prompt gekopieerd naar klembord!");
              }}
              className="bg-purple-600 text-white px-2 py-1 text-sm rounded-md hover:bg-purple-700 transition"
            >
              Kopieer prompt
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            gebruik de prompt om zelf in je chatgpt te kijken hoeveel punten die
            geeft
          </p>
        </div>
      </div>
    </>
  );
};

const ScoringSystem = () => {
  // States voor de applicatie
  const [scores, setScores] = useState({});
  const [showAISuggestions, setShowAISuggestions] = useState(false); // Default uit
  const [hideScored, setHideScored] = useState(false); // Default uit
  const [animatingItems, setAnimatingItems] = useState({});
  const [visibleAIScores, setVisibleAIScores] = useState({}); // Voor individuele AI-scores
  // Ref voor scrolling
  const rightColumnRef = useRef(null);

  // Vraag en antwoordmodel
  const question = jsonData.question;

  // AI-uitleg voor antwoorden
  const aiExplanations = jsonData.aiExplanations;

  // Voor antwoorden zonder specifieke uitleg
  const getDefaultExplanation = (answerId, score) => {
    const answer = answerGroups
      .flatMap((g) => g.answers)
      .find((a) => a.id === answerId);
    if (!answer) return null;

    let explanation = "";
    let similarAnswers = [];
    let confidence = 0;

    if (score === 0) {
      explanation = `Het antwoord "${answer.text}" bevat geen correcte abiotische factor voor de kamsalamander. De tekst geeft aan dat water de belangrijke abiotische factor is, maar dit wordt niet genoemd in het antwoord.`;
      similarAnswers = [
        { text: "de larven eten watervlooien", score: 0, date: "20-03-2025" },
        { text: "zeldzaamheid", score: 0, date: "17-02-2025" },
        { text: "voedsel voor de larven", score: 0, date: "12-01-2025" },
      ];
      confidence = 78;
    } else if (score === 1) {
      explanation = `Het antwoord "${answer.text}" bevat elementen die deels correct zijn, maar mist precisie of bevat ook incorrecte elementen. De tekst identificeert water als de belangrijke abiotische factor.`;
      similarAnswers = [
        { text: "wateromgeving", score: 1, date: "05-04-2025" },
        { text: "vochtige gebieden", score: 1, date: "19-02-2025" },
        { text: "waterpoel of vijver", score: 1, date: "25-01-2025" },
      ];
      confidence = 75;
    }

    return { explanation, similarAnswers, confidence };
  };

  // Antwoorden gegroepeerd
  const answerGroups = jsonData.answerGroups;

  // Effect om automatisch correcte antwoorden in te vullen bij eerste render
  useEffect(() => {
    // Haal alle antwoorden uit de "Correcte antwoorden" groep
    const correctGroup = jsonData.answerGroups.find(
      (group) => group.title === "Automatisch gescoorde antwoorden"
    );
    if (correctGroup) {
      const correctAnswers = correctGroup.answers;

      // Voeg score 2 toe voor water en Water. antwoorden
      const correctScores = {};
      correctAnswers.forEach((answer) => {
        // Vul antwoorden altijd in met score 2, niet met de AI-score
        if (
          answer.text.toLowerCase() === "water" ||
          answer.text.toLowerCase() === "water."
        ) {
          correctScores[answer.id] = 2;
        }
      });

      // Update de scores state zonder bestaande scores te overschrijven
      setScores((prevScores) => ({
        ...prevScores,
        ...correctScores,
      }));
    }
  }, []); // Removed jsonData.answerGroups from the dependency array


  // Safe utility function for hasOwnProperty
  const safeHasOwnProperty = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);

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
        [answerId]: score,
      });

      // Als we gescoorde items verbergen, voeg dit item toe aan animerende items
      if (hideScored) {
        setAnimatingItems((prev) => ({ ...prev, [answerId]: true }));

        // Verwijder het item uit animerende items na animatie
        setTimeout(() => {
          setAnimatingItems((prev) => {
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
      Object.keys(scores).forEach((id) => {
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

  const togglePopup = (answerId) => {
    // Als AI-suggesties niet standaard zichtbaar zijn, maak deze specifieke zichtbaar
    if (!showAISuggestions) {
      setVisibleAIScores(prev => ({
        ...prev,
        [answerId]: true
      }));
    }
  };

  // Antwoord opzoeken voor popup
  const getAnswerById = (id) => {
    return answerGroups.flatMap((g) => g.answers).find((a) => a.id === id);
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
      if (part.toLowerCase() === "water") {
        return (
          <span key={index} className="bg-purple-200 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Bepaal welke antwoorden getoond moeten worden op basis van filters
  const getFilteredAnswers = (group) => {
    if (!hideScored) {
      return group.answers;
    }

    return group.answers.filter(
      (answer) =>
        !safeHasOwnProperty(scores, answer.id) || animatingItems[answer.id]
    );
  };

  const handleGroupScoreChange = (groupIndex, score) => {
    const group = answerGroups[groupIndex];
    const newScores = { ...scores };

    group.answers.forEach((answer) => {
      newScores[answer.id] = score;
    });

    setScores(newScores);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex bg-gray-200 overflow-hidden p-6 rounded-sm h-dvh">
        {/* Linker kolom - Vraag */}
        <div className="w-1/3 mr-6">
          {/* Progress Circles for Items */}
          <div className="flex justify-center items-center mb-4">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full mx-1 flex items-center justify-center text-xs font-bold
                ${index < 5
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                  }`}
              >
                {index + 1}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full mx-1 flex items-center justify-center bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-blue-600"
              >
                <title>chevron-right</title>
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">
                Voortgang beoordeling
              </div>
              <div className="text-sm text-gray-600">
                {Object.keys(scores).length} van{" "}
                {answerGroups.reduce(
                  (sum, group) => sum + group.answers.length,
                  0
                )}{" "}
                antwoorden
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(Object.keys(scores).length /
                    answerGroups.reduce(
                      (sum, group) => sum + group.answers.length,
                      0
                    )) *
                    100
                    }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Antwoordmodel los bovenin */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                ✓
              </span>
              <h3 className="text-gray-700 font-semibold">Antwoordmodel</h3>
            </div>
            <span className="text-lg font-bold text-gray-800 mt-2 bg-purple-200 px-1 rounded">
              {question.correctAnswer}
            </span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {question.title}
            </h2>
            <p className="text-gray-700 mb-4">{question.text}</p>
            <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-800">
                {question.instruction}
              </h3>
            </div>
            <div className="mt-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Kammmolchmaennchen.jpg"
                alt="Afbeelding van een kamsalamander"
                className="rounded-lg mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Rechter kolom - Antwoordmodel en antwoorden */}
        <div
          ref={rightColumnRef}
          className="flex-1 flex flex-col h-full overflow-auto"
        >
          {/* Voortgangsbalk in grijze gebied */}

          {/* Scrollbare antwoorden container */}
          <div className="pr-1">
            {/* Antwoordentabel zonder blauwe header */}
            <div className="rounded-lg shadow-sm overflow-y-auto flex-grow relative">
              {/* Kolomlabels */}
              <div className="px-4 py-2 flex items-center justify-between">
                {/* <div className="flex-grow font-medium text-gray-700">Antwoord</div> */}
                {/* <div className="w-32 text-center font-medium text-gray-700 mr-2">Score</div> */}
                {/* <div className="w-20 text-center font-medium text-gray-700">AI</div> */}
                {/* Toggle voor het verbergen van gescoorde antwoorden */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Verberg gescoorde
                  </span>
                  <button
                    onClick={toggleHideScored}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hideScored ? "bg-blue-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hideScored ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>



                {/* Toggle voor AI suggesties */}
                <div className="flex items-center justify-end gap-2">
                  <span>AI-suggesties</span>
                  verbergen
                  <button
                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showAISuggestions ? "bg-purple-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAISuggestions ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                  tonen
                </div>
              </div>

              {/* Add a button to apply all AI-suggested scores */}

              <button
                onClick={() => {
                  const newScores = {};
                  answerGroups.forEach((group) => {
                    group.answers.forEach((answer) => {
                      if (answer.aiScore !== undefined) {
                        newScores[answer.id] = answer.aiScore;
                      }
                    });
                  });
                  setScores((prevScores) => ({
                    ...prevScores,
                    ...newScores,
                  }));
                }}
                className={`bg-purple-800 text-purple-50 border border-purple-300 px-4 py-2 rounded-lg text-sm float-right
                      ${showAISuggestions ? "visible" : "invisible"}
                      `}
              >
                Pas alle AI-suggesties toe
              </button>


              {answerGroups.map((group, groupIndex) => {
                const filteredAnswers = getFilteredAnswers(group);

                // Skip this group if it has no visible answers
                if (filteredAnswers.length === 0) return null;

                return (
                  <div
                    key={groupIndex}
                    className="border-b last:border-b-0 mt-12"
                  >
                    <div className="px-4 py-2 font-medium text-xs uppercase text-gray-700 sticky z-10">
                      {group.title}

                      <div>
                        <Tooltip
                          defaultOpen={groupIndex == 1 ? true : false}
                        >
                          <TooltipTrigger asChild>
                            <div
                              className="flex gap-2 mt-2"
                              style={{ width: "fit-content" }}
                            >
                              {[0, 1, 2].map((score) => (
                                <button
                                  key={score}
                                  onClick={() =>
                                    handleGroupScoreChange(groupIndex, score)
                                  }
                                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-gray-400 text-gray-600"
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="normal-case"
                            side="right"
                            align="start"
                          >
                            Scoor de groep
                            <TooltipArrow
                              fill="#ffffff"
                              className="TooltipArrow border-white"
                            />
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {filteredAnswers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className={`px-4 py-3 border-t border-gray-100 flex items-center bg-white `}
                        style={{
                          transition: "all 0.5s ease",
                          maxHeight: animatingItems[answer.id] ? "0" : "100px",
                          opacity: animatingItems[answer.id] ? "0" : "1",
                          overflow: animatingItems[answer.id]
                            ? "hidden"
                            : "visible",
                        }}
                      >
                        <div className="flex-grow">
                          <p
                            className={`text-gray-800 ${safeHasOwnProperty(scores, answer.id) &&
                              !hideScored
                              ? "text-gray-500"
                              : ""
                              }`}
                          >
                            {highlightWaterWord(answer.text)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Docent scoring buttons met label */}
                          <div
                            className="flex gap-2 justify-center"
                            style={{ width: "132px" }}
                          >
                            {[0, 1, 2].map((score) => (
                              <button
                                key={score}
                                onClick={() =>
                                  handleScoreChange(answer.id, score)
                                }
                                className={`w-8 h-8 rounded-full border flex items-center justify-center
                                ${scores[answer.id] === score
                                    ? score === answer.aiScore
                                      ? "bg-purple-600 text-white border-purple-600"
                                      : "bg-gray-700 text-white border-gray-700"
                                    : "border-gray-300 text-gray-600"
                                  }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>

                          {/* AI-suggestie or vraagteken knop */}
                          <div
                            className="flex items-center justify-center"
                            style={{ width: "80px" }}
                          >
                            {/* Pijl om AI-suggestie over te nemen (altijd zichtbaar maar mogelijk disabled) */}
                            <button
                              onClick={() =>
                                handleScoreChange(answer.id, answer.aiScore)
                              }
                              disabled={
                                (!showAISuggestions &&
                                  !visibleAIScores[answer.id]) ||
                                scores[answer.id] === answer.aiScore
                              }
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                              ${answer.confidence <= 10 ? `invisible` : ""}    
                              ${scores[answer.id] === answer.aiScore ||
                                  (!showAISuggestions &&
                                    !visibleAIScores[answer.id])
                                  ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed invisible"
                                  : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300"
                                }`}
                              title={
                                scores[answer.id] === answer.aiScore
                                  ? "Score is al gelijk aan AI-suggestie"
                                  : "Overnemen van AI-suggestie"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            {answer.confidence > 10 ? (

                              <Tooltip defaultOpen={(groupIndex == 1 || groupIndex == 0) && index == 0 ? true : false}>
                                <Popover >
                                  <TooltipTrigger asChild>
                                    <PopoverTrigger asChild >
                                      <button
                                        onClick={() => togglePopup(answer.id)}
                                        className={`ml-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border bg-purple-100 text-purple-800 border-purple-300`}
                                        title="AI-suggestie (klik voor details)"
                                      >
                                        <span
                                          className={`${scores[answer.id] === answer.aiScore ||
                                            showAISuggestions ||
                                            visibleAIScores[answer.id]
                                            ? ""
                                            : "blur-sm"
                                            }`}
                                        >
                                          {answer.aiScore}
                                        </span>
                                      </button>
                                    </PopoverTrigger>
                                  </TooltipTrigger>

                                  <PopoverContent side="left" align="start" alignOffset={-54} sideOffset={200} className="w-80">
                                    {/* AI-suggestie popup */}
                                    <AISuggestionPopup
                                      question={question}
                                      answer={answer}
                                      getAIExplanation={getAIExplanation}
                                      highlightWaterWord={highlightWaterWord}
                                      handleScoreChange={handleScoreChange}
                                      visibleAIScores={visibleAIScores}
                                      scores={scores}
                                    />
                                    <PopoverArrow
                                      fill="#ffffff"
                                      className="TooltipArrow border-white"
                                    />
                                  </PopoverContent>

                                  <TooltipPortal>
                                    <TooltipContent>
                                      {scores[answer.id] === answer.aiScore ||
                                        showAISuggestions ||
                                        visibleAIScores[answer.id]
                                        ? "Toon AI redenering achter score"
                                        : "Toon AI score"}
                                      <TooltipArrow
                                        fill="#ffffff"
                                        className="TooltipArrow border-white"
                                      />
                                    </TooltipContent>
                                  </TooltipPortal>
                                </Popover>
                              </Tooltip>


                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className={`ml-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border bg-white text-gray-400 border-gray-300`}
                                  >
                                    ?
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Geen AI-suggestie beschikbaar
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <CandidatePopover names={answer.names} />
                      </div>
                    ))}
                  </div>

                );
              })}
            </div>
            <button className="bg-blue-600 mt-4 float-right text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Volgende vraag
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ScoringSystem;
