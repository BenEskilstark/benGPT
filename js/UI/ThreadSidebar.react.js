const React = require('react');
const {createConversation} = require('../gpt');
const {
  TextField, Button, Divider
} = require('bens_ui_components');


const ThreadSidebar = (props) => {
  const {state, dispatch} = props

  const convoHeaders = [];
  let i = 0;
  for (const name in state.conversations) {
    const conversation = state.conversations[name];
    convoHeaders.push(
      <div
        key={"convo_" + i}
        style={{
          width: '100%',
          padding: '15%',
        }}
      >
        <TextField
          value={name}
          onChange={(val) => {
            dispatch({type: 'SET_CONVERSATION_NAME',
              oldName: name, newName: val,
            });
          }}
        />
        <div>
          {conversation.tokens}/4096 tokens
        </div>
        <Button
          label="Select"
          disabled={state.selectedConversation == name}
          onClick={() => {
            dispatch({type: 'SELECT_CONVERSATION',
              selectedConversation: name,
            });
          }}
        />

      </div>
    );
    i++;
  }

  return (
    <div
      style={{
        width: 200,
        height: '100%',
      }}
    >
      <div
        style={{

        }}
      >
        Conversations:
        <Divider />
      </div>
      <Button
        label="New Conversation"
        onClick={() => {
          dispatch({type: 'ADD_CONVERSATION',
            conversation: createConversation({
              name: 'conversation ' + (Object.keys(state.conversations).length + 1),
              placeholder: 'Type anything...', tokens: 0,
            }),
            shouldSelect: true,
          });
        }}
      />

      {convoHeaders}

    </div>
  );
}

module.exports = ThreadSidebar;
