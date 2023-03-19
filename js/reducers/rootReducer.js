
const {modalReducer} = require('./modalReducer');
const {config} = require('../config');
const {createConversation} = require('../gpt');
const {deepCopy} = require('bens_utils').helpers;

const rootReducer = (state, action) => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'SELECT_CONVERSATION': {
      const {selectedConversation} = action;
      return {
        ...state,
        selectedConversation,
      };
    }
    case 'ADD_CONVERSATION': {
      const {conversation, shouldSelect} = action;
      if (state.conversations[conversation.name]) {
        conversation.name += 'x';
      }
      state.conversations[conversation.name] = conversation;
      if (shouldSelect) {
        state.selectedConversation = conversation.name;
      }
      return {...state};
    }
    case 'SET_CONVERSATION_NAME': {
      const {oldName, newName} = action;
      const conversation = state.conversations[oldName];
      if (!conversation) return {...state};
      conversation.name = newName;
      delete state.conversations[oldName];
      state.conversations[newName] = conversation;
      if (state.selectedConversation == oldName) {
        state.selectedConversation = newName;
      }
      return {...state};
    }
    case 'UPDATE_CONVERSATION': {
      const {conversation} = action;
      state.conversations[conversation.name] = conversation;
      return {...state};
    }
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
  }
  return state;
};


//////////////////////////////////////
// Initializations
const initState = () => {
  return {
    conversations: {
      ['conversation 1']: createConversation({
        name: 'conversation 1', placeholder: 'Type anything...', tokens: 0,
      }),
    },
    selectedConversation: 'conversation 1',
  };
}


module.exports = {rootReducer, initState};
