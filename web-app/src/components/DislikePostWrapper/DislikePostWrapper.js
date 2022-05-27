import React, { useState, useEffect } from 'react';

const DislikePostWrapper = props => {

    // 'children' should only contain a submit button
    const { disliked, postId, userId, updateIsDisliked, children } = props;

    const [ isDisliked, setIsDisliked ] = useState(false);

    useEffect(() => {
        setIsDisliked(disliked);
    }, [disliked]);

    const dislikePostUrl = 'http://localhost:5000/forum-post/update/dislike';
    const undislikePostUrl = 'http://localhost:5000/forum-post/update/undislike';

    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ postId, userId }),
    }

    const onSubmitDislike = e => {
        e.preventDefault();

        console.log(`Dislike post ${postId}`);

        fetch(dislikePostUrl, options)
            .then(res => {
                console.log('Disliked post');
                setIsDisliked(true);
                updateIsDisliked(true);
            })
            .catch(err => console.log(err));
    }

    const onSubmitUndislike = e => {
        e.preventDefault();

        console.log(`Undislike post ${postId}`);

        fetch(undislikePostUrl, options)
            .then(res => {
                console.log('Undisliked post');
                setIsDisliked(false);
                updateIsDisliked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isDisliked ? undislikePostUrl : dislikePostUrl} 
            method='POST' 
            onSubmit={isDisliked ? onSubmitUndislike : onSubmitDislike}>

            {children}

        </form>
    );
}

export default DislikePostWrapper;