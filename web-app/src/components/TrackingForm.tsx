import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { TrackingEntry } from '../types';
import { BleedingSize, BleedingProduct, Emotion, BodySymptom } from '../types';
import '../styles/tracking.css';

interface TrackingFormProps {
  date: string;
  onSave: () => void;
}

const bleedingSizeOptions = Object.values(BleedingSize);
const bleedingProductOptions = Object.values(BleedingProduct);
const emotionOptions = Object.values(Emotion);
const symptomOptions = Object.values(BodySymptom);

export const TrackingForm: React.FC<TrackingFormProps> = ({ date, onSave }) => {
  const { getTrackingEntry, saveTrackingEntry } = useAppStore();
  const existing = getTrackingEntry(date);

  const [bleedingSize, setBleedingSize] = useState<string | undefined>(
    existing?.bleeding?.size
  );
  const [bleedingProducts, setBleedingProducts] = useState<string[]>(
    (existing?.bleeding?.products as string[]) || []
  );
  const [emotions, setEmotions] = useState<string[]>((existing?.emotions as string[]) || []);
  const [symptoms, setSymptoms] = useState<string[]>((existing?.symptoms as string[]) || []);
  const [notes, setNotes] = useState(existing?.notes || '');

  const handleBleedingProductToggle = (product: string) => {
    setBleedingProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  const handleEmotionToggle = (emotion: string) => {
    setEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: TrackingEntry = {
      date,
      bleeding: bleedingSize ? { size: bleedingSize as any, products: bleedingProducts as any } : undefined,
      emotions: emotions as any,
      symptoms: symptoms as any,
      notes: notes || undefined,
      appointments: existing?.appointments || [],
    };

    saveTrackingEntry(entry);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="tracking-form">
      <div className="form-section">
        <h3>Bleeding</h3>
        <div className="form-group">
          <label>Bleeding Level</label>
          <div className="button-group">
            {bleedingSizeOptions.map(size => (
              <button
                key={size}
                type="button"
                className={`option-button ${bleedingSize === size ? 'active' : ''}`}
                onClick={() => setBleedingSize(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
            <button
              type="button"
              className={`option-button ${!bleedingSize ? 'active' : ''}`}
              onClick={() => setBleedingSize(undefined)}
            >
              None
            </button>
          </div>
        </div>

        {bleedingSize && (
          <div className="form-group">
            <label>Products Used</label>
            <div className="checkbox-group">
              {bleedingProductOptions.map(product => (
                <label key={product} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bleedingProducts.includes(product)}
                    onChange={() => handleBleedingProductToggle(product)}
                  />
                  {product.charAt(0).toUpperCase() + product.slice(1)}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>Emotions</h3>
        <div className="checkbox-group">
          {emotionOptions.map(emotion => (
            <label key={emotion} className="checkbox-label">
              <input
                type="checkbox"
                checked={emotions.includes(emotion)}
                onChange={() => handleEmotionToggle(emotion)}
              />
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Body Symptoms</h3>
        <div className="checkbox-group">
          {symptomOptions.map(symptom => (
            <label key={symptom} className="checkbox-label">
              <input
                type="checkbox"
                checked={symptoms.includes(symptom)}
                onChange={() => handleSymptomToggle(symptom)}
              />
              {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          className="notes-textarea"
        />
      </div>

      <button type="submit" className="submit-button">
        Save Entry
      </button>
    </form>
  );
};
