import React, { useEffect, useState } from 'react'
import axiosRequest from '../../services/axiosRequest';
import useUserStore from '../../store/userStore';

export default function CommentSection({ data = [], recipeId }) {
    const [comments, setComments] = useState([])
    const [showCommentActions, setShowCommentActions] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { user } = useUserStore()
    useEffect(() => {
        console.log('Data received:', data);
        setComments(data);
    }, [data]);

    async function addComment() {
        const body = {
            recipeId: recipeId,
            content: commentText
        };

        console.log('Adding comment:', body);

        const res = await axiosRequest({ url: "/comment/create", method: "POST", body: body });

        if (res && res.data) {

            const newComment = {
                content: commentText,
                fullName: user.name,
                createdAt: new Date().toLocaleDateString('he-IL'),
                _id: res.data
            }; // Assuming API returns the created comment
            setComments(prevComments => [...prevComments, newComment]);
            return true;
        }
        return false;
    }


    const submitComment = async () => {
        if (commentText.trim()) {
            const success = await addComment();
            if (success) {
                alert('תגובה נשלחה בהצלחה!');
                setCommentText('');
                setShowCommentActions(false);
            }
        }
    };

    return (
        <div className="recipe-section">
            <div className="comments-header">
                <h2 className="section-title">
                    <i className="fas fa-comments"></i>
                    תגובות ({comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            <div className={`comment-form ${showCommentActions ? 'active' : ''}`}>
                <textarea
                    className="comment-input"
                    placeholder="שתף את החוויה שלך עם המתכון..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={() => setShowCommentActions(true)}
                />
                <div className="comment-actions">
                    <button
                        className="comment-submit"
                        onClick={submitComment}
                        disabled={!commentText.trim()}
                    >
                        פרסם
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment._id || comment.id || index} className="comment">
                            <div className="comment-header">
                                <div className="comment-avatar">{comment.avatar || comment.fullName?.charAt(0) || '👤'}</div>
                                <div className="comment-info">
                                    <div className="comment-author">{comment.fullName || comment.userName || 'אנונימי'}</div>
                                    <div className="comment-time">
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('he-IL') : 'לא זמין'}
                                    </div>
                                </div>
                            </div>
                            <div className="comment-text">{comment.content || comment.text}</div>
                            <div className="comment-actions">
                                <button className={`comment-action ${comment.liked ? 'liked' : ''}`}>
                                    <i className={`${comment.liked ? 'fas' : 'far'} fa-heart`}></i>
                                    <span>{comment.likes || 0}</span>
                                </button>
                                <button className="comment-action">
                                    <i className="far fa-comment"></i>
                                    <span>הגב</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-comments">
                        <p>אין תגובות עדיין. היה הראשון להגיב!</p>
                    </div>
                )}
            </div>
        </div>
    )
}