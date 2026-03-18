import { useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
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

const RTTIDashboard = () => {
    const [data, setData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentTab, setCurrentTab] = useState('rapportage');
    const [sortConfig, setSortConfig] = useState({ key: 'grade', direction: 'desc' });
    const [questionSortKey, setQuestionSortKey] = useState('rit');
    const [questionSortDir, setQuestionSortDir] = useState<'asc' | 'desc'>('desc');
    const [compactView, setCompactView] = useState(false);
    const [tableRef] = useAutoAnimate();

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
            if (sortConfig.key !== columnKey) {
                return <span className="inline-block w-3 h-3 ml-1" />;
            }
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

        // Count questions per RTTI category
        const categoryQuestionCounts = rttiCategories.reduce((acc, cat) => {
            acc[cat] = biologyQuestions.filter(q => q.category === cat).length;
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
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-2 w-16 whitespace-nowrap" 
                                    onClick={() => handleSort('grade')}
                                >
                                    Cijfer <SortIcon columnKey="grade" />
                                </TableHead>
                                <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-3 whitespace-nowrap" 
                                    onClick={() => handleSort('firstName')}
                                >
                                    Voornaam <SortIcon columnKey="firstName" />
                                </TableHead>
                                <TableHead 
                                    className="cursor-pointer hover:bg-muted/50 py-2 px-3 whitespace-nowrap" 
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
                                        <div className="flex flex-col">
                                            <span>{rttiDescriptions[cat]} <SortIcon columnKey={cat} /></span>
                                            <span className="text-xs font-normal text-muted-foreground">{categoryQuestionCounts[cat]} vragen</span>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody ref={tableRef}>
                            {/* Klasgemiddelde row */}
                            <TableRow className="bg-muted/30 font-medium">
                                <TableCell className="py-2 px-2">
                                    <Badge variant="outline" className="font-bold px-2 py-0.5">
                                        {averageGrade}
                                    </Badge>
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
                                    <TableCell className={`py-2 px-3 ${parseFloat(student.grade) >= 5.5 ? 'font-medium' : ''}`}>{student.firstName}</TableCell>
                                    <TableCell className={`py-2 px-3 ${parseFloat(student.grade) >= 5.5 ? 'font-medium' : ''}`}>{student.lastName}</TableCell>
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
        // Calculate stats for each question, including student-specific score if selected
        const questionsWithStats = questions.map(question => {
            const avgScore = students.reduce((sum, s) =>
                sum + s.questionScores.find(qs => qs.questionId === question.id).score, 0
            ) / students.length;
            const pValue = avgScore / question.maxScore;
            
            // If student is selected, get their specific score
            let studentScore = null;
            let studentAnswer = null;
            if (selectedStudent) {
                const qs = selectedStudent.questionScores.find(qs => qs.questionId === question.id);
                studentScore = qs?.score ?? 0;
                studentAnswer = qs?.answer ?? '';
            }
            
            return {
                ...question,
                avgScore,
                pValue,
                studentScore,
                studentAnswer
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
                    // Use percentage score for proper ordering
                    if (selectedStudent) {
                        aVal = a.studentScore / a.maxScore;
                        bVal = b.studentScore / b.maxScore;
                    } else {
                        aVal = a.avgScore / a.maxScore;
                        bVal = b.avgScore / b.maxScore;
                    }
                    break;
                default:
                    return 0;
            }
            return questionSortDir === 'desc' ? bVal - aVal : aVal - bVal;
        });

        const handleSortClick = (key: string) => {
            // Fixed directions for each sort type
            setQuestionSortKey(key);
            switch (key) {
                case 'order':
                    setQuestionSortDir('asc'); // 1 to 10
                    break;
                case 'rit':
                    setQuestionSortDir('desc'); // Highest RIT first (meest onderscheidend)
                    break;
                case 'pvalue':
                    setQuestionSortDir('desc'); // Highest P-value first (makkelijkste vragen)
                    break;
                case 'score':
                    setQuestionSortDir('asc'); // Lowest score first (slecht gescoord)
                    break;
            }
        };

        // Fixed labels for sort buttons
        const getSortLabel = (key: string) => {
            const labels = {
                order: 'Volgorde in toets',
                rit: 'Meest onderscheidend',
                pvalue: 'Makkelijkste vragen',
                score: 'Slecht gescoord'
            };
            
            return labels[key] || key;
        };

        const SortButton = ({ sortKey }: { sortKey: string }) => (
            <Button
                variant={questionSortKey === sortKey ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortClick(sortKey)}
            >
                {getSortLabel(sortKey)}
            </Button>
        );

        return (
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-3">
                        {selectedStudent && (
                            <Button variant="outline" size="sm" onClick={() => {
                                setSelectedStudent(null);
                                if (questionSortKey === 'score') {
                                    setQuestionSortKey('rit');
                                    setQuestionSortDir('desc');
                                }
                            }}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <CardTitle className="text-lg">
                            {selectedStudent ? `Antwoorden van ${selectedStudent.name}` : 'Toets'}
                        </CardTitle>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SortButton sortKey="order" />
                            <SortButton sortKey="rit" />
                            <SortButton sortKey="pvalue" />
                            {selectedStudent && <SortButton sortKey="score" />}
                        </div>
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {compactView ? (
                        // Compact view: horizontal 3-column layout (thumbnail, title, data)
                        <div className="space-y-2">
                            {sortedQuestions.map((question) => {
                                const isStudentView = selectedStudent !== null;
                                const score = isStudentView ? question.studentScore : question.avgScore;
                                const scorePercentage = Math.round((score / question.maxScore) * 100);
                                const isCorrect = isStudentView && question.studentScore === question.maxScore;
                                
                                return (
                                    <div key={question.id} className="flex items-center gap-3 border rounded-lg overflow-hidden p-2">
                                        {/* Column 1: Question thumbnail with skeleton preview */}
                                        <div className="flex-shrink-0 w-20 h-16 bg-muted rounded p-1.5 relative">
                                            <Badge variant="secondary" className="absolute top-1 left-1 text-[9px] font-normal px-1 py-0">
                                                {rttiShort[question.category]}
                                            </Badge>
                                            <div className="absolute top-1 right-1 text-[10px] font-bold text-muted-foreground">{question.id}</div>
                                            {/* Skeleton representation of question */}
                                            <div className="mt-4 space-y-0.5">
                                                <div className="h-1 bg-muted-foreground/20 rounded w-full" />
                                                <div className="h-1 bg-muted-foreground/20 rounded w-4/5" />
                                                <div className="h-1 bg-muted-foreground/15 rounded w-full" />
                                                <div className="h-1 bg-muted-foreground/15 rounded w-3/5" />
                                            </div>
                                        </div>
                                        
                                        {/* Column 2: Title */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{question.title}</h4>
                                            {isStudentView && (
                                                <div className="flex items-center gap-3 text-xs mt-1">
                                                    <span className="text-muted-foreground">Rubric: <span className="font-medium text-foreground">{question.correctAnswer}</span></span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Column 3: Data/Stats */}
                                        <div className="flex-shrink-0 flex items-center gap-4">
                                            {isStudentView ? (
                                                <>
                                                    <span className="text-sm">
                                                        {question.studentAnswer}
                                                    </span>
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`font-bold ${isCorrect ? 'bg-green-100 text-green-700' : score > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'}`}
                                                    >
                                                        {score}/{question.maxScore}
                                                    </Badge>
                                                </>
                                            ) : (
                                                <>
                                                    {questionSortKey === 'order' ? (
                                                        // Show all values as plain text when sorting by order
                                                        <div className="flex gap-3 text-xs text-muted-foreground">
                                                            <span>RIT: <span className="font-medium text-foreground">{question.rit}</span></span>
                                                            <span>P: <span className="font-medium text-foreground">{question.pValue.toFixed(2)}</span></span>
                                                            <span>Score: <span className="font-medium text-foreground">{question.avgScore.toFixed(1)}/{question.maxScore}</span></span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex gap-3 text-xs text-muted-foreground">
                                                                {questionSortKey !== 'rit' && (
                                                                    <span>RIT: <span className="font-medium text-foreground">{question.rit}</span></span>
                                                                )}
                                                                {questionSortKey !== 'pvalue' && (
                                                                    <span>P: <span className="font-medium text-foreground">{question.pValue.toFixed(2)}</span></span>
                                                                )}
                                                            </div>
                                                            {questionSortKey === 'rit' && (
                                                                <div className="flex items-center gap-2">
                                                                    <Progress value={question.rit * 100} className="h-2 w-20" />
                                                                    <span className="text-xs font-medium w-8">{question.rit}</span>
                                                                </div>
                                                            )}
                                                            {questionSortKey === 'pvalue' && (
                                                                <div className="flex items-center gap-2">
                                                                    <Progress 
                                                                        value={question.pValue * 100} 
                                                                        className={`h-2 w-20 ${question.pValue > 0.7 ? '[&>div]:bg-green-500' : question.pValue > 0.4 ? '[&>div]:bg-primary' : '[&>div]:bg-destructive'}`}
                                                                    />
                                                                    <span className="text-xs font-medium w-8">{question.pValue.toFixed(2)}</span>
                                                                </div>
                                                            )}
                                                            {questionSortKey === 'score' && (
                                                                <div className="flex items-center gap-2">
                                                                    <Progress 
                                                                        value={scorePercentage} 
                                                                        className={`h-2 w-20 ${scorePercentage > 70 ? '[&>div]:bg-green-500' : scorePercentage > 40 ? '[&>div]:bg-primary' : '[&>div]:bg-destructive'}`}
                                                                    />
                                                                    <span className="text-xs font-medium w-10">{scorePercentage}%</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Expanded view: 2-column grid with large thumbnails
                        <div className="grid grid-cols-2 gap-4">
                            {sortedQuestions.map((question) => {
                                const isStudentView = selectedStudent !== null;
                                const score = isStudentView ? question.studentScore : question.avgScore;
                                const scorePercentage = Math.round((score / question.maxScore) * 100);
                                const isCorrect = isStudentView && question.studentScore === question.maxScore;

                                return (
                                    <div key={question.id} className="border rounded-lg overflow-hidden">
                                        {/* Full-width thumbnail with skeleton */}
                                        <div className="w-full aspect-[2/1] bg-muted p-3 relative">
                                            <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] font-normal px-1.5 py-0.5">
                                                {rttiShort[question.category]}
                                            </Badge>
                                            <div className="absolute top-2 right-2 text-sm font-bold text-muted-foreground">{question.id}</div>
                                            {/* Skeleton representation of question */}
                                            <div className="mt-6 space-y-1.5">
                                                <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                                                <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
                                                <div className="h-2 bg-muted-foreground/15 rounded w-full" />
                                                <div className="h-2 bg-muted-foreground/15 rounded w-3/5" />
                                                <div className="mt-3 h-1.5 bg-muted-foreground/10 rounded w-2/3" />
                                                <div className="h-1.5 bg-muted-foreground/10 rounded w-1/2" />
                                            </div>
                                        </div>
                                        
                                        {/* Title */}
                                        <div className="p-3 border-b">
                                            <h4 className="font-medium text-sm">{question.title}</h4>
                                            {isStudentView && (
                                                <div className="flex items-center gap-3 text-xs mt-1">
                                                    <span className="text-muted-foreground">Rubric: <span className="font-medium text-foreground">{question.correctAnswer}</span></span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Stats row */}
                                        <div className="p-3 flex items-center justify-between text-xs">
                                            {isStudentView ? (
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-sm">
                                                        {question.studentAnswer}
                                                    </span>
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`font-bold ${isCorrect ? 'bg-green-100 text-green-700' : score > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'}`}
                                                    >
                                                        {score}/{question.maxScore}
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-muted-foreground">RIT: <span className="font-medium text-foreground">{question.rit}</span></span>
                                                    <span className="text-muted-foreground">P: <span className="font-medium text-foreground">{question.pValue.toFixed(2)}</span></span>
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`font-bold ${scorePercentage > 70 ? 'bg-green-100 text-green-700' : scorePercentage > 40 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}
                                                    >
                                                        {question.avgScore.toFixed(1)}/{question.maxScore}
                                                    </Badge>
                                                </>
                                            )}
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
                    {renderQuestionList()}
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
                        <h1 className="text-xl font-bold">Rapportage</h1>
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