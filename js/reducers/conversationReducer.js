
const {createConversation} = require('../gpt');
const {deepCopy} = require('bens_utils').helpers;

const conversationReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'SET_AWAITING': {
      return {
        ...state,
        awaitingResponse: action.awaitingResponse,
      };
    }
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
        conversation.name = addName(conversation.name, Object.keys(state.conversations));
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

// NOTE: this was produced by ChatGPT :)
// Prevents name collisions by adding a number to the end if necessary
function addName(name, existingNames) {
  let currentName = name;
  let index = 0;
  while (existingNames.includes(currentName)) {
    const match = currentName.match(/^(.*?)(\d*)$/);
    const baseName = match ? match[1] : currentName;
    const numberString = match ? match[2] : '';
    const number = numberString ? parseInt(numberString) : 0;
    index = Math.max(index, number + 1);
    currentName = `${baseName}${index}`;
  }
  return currentName;
}

module.exports = {conversationReducer};
