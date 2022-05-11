import React, {useState, useEffect} from 'react';

const DislikeCommentWrapper = props => {

    // children should only include submit button
    const { disliked, commentId, userEmail, updateIsDisliked, type, children } = props;

    const [isDisliked, setIsDisliked] = useState(false);

    useEffect( () => {
        setIsDisliked(disliked);
    }, [disliked]);

    const dislikeCommentUrl = 'http://localhost:5000/dislike-comment';
    const undislikeCommentUrl = 'http://localhost:5000/undislike-comment';

    const onSubmitDislike = e => {
        e.preventDefault();

        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ type, commentId, userEmail }),
        }

        console.log(`Dislike comment ${commentId}`);

        fetch(dislikeCommentUrl, options)
            .then(res => {
                console.log('Disliked comment');
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
            body: JSON.stringify({ type, commentId, userEmail }),
        }

        console.log(`Undislike comment ${commentId}`);

        fetch(undislikeCommentUrl, options)
            .then(res => {
                console.log('Undisliked comment');
                setIsDisliked(false);
                updateIsDisliked(false);
            })
            .catch(err => console.log(err));
    }

    return (
        <form 
            action={isDisliked ? undislikeCommentUrl : dislikeCommentUrl} 
            method='POST' 
            onSubmit={isDisliked ? onSubmitUndislike : onSubmitDislike}>

            <input type='hidden' name='commentId' value={commentId} />
            <input type='hidden' name='userEmail' value={userEmail} />
            <input type='hidden' name='type' value={type} />
            {children}

        </form>
    );
}

export default DislikeCommentWrapper;