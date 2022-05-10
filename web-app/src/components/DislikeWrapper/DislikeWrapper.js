import React, { useState, useEffect } from 'react';

const DislikeWrapper = props => {

    // 'children' should only contain a submit button
    const { disliked, postId, userEmail, updateIsDisliked, children } = props;

    const [ isDisliked, setIsDisliked ] = useState(false);

    useEffect(() => {
        setIsDisliked(disliked);
    }, [disliked]);

    const dislikePostUrl = 'http://localhost:5000/dislike-post';
    const unDislikePostUrl = 'http://localhost:5000/undislike-post';

    const onSubmitDislike = e => {
        e.preventDefault();

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ postId, userEmail }),
        }

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

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ postId, userEmail }),
        }

        console.log(`Undislike post ${postId}`);

        fetch(unDislikePostUrl, options)
            .then(res => {
                console.log('Undisliked post');
                setIsDisliked(false);
                updateIsDisliked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isDisliked ? unDislikePostUrl : dislikePostUrl} 
            method='POST' 
            onSubmit={isDisliked ? onSubmitUndislike : onSubmitDislike}>

            <input type='hidden' name='postId' value={postId} />
            <input type='hidden' name='userEmail' value={userEmail} />
            {children}

        </form>
    );
}

export default DislikeWrapper;