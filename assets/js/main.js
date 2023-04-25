const GET_COMMENT_BUTTON = document.getElementById('getCommentButton');
const ADD_COMMENT_BUTTON = document.getElementById('addCommentButton');
const UPDATE_COMMENT_BUTTON = document.getElementById('updateCommentButton');
const DELETE_COMMENT_BUTTON = document.getElementById('deleteCommentButton');
const UPDATE_DATA_CONTAINER = document.querySelector('.updateDataContainer');
const COMMENTS_CONTAINER = document.querySelector('.comments');
const commentsURL = 'http://localhost:3000/comments';

const isValueValid = async (data, validationType) => {
  switch (validationType) {
    case 'numbers':
      const comments = await getComments();
      const hasOnlyNumbers = /^[0-9]+$/.test(data);

      return hasOnlyNumbers && comments.length;
    default:
      break;
  }
};

const toggleUpdateDataOption = function () {
  const isAuthorOption = /author/i.test(this.id);

  if (isAuthorOption) {
    UPDATE_DATA_CONTAINER.id = 'author';
    UPDATE_DATA_CONTAINER.innerHTML = `<input
      type="text"
      id="updateCommentAuthorInput"
      placeholder="Insert another author..."
    />`;
  } else {
    UPDATE_DATA_CONTAINER.id = 'body';
    UPDATE_DATA_CONTAINER.innerHTML = `<textarea
      id="updateCommentContentInput"
      cols="35"
      rows="5"
      placeholder="Add another comment..."
    ></textarea>`;
  }
};

/*
const sortCommentsId = async () => {
  const comments = await getComments();
  let index = 1;

  while (index <= comments.length) {
    const commentId = comments[index].id;

    fetch(`${commentsURL}/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: index,
        ...comments[index]
      })
    })
      .then(response => response.json())
      .then(() => {
        renderComments();
      });

    index++;
  }
};
*/

const getComments = async () => {
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
};

const getComment = async () => {
  const commentIdInput = document.getElementById('getCommentIdInput');

  if (await isValueValid(commentIdInput.value, 'numbers')) {
    const response = await fetch(`${commentsURL}/${commentIdInput.value}`);
    const data = await response.json();
    console.log('HTTP GET Method:', data);
  }
  commentIdInput.value = '';
};

const addComment = async () => {
  const commentInput = document.getElementById('comment-content');
  const commentAuthorInput = document.getElementById('comment-author');
  if (!commentInput.value || !commentAuthorInput.value) return;

  const comments = await getComments();
  const commentId = comments.length + 1;
  const comment = {
    id: commentId,
    author: commentAuthorInput.value,
    body: commentInput.value
  };

  await fetch(commentsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comment)
  });

  renderComment(comment);
};

const updateComment = async () => {
  const UPDATE_COMMENT_ID_INPUT = document.getElementById('updateCommentId');
  const commentId = UPDATE_COMMENT_ID_INPUT.value;
  const UPDATE_DATA_INPUT_CHILD = UPDATE_DATA_CONTAINER.firstElementChild;
  const comments = await getComments();
  const comment = comments.find($comment => $comment.id == commentId);
  const commentProp = UPDATE_DATA_CONTAINER.id;

  if (
    (await isValueValid(commentId, 'numbers')) &&
    UPDATE_DATA_INPUT_CHILD.value
  ) {
    comment[commentProp] = UPDATE_DATA_INPUT_CHILD.value;

    fetch(`${commentsURL}/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
      .then(response => response.json())
      .then(() => {
        renderComments();
      });
  }
  UPDATE_COMMENT_ID_INPUT.value = '';
  UPDATE_DATA_INPUT_CHILD.value = '';
};

const deleteComment = async () => {
  const commentIdInput = document.getElementById('deleteCommentIdInput');
  const commentId = commentIdInput.value;

  if (await isValueValid(commentId, 'numbers')) {
    fetch(`${commentsURL}/${commentId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        renderComments();
      });
  }
  commentIdInput.value = '';
};

const renderComment = ({ author, body }) => {
  const COMMENT_CONTAINER = document.createElement('div');
  const AUTHOR_H3 = document.createElement('h3');
  const COMMENT_BODY = document.createElement('article');

  COMMENT_CONTAINER.classList.add('comment');
  COMMENT_BODY.classList.add('comment__body');

  AUTHOR_H3.innerText = author;
  COMMENT_BODY.innerText = body;

  COMMENT_CONTAINER.appendChild(AUTHOR_H3);
  COMMENT_CONTAINER.appendChild(COMMENT_BODY);

  COMMENTS_CONTAINER.appendChild(COMMENT_CONTAINER);
};

const renderComments = async () => {
  const commentsData = await getComments();
  COMMENTS_CONTAINER.innerHTML = '';

  commentsData.forEach(commentData => {
    renderComment(commentData, false);
  });
};

document.body.onload = renderComments;

GET_COMMENT_BUTTON.addEventListener('click', getComment);

ADD_COMMENT_BUTTON.addEventListener('click', addComment);

UPDATE_COMMENT_BUTTON.addEventListener('click', updateComment);

DELETE_COMMENT_BUTTON.addEventListener('click', deleteComment);

document
  .querySelectorAll('input[name="updateCommentOption"]')
  .forEach(updateCommentOptionInput =>
    updateCommentOptionInput.addEventListener('click', toggleUpdateDataOption)
  );
