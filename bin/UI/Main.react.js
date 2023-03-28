const React = require('react');
const Chat = require('./Chat.react');
const {
  Button,
  Modal
} = require('bens_ui_components');
const Thread = require('./Thread.react');
const ThreadSidebar = require('./ThreadSidebar.react');
const ApiKeyModal = require('./ApiKeyModal.react');
const {
  useEnhancedReducer
} = require('bens_ui_components');
const {
  rootReducer,
  initState
} = require('../reducers/rootReducer');
import postVisit from '../postVisit';
const {
  useState,
  useEffect,
  useMemo
} = React;
function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(rootReducer, initState());
  window.getState = getState;
  window.dispatch = dispatch;
  useEffect(() => {
    postVisit();
    const apiKey = localStorage.getItem("gptAPIKey");
    if (!apiKey) {
      dispatch({
        type: 'SET_MODAL',
        modal: /*#__PURE__*/React.createElement(ApiKeyModal, {
          dispatch: dispatch
        })
      });
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      cursor: state.awaitingResponse ? 'wait' : 'auto'
    }
  }, /*#__PURE__*/React.createElement(ThreadSidebar, {
    state: state,
    dispatch: dispatch
  }), /*#__PURE__*/React.createElement(Thread, {
    dispatch: dispatch,
    conversation: state.conversations[state.selectedConversation],
    submitOnEnter: !state.isEditingPreviousMessage,
    style: {}
  }), state.modal);
}
module.exports = Main;