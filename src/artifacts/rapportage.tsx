import { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';

// RTTI Categories
const rttiCategories = ['R', 'T1', 'T2', 'I'];
const rttiFullNames = {
    'R': 'Reproductie',
    'T1': 'Toepassingsniveau 1',
    'T2': 'Toepassingsniveau 2',
    'I': 'Inzicht'
};

// Replace random question/answer generation with made-up biology questions and answers
const biologyQuestions = [
    {
        title: 'Wat is de functie van de bladgroenkorrels in een plantencel?',
        category: 'R',
        maxScore: 2,
        correctAnswer: 'Fotosynthese uitvoeren',
    },
    {
        title: 'Noem twee verschillen tussen een dierlijke en een plantaardige cel.',
        category: 'T1',
        maxScore: 3,
        correctAnswer: 'Plantaardige cellen hebben een celwand en bladgroenkorrels, dierlijke cellen niet',
    },
    {
        title: 'Leg uit waarom water belangrijk is voor het transport in planten.',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Water vervoert voedingsstoffen door de plant',
    },
    {
        title: 'Wat gebeurt er bij de verbranding in cellen?',
        category: 'T2',
        maxScore: 2,
        correctAnswer: 'Energie komt vrij uit glucose',
    },
    {
        title: 'Welke organen zijn betrokken bij de spijsvertering?',
        category: 'R',
        maxScore: 3,
        correctAnswer: 'Mond, slokdarm, maag, darmen',
    },
    {
        title: 'Beschrijf het proces van gaswisseling in de longen.',
        category: 'T1',
        maxScore: 3,
        correctAnswer: 'Zuurstof wordt opgenomen in het bloed, koolstofdioxide wordt afgegeven',
    },
    {
        title: 'Waarom is biodiversiteit belangrijk voor een ecosysteem?',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Het zorgt voor stabiliteit en veerkracht',
    },
    {
        title: 'Geef een voorbeeld van een voedselketen.',
        category: 'T2',
        maxScore: 2,
        correctAnswer: 'Gras → konijn → vos',
    },
    {
        title: 'Wat is de rol van enzymen bij de spijsvertering?',
        category: 'R',
        maxScore: 2,
        correctAnswer: 'Ze versnellen de afbraak van voedingsstoffen',
    },
    {
        title: 'Leg uit wat adaptatie betekent bij dieren.',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Aanpassing aan de omgeving',
    },
];

const madeUpStudentAnswers = [
    'Ze maken het blad groen',
    'Planten hebben een celwand, dieren niet',
    'Water zorgt dat de plant niet uitdroogt',
    'Er komt energie vrij',
    'Maag en darmen',
    'Zuurstof gaat het bloed in',
    'Dan kunnen dieren beter overleven',
    'Plant → koe → mens',
    'Ze helpen bij het verteren',
    'Dieren passen zich aan',
    'Ze zorgen voor fotosynthese',
    'Dieren hebben geen bladgroenkorrels',
    'Water is nodig voor groei',
    'Glucose wordt verbrand',
    'Slokdarm en maag',
    'Koolstofdioxide eruit, zuurstof erin',
    'Meer soorten is beter',
    'Gras → schaap → wolf',
    'Ze breken eten af',
    'Aanpassen aan kou',
];

const generateRandomData = () => {
    // Use biologyQuestions as the questions
    const questions = biologyQuestions.map((q, i) => ({
        ...q,
        id: i + 1,
        mostGivenAnswer: madeUpStudentAnswers[i % madeUpStudentAnswers.length],
        correctPercentage: Math.floor(Math.random() * 50) + 50,
    }));

    // Dutch names for students
    const dutchNames = [
        'Sanne de Vries', 'Mohammed El Amrani', 'Daan Bakker', 'Fatima Yilmaz',
        'Lieke van Dijk', 'Jayden Jansen', 'Fleur de Boer', 'Bram Visser',
        'Aisha Özdemir', 'Thomas Mulder', 'Elin Zhang', 'Noah van der Meer',
        'Sofia Rodriguez', 'Sam de Groot', 'Noor van Leeuwen'
    ];

    // Generate 15 students with made-up answers
    const students = dutchNames.map((name, i) => {
        let totalScore = 0;
        let maxPossibleScore = 0;
        const questionScores = questions.map((question, qIdx) => {
            // Random score between 0 and max score for the question
            const score = Math.floor(Math.random() * (question.maxScore + 1));
            totalScore += score;
            maxPossibleScore += question.maxScore;
            // Pick a made-up answer
            const answer = madeUpStudentAnswers[(i * 3 + qIdx) % madeUpStudentAnswers.length];
            return {
                questionId: question.id,
                score,
                maxScore: question.maxScore,
                answer,
                correct: score === question.maxScore
            };
        });
        // Calculate grade (1-10 scale)
        const percentage = (totalScore / maxPossibleScore) * 100;
        const grade = Math.max(1, Math.min(10, (percentage / 100) * 9 + 1)).toFixed(1);
        return {
            id: i + 1,
            name,
            questionScores,
            totalScore,
            maxPossibleScore,
            grade,
        };
    });
    return { questions, students };
};

// Calculate RTTI statistics
const calculateRttiStats = (questions, students) => {
    const rttiStats = rttiCategories.map(category => {
        const categoryQuestions = questions.filter(q => q.category === category);
        const maxPossibleScore = categoryQuestions.reduce((sum, q) => sum + q.maxScore, 0);

        const totalStudentScores = students.reduce((sum, student) => {
            const categoryScores = student.questionScores.filter(qs =>
                categoryQuestions.some(q => q.id === qs.questionId)
            );
            return sum + categoryScores.reduce((qSum, qs) => qSum + qs.score, 0);
        }, 0);

        const averageScore = totalStudentScores / students.length;
        const averagePercentage = maxPossibleScore > 0
            ? (averageScore / maxPossibleScore) * 100
            : 0;

        return {
            category,
            fullName: rttiFullNames[category],
            questionCount: categoryQuestions.length,
            maxPossibleScore,
            averageScore: averageScore.toFixed(1),
            averagePercentage: averagePercentage.toFixed(1),
        };
    });

    return rttiStats;
};

// New: StudentAnswers component
const StudentAnswers = ({ student, questions, onBack }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Antwoorden van {student.name}</h2>
            <button
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={onBack}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Terug naar klasoverzicht
            </button>
        </div>
        <table className="min-w-full">
            <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Antwoorden leerling</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Vraag</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Categorie</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Score</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Goed antwoord</th>
                </tr>
            </thead>
            <tbody>
                {student.questionScores.map(qs => {
                    const question = questions.find(q => q.id === qs.questionId);
                    return (
                        <tr key={qs.questionId} className="border-b">
                            <td className="py-2 px-4">{qs.answer}</td>
                            <td className="py-2 px-4">{question.title}</td>
                            <td className="py-2 px-4">{question.category}</td>
                            <td className="py-2 px-4">{qs.score} / {qs.maxScore}</td>
                            <td className="py-2 px-4">{question.correctAnswer}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const RTTIDashboard = () => {
    const [data, setData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentTab, setCurrentTab] = useState('rapportage');
    const [sortConfig, setSortConfig] = useState({ key: 'grade', direction: 'desc' });

    useEffect(() => {
        const generatedData = generateRandomData();
        const rttiStats = calculateRttiStats(generatedData.questions, generatedData.students);

        setData({
            ...generatedData,
            rttiStats,
        });
    }, []);

    if (!data) return <div className="flex justify-center items-center h-screen">Laden...</div>;

    const { questions, students, rttiStats } = data;

    // Calculate averages
    const averageGrade = (
        students.reduce((sum, student) => sum + parseFloat(student.grade), 0) / students.length
    ).toFixed(1);

    const maxTotalScore = questions.reduce((sum, q) => sum + q.maxScore, 0);
    const averageTotalScore = parseFloat((
        students.reduce((sum, student) => sum + student.totalScore, 0) / students.length
    ).toFixed(1));
    const averageScorePercentage = ((averageTotalScore / maxTotalScore) * 100).toFixed(1);

    // Color scheme for RTTI categories
    const rttiColors = {
        'R': '#4169E1', // Royal Blue
        'T1': '#FF6347', // Tomato
        'T2': '#32CD32', // Lime Green
        'I': '#FFD700'  // Gold
    };

    // Helper: Calculate RTTI correct percentage for a student
    const getStudentRttiCorrect = (student, category) => {
        const categoryQuestions = questions.filter(q => q.category === category);
        if (categoryQuestions.length === 0) return 0;
        const correctCount = student.questionScores.filter(qs => {
            const q = questions.find(qq => qq.id === qs.questionId);
            return q && q.category === category && qs.correct;
        }).length;
        return Math.round((correctCount / categoryQuestions.length) * 100);
    };

    // Sorting logic
    const sortedStudents = [...students].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aValue = a[key];
        let bValue = b[key];
        if (['R', 'T1', 'T2', 'I'].includes(key)) {
            aValue = getStudentRttiCorrect(a, key);
            bValue = getStudentRttiCorrect(b, key);
        } else if (key === 'grade') {
            aValue = parseFloat(a.grade);
            bValue = parseFloat(b.grade);
        } else if (key === 'totalScore') {
            aValue = a.totalScore;
            bValue = b.totalScore;
        } else if (key === 'name') {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'desc' };
        });
    };

    const renderSummaryCards = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                    <h3 className="text-gray-500 font-medium mb-1">Gemiddeld cijfer</h3>
                    <div className="flex items-end">
                        <span className="text-5xl font-bold text-blue-600">{averageGrade}</span>
                        <span className="text-gray-500 ml-2 mb-1">/ 10</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                            {parseFloat(averageGrade) >= 5.5 ?
                                `${Math.round((students.filter(s => parseFloat(s.grade) >= 5.5).length / students.length) * 100)}% voldoendes` :
                                `${Math.round((students.filter(s => parseFloat(s.grade) < 5.5).length / students.length) * 100)}% onvoldoendes`
                            }
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                    <h3 className="text-gray-500 font-medium mb-1">Gemiddelde score</h3>
                    <div className="flex items-end">
                        <span className="text-5xl font-bold text-green-600">{averageTotalScore}</span>
                        <span className="text-gray-500 ml-2 mb-1">/ {maxTotalScore} punten</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${averageScorePercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                    <h3 className="text-gray-500 font-medium mb-1">Percentage behaald</h3>
                    <div className="flex items-end">
                        <span className="text-5xl font-bold text-purple-600">{averageScorePercentage}%</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                            Hoogste individuele score: {Math.max(...students.map(s => (s.totalScore / s.maxPossibleScore) * 100)).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRTTICards = () => {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">RTTI Categorieën</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {rttiStats.map(stat => (
                        <div key={stat.category} className="bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3 text-lg"
                                    style={{ backgroundColor: rttiColors[stat.category] }}
                                >
                                    {stat.category}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{stat.fullName}</h3>
                                    <p className="text-sm text-gray-600 font-medium">
                                        {stat.questionCount} {stat.questionCount === 1 ? 'vraag' : 'vragen'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">Gemiddelde score:</span>
                                    <span className="text-sm font-bold">{stat.averageScore} / {stat.maxPossibleScore}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="h-4 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stat.averagePercentage}%`,
                                            backgroundColor: rttiColors[stat.category]
                                        }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-1 text-right font-semibold">{stat.averagePercentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderStudentTable = () => {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Leerlingen</h2>

                <table className="min-w-full">
                    <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-100 rounded-md">
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => handleSort('name')}>Naam {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => handleSort('grade')}>Cijfer {sortConfig.key === 'grade' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                            {/* RTTI columns */}
                            {rttiCategories.map(cat => (
                                <th key={cat} className="py-2 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => handleSort(cat)}>
                                    {cat} {sortConfig.key === cat && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStudents.map(student => (
                            <tr
                                key={student.id}
                                className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${selectedStudent && selectedStudent.id === student.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                onClick={() => setSelectedStudent(student)}
                            >
                                <td className="py-3 px-4">{student.name}</td>
                                <td className="py-3 px-4">
                                    <span className={`font-bold py-1 px-2 rounded-md text-white ${parseFloat(student.grade) >= 5.5 ? 'bg-green-500' : 'bg-red-500'}`}>{student.grade}</span>
                                </td>
                                {/* RTTI progress bars */}
                                {rttiCategories.map(cat => {
                                    const percent = getStudentRttiCorrect(student, cat);
                                    return (
                                        <td key={cat} className="py-3 px-4 min-w-[90px]">
                                            <div className="flex flex-col gap-2">
                                                <div className="w-12  bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{ width: `${percent}%`, backgroundColor: 'gray' }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs font-medium text-gray-400">{percent}%</div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        );
    };

    const renderQuestionGrid = () => {
        return (

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {selectedStudent ? `Vragen - ${selectedStudent.name}` : 'Vragen - Klasgemiddelde'}
                    </h2>

                    {selectedStudent && (
                        <button
                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            onClick={() => setSelectedStudent(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Terug naar klasoverzicht
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {questions.map(question => {
                        const questionStats = selectedStudent
                            ? selectedStudent.questionScores.find(qs => qs.questionId === question.id)
                            : {
                                score: (students.reduce((sum, s) =>
                                    sum + s.questionScores.find(qs => qs.questionId === question.id).score, 0
                                ) / students.length).toFixed(1),
                                answer: question.mostGivenAnswer,
                                correct: false
                            };

                        const scorePercentage = parseFloat(((questionStats.score / question.maxScore) * 100).toFixed(0));

                        return (
                            <div
                                key={question.id}
                                className="bg-white rounded-lg border hover:shadow-md transition-shadow p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">{question.title}</h3>
                                    <span
                                        className="text-xs px-2 py-1 rounded-md text-white font-bold bg-gray-300"
                                    >
                                        {question.category}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">Score:</span>
                                        <span className="text-sm font-bold">
                                            {selectedStudent ? `${questionStats.score} / ${question.maxScore}` : `Gem: ${questionStats.score} / ${question.maxScore}`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${scorePercentage > 70 ? 'bg-green-500' : scorePercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${scorePercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Antwoord:</span>
                                        <span>{questionStats.answer}</span>
                                    </div>

                                    {selectedStudent && (
                                        <div className={`flex justify-between text-sm ${questionStats.correct ? 'text-green-600' : 'text-red-600'}`}>
                                            <span className="font-medium">Status:</span>
                                            <span>{questionStats.correct ? '✓ Correct' : '✗ Incorrect'}</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderMainContent = () => {

        return (
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2 xl:w-2/5">
                    {renderStudentTable()}
                </div>
                <div className="lg:w-1/2 xl:w-3/5">
                    {selectedStudent && <StudentAnswers student={selectedStudent} questions={questions} onBack={() => setSelectedStudent(null)} />}
                    {!selectedStudent && (
                        <div className="flex flex-col gap-6">
                            {renderSummaryCards()}
                            {renderRTTICards()}
                            {renderQuestionGrid()}

                        </div>)}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with CITO logo and tabs */}
            <HeaderBar currentTab={currentTab} setCurrentTab={setCurrentTab}></HeaderBar>

            {/* Main content */}
            <main className="w-full px-4 py-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">RTTI Rapportage</h1>
                        <p className="text-gray-500 text-sm mt-1">Overzicht van toetsresultaten</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">RTTI Toets</span>
                        <div className="bg-blue-100 rounded-md px-3 py-1">
                            <span className="text-blue-800 font-medium">Hoofdstuk 5</span>
                        </div>
                    </div>
                </div>

                {/* Summary cards */}
                {/* {!selectedStudent && renderSummaryCards()} */}

                {/* RTTI Category Cards */}
                {/* {!selectedStudent && renderRTTICards()} */}

                {/* Main content area - Student table and Question grid */}
                <div className="mt-8">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
};

export default RTTIDashboard;