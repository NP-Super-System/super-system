import React, { useState, useEffect } from 'react';

const LikePostWrapper = props => {

    // 'children' should only contain a submit button
    const { liked, postId, userId, updateIsLiked, children } = props;

    const [ isLiked, setIsLiked ] = useState(false);

    useEffect(() => {
        setIsLiked(liked);
    }, [liked]);

    const likePostUrl = 'http://localhost:5000/forum-post/update/like';
    const unlikePostUrl = 'http://localhost:5000/forum-post/update/unlike';

    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ postId, userId }),
    }

    const onSubmitLike = e => {
        e.preventDefault();

        console.log(`Like post ${postId}`);

        fetch(likePostUrl, options)
            .then(res => {
                console.log('Liked post! :)');
                setIsLiked(true);
                updateIsLiked(true);
            })
            .catch(err => console.log(err));
    }

    const onSubmitUnlike = e => {
        e.preventDefault();

        console.log(`Unlike post ${postId}`);

        fetch(unlikePostUrl, options)
            .then(res => {
                console.log('Unliked post :(');
                setIsLiked(false);
                updateIsLiked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isLiked ? unlikePostUrl : likePostUrl} 
            method='POST' 
            onSubmit={isLiked ? onSubmitUnlike : onSubmitLike}>

            {children}

        </form>
    );
}

export default LikePostWrapper;