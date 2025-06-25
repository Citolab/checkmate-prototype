import { useState, useRef, useCallback } from 'react';
import { MessageCircle, Eye, EyeOff, Plus, X } from 'lucide-react';

const TextAnnotationComponent = ({ 
    initialText = "This is a sample text that you can annotate. Select any portion of this text to add comments and remarks. Click and drag to select text, then add your annotations. This component mimics Word's review mode functionality.",
    annotations: initialAnnotations = []
}) => {
    const [text] = useState(initialText);
    const [annotations, setAnnotations] = useState(initialAnnotations);
    const [showComments, setShowComments] = useState(false);
    const [selectedRange, setSelectedRange] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const textContainerRef = useRef(null);
    const newCommentFormRef = useRef(null);

    // Generate unique ID for annotations
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Show all comments
    const showAllComments = () => {
        setAnnotations(annotations.map(ann => ({ ...ann, visible: true })));
        setShowComments(true);
    };

    // Hide all comments
    const hideAllComments = () => {
        setAnnotations(annotations.map(ann => ({ ...ann, visible: false })));
        setShowComments(false);
    };

    // Handle text selection
    const handleTextSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const containerElement = textContainerRef.current;

            if (containerElement && containerElement.contains(range.commonAncestorContainer)) {
                // Calculate start and end positions relative to the text content
                const beforeRange = range.cloneRange();
                beforeRange.selectNodeContents(containerElement);
                beforeRange.setEnd(range.startContainer, range.startOffset);
                const start = beforeRange.toString().length;
                const end = start + range.toString().length;

                setSelectedRange({
                    start,
                    end,
                    text: range.toString(),
                    rect: range.getBoundingClientRect(),
                    containerRect: containerElement.getBoundingClientRect()
                });
                setShowNewCommentForm(true);
            }
        }
    }, []);

    // Add new annotation
    const addAnnotation = () => {
        if (selectedRange && newCommentText.trim()) {
            const newAnnotation = {
                id: generateId(),
                start: selectedRange.start,
                end: selectedRange.end,
                text: selectedRange.text,
                comment: newCommentText.trim(),
                visible: true
            };

            setAnnotations([...annotations, newAnnotation]);
            setNewCommentText('');
            setSelectedRange(null);
            setShowNewCommentForm(false);
            window.getSelection().removeAllRanges();
        }
    };

    // Cancel new annotation
    const cancelAnnotation = () => {
        setNewCommentText('');
        setSelectedRange(null);
        setShowNewCommentForm(false);
        window.getSelection().removeAllRanges();
    };

    // Delete annotation
    const deleteAnnotation = (id) => {
        setAnnotations(annotations.filter(ann => ann.id !== id));
    };

    // Render annotated text
    const renderAnnotatedText = () => {
        const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);
        let lastIndex = 0;
        const elements = [];

        sortedAnnotations.forEach((annotation, index) => {
            // Add text before annotation
            if (annotation.start > lastIndex) {
                elements.push(
                    <span key={`text-${index}`}>
                        {text.slice(lastIndex, annotation.start)}
                    </span>
                );
            }

            // Add annotated text
            elements.push(
                <span
                    key={annotation.id}
                    className="relative bg-yellow-200 border-b-2 border-yellow-400 cursor-pointer hover:bg-yellow-300 transition-colors"
                    onClick={() => {
                        if (showComments) {
                            setAnnotations(annotations.map(ann => ann.id === annotation.id ? { ...ann, visible: false } : ann));
                        }
                    }}
                    title={annotation.comment}
                >
                    {annotation.text}
                    {showComments && annotation.visible && (
                        <span
                            className="absolute left-full top-0 ml-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg min-w-64 max-w-80 z-10"
                            style={{
                                transform: 'translateY(-25%)',
                            }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <MessageCircle className="w-4 h-4 text-blue-500 mt-1" />
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAnnotations(annotations.map(ann => ann.id === annotation.id ? { ...ann, visible: false } : ann));
                                        }}
                                        className="text-gray-400 hover:text-gray-700 transition-colors ml-2"
                                        title="Close"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteAnnotation(annotation.id);
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">{annotation.comment}</p>
                        </span>
                    )}
                </span>
            );

            lastIndex = annotation.end;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            elements.push(
                <span key="text-end">
                    {text.slice(lastIndex)}
                </span>
            );
        }

        // Only show the show/hide comments button if there are annotations
        if (annotations.length > 0) {
            elements.push(
                <button
                    key="show-comments-btn"
                    onClick={() => showComments ? hideAllComments() : showAllComments()}
                    className={`ml-2 w-8 h-8 rounded-full flex items-center gap-2 p-2 transition-colors float-end ${showComments
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {showComments ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                    {/* {showComments ? 'Hide Comments' : 'Show Comments'} */}
                </button>
            );
        }

        return elements;
    };

    return (
        <>
            <div>
                <div className="relative">
                    <div
                        ref={textContainerRef}
                        onMouseUp={handleTextSelection}
                        style={{ lineHeight: '1.8' }}
                    >
                        {renderAnnotatedText()}
                    </div>

                    {/* New comment form */}
                    {showNewCommentForm && selectedRange && (
                        <div
                            ref={newCommentFormRef}
                            className="absolute z-20 p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
                            style={{
                                left: Math.min(
                                    selectedRange.rect.left - selectedRange.containerRect.left + selectedRange.rect.width / 2 - 150,
                                    textContainerRef.current?.offsetWidth - 300 || 0
                                ),
                                top: selectedRange.rect.bottom - selectedRange.containerRect.top + 10,
                                width: '300px'
                            }}
                        >
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Plus className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Add Comment</span>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded text-sm text-gray-600 mb-3">
                                    "{selectedRange.text}"
                                </div>
                                <textarea
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="Enter your comment..."
                                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={addAnnotation}
                                    disabled={!newCommentText.trim()}
                                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add Comment
                                </button>
                                <button
                                    onClick={cancelAnnotation}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TextAnnotationComponent;