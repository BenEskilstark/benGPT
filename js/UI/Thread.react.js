const React = require('react');
const Chat = require('./Chat.react');
const {
  createConversation, submitConversation, createAPI,
  addMessage,
} = require('../gpt');
const {useState, useEffect, useMemo} = React;

/**
 *  A thin wrapper around chat threads for the purpose of supporting
 *  multiple threads at once
 */
function Thread(props) {
  const {conversation, dispatch} = props;

  const updateConversation = (convo) => {
    dispatch({type: 'UPDATE_CONVERSATION', conversation: convo});
  }

  return (
    <Chat
      style={{
        height: '100%',
        margin: 'none',
        marginTop: 0,
        flexGrow: 1,
      }}
      conversation={conversation}
      onSubmit={(message, toAPI) => {
        const nextConversation = addMessage(conversation, message);
        updateConversation(nextConversation);
        if (toAPI) {
          submitConversation(nextConversation)
            .then((response) => {
              // console.log(response.usage, response.finishReason);
              const nextConvo = {
                ...addMessage(nextConversation, response.message),
                tokens: response.tokens,
              }
              updateConversation(nextConvo);
            }).catch((ex) => {
              console.error(ex);
            });
        }
      }}
      onClear={() => {
        const nextConvo = {...conversation, messages: []};
        updateConversation(nextConvo);
      }}
      onUndo={() => {
        const nextConvo = {...conversation, messages: conversation.messages.slice(0, -1)};
        updateConversation(nextConvo);
      }}
      showRole={true} showClear={true} showSystem={true}
    />
  );
}

module.exports = Thread;
