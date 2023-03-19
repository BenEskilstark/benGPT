const React = require('react');
const {createConversation} = require('../gpt');
const {
  TextField, Button, Divider
} = require('bens_ui_components');
const {deepCopy} = require('bens_utils').helpers;


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
          border: state.selectedConversation == name
            ? '1px solid grey' : 'none',
        }}
        onClick={() => {
          if (state.selectedConversation != name) {
            dispatch({type: 'SELECT_CONVERSATION',
              selectedConversation: name,
            });
          }
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
          label="Duplicate"
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
          }}
          onClick={() => {
            dispatch({type: 'ADD_CONVERSATION',
              conversation: {
                ...deepCopy(conversation),
                name: 'conversation ' + (Object.keys(state.conversations).length + 1),
              },
              shouldSelect: true,
            });
          }}
        />
        <Button
          label="Delete"
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
          }}
          onClick={() => {
            dispatch({type: 'DELETE_CONVERSATION', name});
          }}
        />

      </div>
    );
    i++;
  }

  return (
    <div
      style={{
        width: 250,
        height: '100%',
        overflowY: 'scroll',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 5,
        gap: 10,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          width: '100%',
          marginTop: 15,
        }}
      >
        <b>Conversations:</b>
        <Divider
          style={{
            marginTop: 5,
            marginBottom: 5,
          }}
        />
      </div>
      <Button
        label="New Conversation"
        style={{
          display: 'block',
        }}
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
