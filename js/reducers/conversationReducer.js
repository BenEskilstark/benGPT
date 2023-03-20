
const {createConversation} = require('../gpt');
const {deepCopy} = require('bens_utils').helpers;

const conversationReducer = (state, action) => {
  if (state === undefined) return {};

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

      // NOTE: have to do it this way in order to maintain the order of the keys
      conversation.name = newName;
      const nextConversations = {};
      for (const name in state.conversations) {
        if (name == oldName) {
          nextConversations[newName] = conversation;
        } else {
          nextConversations[name] = state.conversations[name]
        }
      }

      if (state.selectedConversation == oldName) {
        state.selectedConversation = newName;
      }
      return {...state, conversations: nextConversations};
    }
    case 'UPDATE_CONVERSATION': {
      const {conversation} = action;
      state.conversations[conversation.name] = conversation;
      return {...state};
    }
    case 'DELETE_CONVERSATION': {
      const {name} = action;
      delete state.conversations[name];
      if (state.selectedConversation == name) {
        if (Object.keys(state.conversations).length == 0) {
          return initState();
        }
        state.selectedConversation = Object.keys(state.conversations)[0];
      }
      return {...state};
    }
  }

  return state;
};

module.exports = {conversationReducer};
