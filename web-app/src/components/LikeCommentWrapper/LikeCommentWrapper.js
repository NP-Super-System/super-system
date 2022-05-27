import React, {useState, useEffect} from 'react';

const LikeCommentWrapper = props => {

    // children should only include submit button
    const { liked, commentId, userId, updateIsLiked, type, children } = props;

    const [isLiked, setIsLiked] = useState(false);

    useEffect( () => {
        setIsLiked(liked);
    }, [liked]);

    const likeCommentUrl = 'http://localhost:5000/forum-post/update/comment/like';
    const unlikeCommentUrl = 'http://localhost:5000/forum-post/update/comment/unlike';

    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ type, commentId, userId }),
    }

    const onSubmitLike = e => {
        e.preventDefault();

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

            {children}

        </form>
    );
}

export default LikeCommentWrapper;