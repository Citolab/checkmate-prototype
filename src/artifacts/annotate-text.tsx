import React, { useState } from 'react';
import { Popover, PopoverContent } from '../components/ui/popover'; // Assuming you have a Popover component

interface AnnotateTextProps {
  text: string;
  onAnnotation: (selection: string, action: 'correct' | 'wrong' | 'feedback', feedback?: string) => void;
}

const AnnotateText: React.FC<AnnotateTextProps> = ({ text, onAnnotation }) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleMouseUp = (_: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(selection.toString());
      setPopoverPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
    } else {
      setSelectedText(null);
      setPopoverPosition(null);
    }
  };

  const handleAction = (action: 'correct' | 'wrong' | 'feedback') => {
    if (selectedText) {
      onAnnotation(selectedText, action, action === 'feedback' ? feedback : undefined);
      setSelectedText(null);
      setPopoverPosition(null);
      setFeedback('');
    }
  };

  return (
    <div onMouseUp={handleMouseUp} style={{ position: 'relative' }}>
      {text.split(/(water)/gi).map((part, index) => (
        <span
          key={index}
          style={{
            backgroundColor: part.toLowerCase() === 'water' ? 'rgba(147, 112, 219, 0.3)' : 'transparent',
            borderRadius: '4px',
            padding: '0 2px',
          }}
        >
          {part}
        </span>
      ))}

      {popoverPosition && selectedText && (
        <Popover> {/* position={popoverPosition} onClose={() => setPopoverPosition(null)} */}
          <PopoverContent asChild>
          
          <div className="flex flex-col gap-2">
            <button onClick={() => handleAction('correct')} className="bg-green-500 text-white px-2 py-1 rounded">Mark as Correct</button>
            <button onClick={() => handleAction('wrong')} className="bg-red-500 text-white px-2 py-1 rounded">Mark as Wrong</button>
            <div>
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add feedback"
                className="border rounded px-2 py-1 w-full"
              />
              <button onClick={() => handleAction('feedback')} className="bg-blue-500 text-white px-2 py-1 rounded mt-2">Submit Feedback</button>
            </div>
          </div>
        </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default AnnotateText;
