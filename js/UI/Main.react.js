const React = require('react');
const Chat = require('./Chat.react');
const {Button, Modal} = require('bens_ui_components');
const Thread = require('./Thread.react');
const ThreadSidebar = require('./ThreadSidebar.react');
const {useEnhancedReducer} = require('bens_ui_components');
const {rootReducer, initState} = require('../reducers/rootReducer');
const {useState, useEffect, useMemo} = React;


function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    rootReducer, initState(),
  );
  window.getState = getState;
  window.dispatch = dispatch;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <ThreadSidebar state={state} dispatch={dispatch} />
      <Thread
        dispatch={dispatch}
        conversation={state.conversations[state.selectedConversation]}
      />
    </div>
  )
}




module.exports = Main;
