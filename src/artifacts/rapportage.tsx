import { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronUp, ChevronDown, Flag, Download, List, LayoutGrid } from 'lucide-react';

// RTTI Categories
const rttiCategories = ['R', 'T1', 'T2', 'I'] as const;
const rttiDescriptions: Record<string, string> = {
    'R': 'Reproductie',
    'T1': 'Toepassing 1',
    'T2': 'Toepassing 2',
    'I': 'Inzicht'
};
const rttiShort: Record<string, string> = {
    'R': 'Repr',
    'T1': 'T1',
    'T2': 'T2',
    'I': 'Inz'
};

// Replace random question/answer generation with made-up biology questions and answers
const biologyQuestions = [
    {
        title: 'Wat is de functie van de bladgroenkorrels in een plantencel?',
        category: 'R',
        maxScore: 2,
        correctAnswer: 'Fotosynthese uitvoeren',
        rit: 0.82,

    },
    {
        title: 'Noem twee verschillen tussen een dierlijke en een plantaardige cel.',
        category: 'T1',
        maxScore: 3,
        correctAnswer: 'Plantaardige cellen hebben een celwand en bladgroenkorrels, dierlijke cellen niet',
        rit: 0.74,
    },
    {
        title: 'Leg uit waarom water belangrijk is voor het transport in planten.',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Water vervoert voedingsstoffen door de plant',
        rit: 0.65,
    },
    {
        title: 'Wat gebeurt er bij de verbranding in cellen?',
        category: 'T2',
        maxScore: 2,
        correctAnswer: 'Energie komt vrij uit glucose',
        rit: 0.79,
    },
    {
        title: 'Welke organen zijn betrokken bij de spijsvertering?',
        category: 'R',
        maxScore: 3,
        correctAnswer: 'Mond, slokdarm, maag, darmen',
        rit: 0.71,
    },
    {
        title: 'Beschrijf het proces van gaswisseling in de longen.',
        category: 'T1',
        maxScore: 3,
        correctAnswer: 'Zuurstof wordt opgenomen in het bloed, koolstofdioxide wordt afgegeven',
        rit: 0.77,
    },
    {
        title: 'Waarom is biodiversiteit belangrijk voor een ecosysteem?',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Het zorgt voor stabiliteit en veerkracht',
        rit: 0.69,
    },
    {
        title: 'Geef een voorbeeld van een voedselketen.',
        category: 'T2',
        maxScore: 2,
        correctAnswer: 'Gras → konijn → vos',
        rit: 0.73,
    },
    {
        title: 'Wat is de rol van enzymen bij de spijsvertering?',
        category: 'R',
        maxScore: 2,
        correctAnswer: 'Ze versnellen de afbraak van voedingsstoffen',
        rit: 0.81,
    },
    {
        title: 'Leg uit wat adaptatie betekent bij dieren.',
        category: 'I',
        maxScore: 2,
        correctAnswer: 'Aanpassing aan de omgeving',
        rit: 0.68,
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

    // Dutch names for students (split into first/last)
    const dutchNames = [
        { firstName: 'Mohamed', lastName: 'El Marani' },
        { firstName: 'Aisha', lastName: 'Özdemir' },
        { firstName: 'Noah', lastName: 'Van der Meer' },
        { firstName: 'Noor', lastName: 'van Leeuwen' },
        { firstName: 'Daan', lastName: 'Bakker' },
        { firstName: 'Jayden', lastName: 'Jansen' },
        { firstName: 'Sofia', lastName: 'Roderiquez' },
        { firstName: 'Sam', lastName: 'de Groot' },
        { firstName: 'Sanne', lastName: 'de Vries' },
        { firstName: 'Thomas', lastName: 'Mulder' },
        { firstName: 'Fatima', lastName: 'Yilmaz' },
        { firstName: 'Mulder', lastName: 'Visser' },
        { firstName: 'Bram', lastName: 'de Boer' },
        { firstName: 'Fleur', lastName: 'Stoep' },
        { firstName: 'Friso', lastName: 'Mulder' },
    ];

    // Generate 15 students with made-up answers
    const students = dutchNames.map((nameObj, i) => {
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
            firstName: nameObj.firstName,
            lastName: nameObj.lastName,
            name: `${nameObj.firstName} ${nameObj.lastName}`,
            questionScores,
            totalScore,
            maxPossibleScore,
            grade,
        };
    });
    return { questions, students };
};

