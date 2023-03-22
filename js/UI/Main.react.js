const React = require('react');
const Chat = require('./Chat.react');
const {Button, Modal} = require('bens_ui_components');
const Thread = require('./Thread.react');
const ThreadSidebar = require('./ThreadSidebar.react');
const ApiKeyModal = require('./ApiKeyModal.react');
const {useEnhancedReducer} = require('bens_ui_components');
const {rootReducer, initState} = require('../reducers/rootReducer');
const {useState, useEffect, useMemo} = React;


function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    rootReducer, initState(),
  );
  window.getState = getState;
  window.dispatch = dispatch;

  useEffect(() => {
    const apiKey = localStorage.getItem("gptAPIKey");
    if (!apiKey) {
      dispatch({type: 'SET_MODAL',
        modal: <ApiKeyModal dispatch={dispatch} />
      });
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        cursor: state.awaitingResponse ? 'wait' : 'auto',
      }}
    >
      <ThreadSidebar state={state} dispatch={dispatch} />
      <Thread
        dispatch={dispatch}
        conversation={state.conversations[state.selectedConversation]}
        submitOnEnter={!state.isEditingPreviousMessage}
      />
      {state.modal}
    </div>
  )
}




module.exports = Main;
