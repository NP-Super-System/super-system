import React, { useState, useEffect } from 'react';

const LikeWrapper = props => {

    // 'children' should only contain a submit button
    const { liked, postId, userEmail, updateIsLiked, children } = props;

    const [ isLiked, setIsLiked ] = useState(false);

    useEffect(() => {
        setIsLiked(liked);
    }, [liked]);

    const likePostUrl = 'http://localhost:5000/like-post';
    const unLikePostUrl = 'http://localhost:5000/unlike-post';

    const onSubmitLike = e => {
        e.preventDefault();

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ postId, userEmail }),
        }

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

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ postId, userEmail }),
        }

        console.log(`Unlike post ${postId}`);

        fetch(unLikePostUrl, options)
            .then(res => {
                console.log('Unliked post :(');
                setIsLiked(false);
                updateIsLiked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isLiked ? unLikePostUrl : likePostUrl} 
            method='POST' 
            onSubmit={isLiked ? onSubmitUnlike : onSubmitLike}>

            <input type='hidden' name='postId' value={postId} />
            <input type='hidden' name='userEmail' value={userEmail} />
            {children}

        </form>
    );
}

export default LikeWrapper;