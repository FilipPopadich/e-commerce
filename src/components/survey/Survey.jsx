import React, { useState } from 'react';
import './Survey.css';

function Survey() {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="survey-thanks container">
                <div className="thanks-icon">✓</div>
                <h2>Thank you!</h2>
                <p>We read every response — your voice genuinely shapes what we make next.</p>
            </div>
        );
    }

    return (
        <div className="survey-page container">
            <h1 className="survey-title">Tell us what you think</h1>
            <p className="survey-intro">You've got great taste — help us make FORM even better. It only takes a minute.</p>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="survey-form">
                <div className="form-group">
                    <label>How was your visit?</label>
                    <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                        <option value="5">Excellent</option>
                        <option value="4">Good</option>
                        <option value="3">Average</option>
                        <option value="2">Poor</option>
                        <option value="1">Very poor</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Anything on your mind?</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows="5" placeholder="Tell us what you loved, or what we could do better..." />
                </div>
                <button type="submit" className="btn-primary">Send Feedback</button>
            </form>
        </div>
    );
}

export default Survey;