import React, {useState, useEffect} from 'react';

const LikeCommentWrapper = props => {

    // children should only include submit button
    const { liked, commentId, userEmail, updateIsLiked, type, children } = props;

    const [isLiked, setIsLiked] = useState(false);

    useEffect( () => {
        setIsLiked(liked);
    }, [liked]);

    const likeCommentUrl = 'http://localhost:5000/like-comment';
    const unlikeCommentUrl = 'http://localhost:5000/unlike-comment';

    const onSubmitLike = e => {
        e.preventDefault();

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ type, commentId, userEmail }),
        }

        console.log(`Like comment ${commentId}`);

        fetch(likeCommentUrl, options)
            .then(res => {
                console.log('Liked comment!');
                setIsLiked(true);
                updateIsLiked(true);
            })
            .catch(err => console.log(err));
    }

    const onSubmitUnlike = e => {
        e.preventDefault();

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ type, commentId, userEmail }),
        }

        console.log(`Unlike comment ${commentId}`);

        fetch(unlikeCommentUrl, options)
            .then(res => {
                console.log('Unliked comment');
                setIsLiked(false);
                updateIsLiked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isLiked ? unlikeCommentUrl : likeCommentUrl} 
            method='POST' 
            onSubmit={isLiked ? onSubmitUnlike : onSubmitLike}>

            <input type='hidden' name='commentId' value={commentId} />
            <input type='hidden' name='userEmail' value={userEmail} />
            <input type='hidden' name='type' value={type} />
            {children}

        </form>
    );
}

export default LikeCommentWrapper;