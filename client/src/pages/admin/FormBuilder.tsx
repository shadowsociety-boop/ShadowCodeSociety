import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService, EventFormField } from '../../services/event.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';

export const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fields, setFields] = useState<EventFormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) return;
      try {
        const data = await eventService.getEventForm(id);
        const formFields = data.form?.fields || [];
        if (formFields.length > 0) {
          setFields(formFields);
        } else {
          // Default baseline template
          setFields([
            { id: 'collegeId', label: 'College ID / Roll Number', type: 'text', required: true, placeholder: 'e.g. 23BCS101' },
            { id: 'branch', label: 'Department / Branch', type: 'text', required: true, placeholder: 'e.g. Computer Science' },
            { id: 'year', label: 'Year of Study', type: 'select', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
            { id: 'discord', label: 'Discord Handle', type: 'text', required: false, placeholder: 'username#0000' },
          ]);
        }
      } catch (err) {
        setError('Failed to fetch existing event form.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const addField = () => {
    const newFieldId = `field_${Date.now()}`;
    setFields((prev) => [
      ...prev,
      {
        id: newFieldId,
        label: 'New Question',
        type: 'text',
        required: false,
        placeholder: '',
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<EventFormField>) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    setFields((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await eventService.saveEventForm(id, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError('Failed to save registration form questions.');
    } finally {
      setSaving(false);
    }
  };

  const fieldTypes = [
    { label: 'Short Text', value: 'text' },
    { label: 'Long Text / Textarea', value: 'textarea' },
    { label: 'Dropdown / Select', value: 'select' },
    { label: 'Phone Number', value: 'phone' },
    { label: 'Number', value: 'number' },
    { label: 'Email', value: 'email' },
    { label: 'Checkbox', value: 'checkbox' },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D1C]/30 border-t-[#FF4D1C] rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-zinc-500 uppercase">LOADING FORM BUILDER MATRIX...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/events" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO EVENTS</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Registration Form Builder
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Define custom registration fields that candidates must answer when applying for this event.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            {previewMode ? 'Edit Mode' : 'Live Preview'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {saved ? 'Saved!' : 'Save Questions'}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-[#FF4D1C]/10 border border-[#FF4D1C]/30 text-xs font-mono text-[#FF4D1C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Registration form configuration successfully synchronized!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {previewMode ? (
        /* ── PREVIEW MODE ─────────────────────────────────────── */
        <Card className="p-8 border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <Badge variant="cyan">CANDIDATE VIEW PREVIEW</Badge>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mt-2">
              Registration Form Preview
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Note: Full Name & Email are automatically included at top of every registration pass.
            </p>
          </div>

          <div className="space-y-4 opacity-80 pointer-events-none">
            <Input label="Full Name" required placeholder="Auto-included" />
            <Input label="Email Address" required placeholder="Auto-included" />

            {fields.map((f) => {
              if (f.type === 'select' && f.options) {
                return (
                  <Select
                    key={f.id}
                    label={f.label}
                    required={f.required}
                    options={['-- Select an option --', ...f.options]}
                  />
                );
              }
              if (f.type === 'textarea') {
                return (
                  <div key={f.id} className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">
                      {f.label} {f.required && '*'}
                    </label>
                    <textarea
                      placeholder={f.placeholder}
                      className="w-full bg-[#0a0c13] border border-white/10 rounded-xl p-3 text-sm"
                      rows={3}
                    />
                  </div>
                );
              }
              return (
                <Input
                  key={f.id}
                  label={f.label}
                  required={f.required}
                  placeholder={f.placeholder}
                />
              );
            })}
          </div>
        </Card>
      ) : (
        /* ── EDIT MODE ────────────────────────────────────────── */
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <Card key={field.id} className="p-5 border-white/10 bg-[#0c0e14]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-zinc-400">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white text-sm font-['Space_Grotesk']">
                    {field.label || 'Untitled Field'}
                  </span>
                  {field.required && (
                    <Badge variant="orange" size="sm">Required</Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveField(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveField(idx, 'down')}
                    disabled={idx === fields.length - 1}
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeField(idx)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Question / Prompt Label"
                  value={field.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                />

                <Select
                  label="Input Format"
                  options={fieldTypes}
                  value={field.type}
                  onChange={(e) => updateField(idx, { type: e.target.value as any })}
                />

                <Input
                  label="Placeholder Hint"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                />
              </div>

              {field.type === 'select' && (
                <div className="mt-3">
                  <Input
                    label="Dropdown Choices (Comma-separated)"
                    placeholder="Option 1, Option 2, Option 3"
                    value={(field.options || []).join(', ')}
                    onChange={(e) =>
                      updateField(idx, {
                        options: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-400">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(idx, { required: e.target.checked })}
                    className="rounded border-white/20 bg-black/40 text-[#FF4D1C] focus:ring-[#FF4D1C]"
                  />
                  <span>Mandatory field (Attendee cannot submit without answering)</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-600">ID: {field.id}</span>
              </div>
            </Card>
          ))}

          <Button
            variant="secondary"
            size="md"
            onClick={addField}
            leftIcon={<Plus className="w-4 h-4 text-[#FF4D1C]" />}
            className="w-full border-dashed"
          >
            Add Another Custom Registration Question
          </Button>
        </div>
      )}
    </div>
  );
};
