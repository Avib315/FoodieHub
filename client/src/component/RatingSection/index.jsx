import React, { useState, useEffect } from 'react'
import axiosRequest from '../../services/axiosRequest';
import useUserStore from '../../store/userStore';

export default function RatingSection({ ratedByMe = false, averageRating, ratingsCount, id, userName = null }) {
    const [userRating, setUserRating] = useState(0);
    const [averageRatingState, setAverageRatingState] = useState(averageRating);
    const [ratingCount, setRatingCount] = useState(ratingsCount);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { user } = useUserStore();

    // Update state when props change
    useEffect(() => {
        setAverageRatingState(averageRating);
        setRatingCount(ratingsCount);
    }, [averageRating, ratingsCount]);

    const renderStars = (rating, interactive = true, onStarClick = null) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star star ${i <= rating ? '' : 'empty'}`}
                    onClick={interactive ? () => onStarClick(i) : undefined}
                    data-rating={i}
                />
            );
        }
        return stars;
    };

    const setRating = (rating) => {
        setUserRating(rating);
    };

    async function addRating(rat) {
        const body = {
            recipeId: id,
            rating: rat,
            review: ''
        };
        const res = await axiosRequest({ url: "/rating/create", method: "POST", body: body });
        return res;
    }

    const submitRating = async () => {
        if (userRating > 0) {
            const result = await addRating(userRating);

            if (result.success === false) {
                alert('לא ניתן לשלוח דירוג');
            }
            else {
                alert(`דירוג נשלח בהצלחה: ${userRating} כוכבים`);
                
                // Update the local state after successful submission
                const newRatingCount = ratingCount + 1;
                const newAverageRating = ((averageRatingState * ratingCount) + userRating) / newRatingCount;
                
                setRatingCount(newRatingCount);
                setAverageRatingState(newAverageRating);
                setHasSubmitted(true);
                
                // Optionally reset user rating after submission
                setUserRating(0);
            }
        }
    };

    return (
        <>
            <div className="recipe-section">
                <h2 className="section-title">
                    <i className="fas fa-star"></i>
                    דירוגים וחוות דעת
                </h2>

                <div className="rating-section">
                    <div className="current-rating">
                        <div className="rating-stars">
                            {renderStars(Math.round(averageRatingState), false)}
                        </div>
                        <div className="rating-text">
                            {averageRatingState.toFixed(1)} מתוך 5 ({ratingCount} דירוגים)
                        </div>
                    </div>
                    {userName != user.username && !hasSubmitted && !ratedByMe &&
                        <div className="your-rating">
                            <h4>דרג את המתכון</h4>
                            <div className="rating-input">
                                {renderStars(userRating, true, setRating)}
                            </div>
                            <button
                                className="rating-submit"
                                onClick={submitRating}
                                disabled={userRating === 0}
                            >
                                שלח דירוג
                            </button>
                        </div>
                    }
                    {hasSubmitted &&
                        <div className="rating-submitted">
                            <p>תודה על הדירוג שלך!</p>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}