// New: StudentAnswers component
const StudentAnswers = ({ student, questions, onBack, compactView, setCompactView }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Antwoorden van {student.name}</CardTitle>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompactView(prev => !prev)}
                    className="gap-1"
                >
                    {compactView ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    {compactView ? 'Uitgebreid' : 'Compact'}
                </Button>
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Terug
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {compactView ? (
                // Compact view: just answers and scores
                <div className="space-y-2">
                    {student.questionScores.map((qs, index) => {
                        const isCorrect = qs.score === qs.maxScore;
                        return (
                            <div key={qs.questionId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                                    <span className="text-sm">{qs.answer}</span>
                                </div>
                                <Badge 
                                    variant="secondary" 
                                    className={`font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                                >
                                    {qs.score}/{qs.maxScore}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Full view: thumbnail, question, rubric, RTTI
                <div className="space-y-3">
                    {student.questionScores.map((qs, index) => {
                        const question = questions.find(q => q.id === qs.questionId);
                        const isCorrect = qs.score === qs.maxScore;
                        return (
                            <div key={qs.questionId} className="flex gap-4 border rounded-lg overflow-hidden">
                                {/* Question thumbnail placeholder with RTTI badge overlay */}
                                <div className="flex-shrink-0 w-40 aspect-video bg-muted flex items-center justify-center relative">
                                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs font-normal">
                                        {rttiShort[question.category]}
                                    </Badge>
                                    <span className="text-3xl font-bold text-muted-foreground">{index + 1}</span>
                                </div>
                                <div className="flex-1 p-3">
                                    <h4 className="font-medium text-sm mb-2">{question.title}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Antwoord:</span>
                                            <span className={isCorrect ? 'text-green-600' : 'text-foreground'}>
                                                {qs.answer}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Rubric:</span>
                                            <span className="text-green-600">{question.correctAnswer}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 p-3 flex items-start">
                                    <Badge 
                                        variant="secondary" 
                                        className={`font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                                    >
                                        {qs.score}/{qs.maxScore}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </CardContent>
    </Card>
);

const RTTIDashboard = () => {
    const [data, setData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentTab, setCurrentTab] = useState('rapportage');
    const [sortConfig, setSortConfig] = useState({ key: 'grade', direction: 'desc' });
    const [questionSortKey, setQuestionSortKey] = useState('rit');
    const [questionSortDir, setQuestionSortDir] = useState<'asc' | 'desc'>('desc');
    const [compactView, setCompactView] = useState(false);

    useEffect(() => {
        const generatedData = generateRandomData();
        setData(generatedData);
    }, []);

    if (!data) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-muted-foreground">Laden...</div>
        </div>
    );

    const { questions, students } = data;

    // Calculate averages
    const averageGrade = (
        students.reduce((sum, student) => sum + parseFloat(student.grade), 0) / students.length
    ).toFixed(1);

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
        } else if (key === 'firstName' || key === 'lastName') {
            aValue = a[key].toLowerCase();
            bValue = b[key].toLowerCase();
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

    const renderStudentTable = () => {
        const SortIcon = ({ columnKey }: { columnKey: string }) => {
            if (sortConfig.key !== columnKey) return null;
            return sortConfig.direction === 'asc' ? 
                <ChevronUp className="h-3 w-3 inline ml-1" /> : 
                <ChevronDown className="h-3 w-3 inline ml-1" />;
        };

        // Calculate class averages for RTTI categories
        const classAverages = rttiCategories.reduce((acc, cat) => {
            const total = students.reduce((sum, student) => sum + getStudentRttiCorrect(student, cat), 0);
            acc[cat] = Math.round(total / students.length);
            return acc;
        }, {} as Record<string, number>);

        return (
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Leerlingen</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-xs">
                                <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-2 w-16" 
                                    onClick={() => handleSort('grade')}
                                >
                                    Cijfer <SortIcon columnKey="grade" />
                                </TableHead>
                                <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-3" 
                                    onClick={() => handleSort('firstName')}
                                >
                                    Voornaam <SortIcon columnKey="firstName" />
                                </TableHead>
                                <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-3" 
                                    onClick={() => handleSort('lastName')}
                                >
                                    Achternaam <SortIcon columnKey="lastName" />
                                </TableHead>
                                <TableHead className="w-full" />
                                {rttiCategories.map(cat => (
                                    <TableHead 
                                        key={cat} 
                                        className="cursor-pointer hover:bg-muted/50 py-2 px-1 whitespace-nowrap" 
                                        onClick={() => handleSort(cat)}
                                    >
                                        {rttiDescriptions[cat]} <SortIcon columnKey={cat} />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Klasgemiddelde row */}
                            <TableRow className="bg-muted/30 font-medium">
                                <TableCell className="py-2 px-2">
                                    <span className="text-primary font-bold">{averageGrade}</span>
                                </TableCell>
                                <TableCell className="py-2 px-3" colSpan={2}>Klasgemiddelde</TableCell>
                                <TableCell />
                                {rttiCategories.map(cat => (
                                    <TableCell key={cat} className="py-2 px-1">
                                        <Progress value={classAverages[cat]} className="h-2 w-12" />
                                    </TableCell>
                                ))}
                            </TableRow>
                            {sortedStudents.map(student => (
                                <TableRow
                                    key={student.id}
                                    className={`cursor-pointer ${selectedStudent && selectedStudent.id === student.id ? 'bg-primary/10' : ''}`}
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setTimeout(() => {
                                            document.getElementById('student-answers')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                >
                                    <TableCell className="py-2 px-2">
                                        <Badge 
                                            variant="secondary" 
                                            className={`font-bold px-2 py-0.5 ${
                                                parseFloat(student.grade) >= 6 
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                                                    : parseFloat(student.grade) >= 5 
                                                        ? 'bg-orange-100 text-orange-600 hover:bg-orange-100' 
                                                        : 'bg-red-100 text-red-600 hover:bg-red-100'
                                            }`}
                                        >
                                            {student.grade}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">{student.firstName}</TableCell>
                                    <TableCell className="py-2 px-3">{student.lastName}</TableCell>
                                    <TableCell />
                                    {rttiCategories.map(cat => {
                                        const percent = getStudentRttiCorrect(student, cat);
                                        return (
                                            <TableCell key={cat} className="py-2 px-1">
                                                <Progress value={percent} className="h-2 w-12" />
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    const renderQuestionList = () => {
        // Calculate average scores for each question
        const questionsWithStats = questions.map(question => {
            const avgScore = students.reduce((sum, s) =>
                sum + s.questionScores.find(qs => qs.questionId === question.id).score, 0
            ) / students.length;
            const pValue = avgScore / question.maxScore;
            return {
                ...question,
                avgScore,
                pValue
            };
        });

        // Sort questions based on selected sort option
        const sortedQuestions = [...questionsWithStats].sort((a, b) => {
            let aVal, bVal;
            switch (questionSortKey) {
                case 'order':
                    aVal = a.id;
                    bVal = b.id;
                    break;
                case 'rit':
                    aVal = a.rit;
                    bVal = b.rit;
                    break;
                case 'pvalue':
                    aVal = a.pValue;
                    bVal = b.pValue;
                    break;
                case 'score':
                    aVal = a.avgScore;
                    bVal = b.avgScore;
                    break;
                default:
                    return 0;
            }
            return questionSortDir === 'desc' ? bVal - aVal : aVal - bVal;
        });

        const handleSortClick = (key: string) => {
            if (key === 'order') {
                // Order always sorts ascending (1 to 10)
                setQuestionSortKey('order');
                setQuestionSortDir('asc');
            } else if (questionSortKey === key) {
                setQuestionSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
            } else {
                setQuestionSortKey(key);
                setQuestionSortDir('desc');
            }
        };

        // Descriptive labels for sort buttons based on direction
        const getSortLabel = (key: string) => {
            const isActive = questionSortKey === key;
            const dir = isActive ? questionSortDir : 'desc';
            
            const labels = {
                order: {
                    desc: 'Volgorde in toets',
                    asc: 'Volgorde in toets'
                },
                rit: {
                    desc: 'Meest onderscheidend',
                    asc: 'Minst onderscheidend'
                },
                pvalue: {
                    desc: 'Makkelijkste vragen',
                    asc: 'Moeilijkste vragen'
                },
                score: {
                    desc: 'Best gescoord',
                    asc: 'Slechtst gescoord'
                }
            };
            
            return labels[key]?.[dir] || key;
        };

        const SortButton = ({ sortKey }: { sortKey: string }) => (
            <Button
                variant={questionSortKey === sortKey ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortClick(sortKey)}
                className="gap-1"
            >
                {getSortLabel(sortKey)}
                {questionSortKey === sortKey && sortKey !== 'order' && (
                    questionSortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                )}
            </Button>
        );

        return (
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Vragen</CardTitle>
                        <div className="flex items-center gap-2">
                            <SortButton sortKey="order" />
                            <SortButton sortKey="rit" />
                            <SortButton sortKey="pvalue" />
                            <SortButton sortKey="score" />
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCompactView(prev => !prev)}
                                className="gap-1"
                            >
                                {compactView ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                                {compactView ? 'Uitgebreid' : 'Compact'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {compactView ? (
                        // Compact view: minimal list
                        <div className="space-y-2">
                            {sortedQuestions.map((question) => {
                                const scorePercentage = Math.round(question.pValue * 100);
                                return (
                                    <div key={question.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-muted-foreground w-6">{question.id}.</span>
                                            <Badge variant="outline" className="text-xs font-normal">{rttiShort[question.category]}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span>RIT: <span className="font-medium">{question.rit}</span></span>
                                            <span>P: <span className="font-medium">{question.pValue.toFixed(2)}</span></span>
                                            <Badge 
                                                variant="secondary" 
                                                className={`font-bold ${scorePercentage > 70 ? 'bg-green-100 text-green-700' : scorePercentage > 40 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}
                                            >
                                                {question.avgScore.toFixed(1)}/{question.maxScore}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Full view: thumbnail, question, RTTI
                        <div className="space-y-3">
                            {sortedQuestions.map((question) => {
                                const scorePercentage = Math.round(question.pValue * 100);

                                return (
                                    <div key={question.id} className="flex gap-4 border rounded-lg overflow-hidden">
                                        {/* Question thumbnail placeholder with RTTI badge overlay */}
                                        <div className="flex-shrink-0 w-40 aspect-video bg-muted flex items-center justify-center relative">
                                            <Badge variant="secondary" className="absolute top-2 left-2 text-xs font-normal">
                                                {rttiShort[question.category]}
                                            </Badge>
                                            <span className="text-3xl font-bold text-muted-foreground">{question.id}</span>
                                        </div>
                                        <div className="flex-1 p-3">
                                            <h4 className="font-medium text-sm mb-2">{question.title}</h4>
                                            <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                                                <span>RIT: <span className="font-medium text-foreground">{question.rit}</span></span>
                                                <span>P-waarde: <span className="font-medium text-foreground">{question.pValue.toFixed(2)}</span></span>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-muted-foreground">Gem. score</span>
                                                    <span className="text-xs font-medium">
                                                        {question.avgScore.toFixed(1)}/{question.maxScore}
                                                    </span>
                                                </div>
                                                <Progress 
                                                    value={scorePercentage} 
                                                    className={`h-2 ${scorePercentage > 70 ? '[&>div]:bg-green-500' : scorePercentage > 40 ? '[&>div]:bg-primary' : '[&>div]:bg-destructive'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderMainContent = () => {
        return (
            <div className="flex flex-col gap-6">
                {renderStudentTable()}
                <div id="student-answers">
                    {selectedStudent ? (
                        <StudentAnswers 
                            student={selectedStudent} 
                            questions={questions} 
                            onBack={() => setSelectedStudent(null)} 
                            compactView={compactView}
                            setCompactView={setCompactView}
                        />
                    ) : (
                        renderQuestionList()
                    )}
                </div>
            </div>
        );
    };

    // Calculate percentage of failing students
    const failingPercentage = Math.round((students.filter(s => parseFloat(s.grade) < 5.5).length / students.length) * 100);

    return (
        <div className="min-h-screen bg-background">
            {/* Header with CITO logo and tabs */}
            <HeaderBar currentTab={currentTab} setCurrentTab={setCurrentTab}></HeaderBar>

            {/* Main content */}
            <main className="max-w-5xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-xl font-bold">RTTI Rapportage</h1>
                            <p className="text-muted-foreground text-sm">Overzicht van toetsresultaten</p>
                        </div>
                        <div className="flex items-center gap-2 text-destructive">
                            <Flag className="h-4 w-4 fill-destructive" />
                            <span className="text-sm">Onvoldoendes</span>
                            <span className="font-bold">{failingPercentage}%</span>
                        </div>
                    </div>

                    <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Exporteer resultaten
                    </Button>
                </div>

                {/* Main content area - Student table and Question list */}
                {renderMainContent()}
            </main>
        </div>
    );
};

export default RTTIDashboard;