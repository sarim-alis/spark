import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function QuizEditor({ quiz, onQuizChange }) {
  const handleQuizEnabled = (enabled) => {
    if (enabled) {
      onQuizChange({
        title: 'Lesson Quiz',
        passing_score: 70,
        questions: [{ question_text: 'New Question', options: ['Option 1', 'Option 2'], correct_option_index: 0 }]
      });
    } else {
      onQuizChange(null);
    }
  };

  if (!quiz) {
    return (
      <div className="text-center p-4 border-2 border-dashed rounded-lg">
        <p className="text-slate-600 mb-2">No quiz for this lesson.</p>
        <Button onClick={() => handleQuizEnabled(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add a Quiz
        </Button>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    onQuizChange({ ...quiz, [field]: value });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex][field] = value;
    onQuizChange({ ...quiz, questions: newQuestions });
  };
  
  const addQuestion = () => {
    const newQuestions = [...quiz.questions, { question_text: 'New Question', options: ['Option 1', 'Option 2'], correct_option_index: 0 }];
    onQuizChange({ ...quiz, questions: newQuestions });
  };
  
  const removeQuestion = (qIndex) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== qIndex);
    onQuizChange({ ...quiz, questions: newQuestions });
  };
  
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    onQuizChange({ ...quiz, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push(`Option ${newQuestions[qIndex].options.length + 1}`);
    onQuizChange({ ...quiz, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    // Adjust correct answer if it was the removed option
    if (newQuestions[qIndex].correct_option_index === oIndex) {
      newQuestions[qIndex].correct_option_index = 0;
    } else if (newQuestions[qIndex].correct_option_index > oIndex) {
      newQuestions[qIndex].correct_option_index -= 1;
    }
    onQuizChange({ ...quiz, questions: newQuestions });
  };

  return (
    <Card className="bg-slate-100 border-amber-300 border-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Quiz Editor</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => handleQuizEnabled(false)}><X className="w-4 h-4 text-red-500" /></Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Quiz Title</Label>
            <Input value={quiz.title} onChange={e => handleFieldChange('title', e.target.value)} />
          </div>
          <div>
            <Label>Passing Score (%)</Label>
            <Input type="number" value={quiz.passing_score} onChange={e => handleFieldChange('passing_score', parseInt(e.target.value))} />
          </div>
        </div>
        <div className="space-y-4">
          {quiz.questions.map((question, qIndex) => (
            <Card key={qIndex} className="bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Question {qIndex + 1}</Label>
                <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
              <Input
                placeholder="Question text"
                value={question.question_text}
                onChange={e => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                className="mb-4"
              />
              <RadioGroup
                value={String(question.correct_option_index)}
                onValueChange={value => handleQuestionChange(qIndex, 'correct_option_index', parseInt(value))}
                className="space-y-2"
              >
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <RadioGroupItem value={String(oIndex)} id={`q${qIndex}o${oIndex}`} />
                    <Input
                      value={option}
                      onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeOption(qIndex, oIndex)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
              </RadioGroup>
              <Button variant="outline" size="sm" onClick={() => addOption(qIndex)} className="mt-2">
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </Card>
          ))}
        </div>
        <Button onClick={addQuestion}>
          <Plus className="w-4 h-4 mr-2" /> Add Question
        </Button>
      </CardContent>
    </Card>
  );
}