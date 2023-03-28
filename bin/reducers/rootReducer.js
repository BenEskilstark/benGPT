const {
  modalReducer
} = require('./modalReducer');
const {
  conversationReducer
} = require('./conversationReducer');
const {
  createConversation
} = require('../gpt');
const {
  config
} = require('../config');
const rootReducer = (state, action) => {
  if (state === undefined) return initState();
  switch (action.type) {
    case 'SELECT_CONVERSATION':
    case 'ADD_CONVERSATION':
    case 'SET_CONVERSATION_NAME':
    case 'UPDATE_CONVERSATION':
    case 'SET_EDITING_PREVIOUS':
    case 'SET_AWAITING':
    case 'DELETE_CONVERSATION':
      const nextState = conversationReducer(state, action);
      localStorage.setItem("conversations", JSON.stringify(nextState.conversations));
      localStorage.setItem("selectedConversation", nextState.selectedConversation);
      return nextState;
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
  }
  return state;
};

//////////////////////////////////////
// Initializations
const initState = () => {
  const local = localStorage.getItem("conversations");
  const conversations = local ? JSON.parse(local) : null;
  const selected = localStorage.getItem("selectedConversation");
  return {
    conversations: conversations ?? {
      ['conversation 1']: createConversation({
        name: 'conversation 1',
        placeholder: 'Type anything...',
        tokens: 0
      })
    },
    selectedConversation: selected ?? 'conversation 1',
    awaitingResponse: false,
    isEditingPreviousMessage: false
  };
};
module.exports = {
  rootReducer,
  initState
};