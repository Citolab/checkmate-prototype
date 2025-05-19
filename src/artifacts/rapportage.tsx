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

// Generate random data for questions and students
const generateRandomData = () => {
    // Generate 20 questions with random RTTI categories and max scores
    const questions = Array.from({ length: 20 }, (_, i) => {
        const category = rttiCategories[Math.floor(Math.random() * rttiCategories.length)];
        const maxScore = Math.floor(Math.random() * 4) + 1; // Random score between 1-4
        return {
            id: i + 1,
            title: `Vraag ${i + 1}`,
            category,
            maxScore,
            mostGivenAnswer: `Antwoord ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
            correctPercentage: Math.floor(Math.random() * 50) + 50, // 50-100%
        };
    });

    // Dutch names for students
    const dutchNames = [
        'Sanne de Vries', 'Mohammed El Amrani', 'Daan Bakker', 'Fatima Yilmaz',
        'Lieke van Dijk', 'Jayden Jansen', 'Fleur de Boer', 'Bram Visser',
        'Aisha Özdemir', 'Thomas Mulder', 'Elin Zhang', 'Noah van der Meer',
        'Sofia Rodriguez', 'Sam de Groot', 'Noor van Leeuwen'
    ];

    // Generate 15 students with random scores for each question
    const students = dutchNames.map((name, i) => {
        let totalScore = 0;
        let maxPossibleScore = 0;

        const questionScores = questions.map(question => {
            // Random score between 0 and max score for the question
            const score = Math.floor(Math.random() * (question.maxScore + 1));
            totalScore += score;
            maxPossibleScore += question.maxScore;

            return {
                questionId: question.id,
                score,
                maxScore: question.maxScore,
                answer: `Antwoord ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
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


const RTTIDashboard = () => {
    const [data, setData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentTab, setCurrentTab] = useState('rapportage');

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

    const sortStudents = (a, b) => {
        return b.grade - a.grade;
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
                <div className="overflow-y-auto max-h-[80vh]">
                    <table className="min-w-full">
                        <thead className="sticky top-0 bg-white">
                            <tr className="bg-gray-100 rounded-md">
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Naam</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Cijfer</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.sort(sortStudents).map(student => (
                                <tr
                                    key={student.id}
                                    className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${selectedStudent && selectedStudent.id === student.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <td className="py-3 px-4">{student.name}</td>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold py-1 px-2 rounded-md text-white ${parseFloat(student.grade) >= 5.5 ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {student.grade}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className={`h-2 rounded-full ${parseFloat(student.grade) >= 5.5 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: `${(student.totalScore / student.maxPossibleScore) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs whitespace-nowrap">{student.totalScore}/{student.maxPossibleScore}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
                                        className="text-xs px-2 py-1 rounded-md text-white font-bold"
                                        style={{ backgroundColor: rttiColors[question.category] }}
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

                                    {!selectedStudent && (
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">% Correct:</span>
                                            <span>{question.correctPercentage}%</span>
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
                <div className="lg:w-1/4 xl:w-1/5">
                    {renderStudentTable()}
                </div>
                <div className="lg:w-3/4 xl:w-4/5">
                    {renderQuestionGrid()}
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
                {!selectedStudent && renderSummaryCards()}

                {/* RTTI Category Cards */}
                {!selectedStudent && renderRTTICards()}

                {/* Main content area - Student table and Question grid */}
                <div className="mt-8">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
};

export default RTTIDashboard;