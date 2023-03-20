const React = require('react');
const {createConversation} = require('../gpt');
const {
  TextField, Button, Divider
} = require('bens_ui_components');
const ImportJSONModal = require('./ImportJSONModal.react');
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
          boxShadow: state.selectedConversation == name
            ? '0 0 10px 10px #FAEBD7' : 'none',
          backgroundColor: state.selectedConversation == name
            ? '#FAEBD7' : 'inherit',
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
        <Button
          label="❌"
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
            border: 'none',
            backgroundColor: 'inherit',
            float: 'right',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch({type: 'DELETE_CONVERSATION', name});
          }}
        />
        <div>
          {conversation.tokens}/4096 tokens
        </div>
        <div
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
          }}
        >
          <Button
            label="Duplicate"
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
          <div></div>
          <Button
            label="Copy to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(conversation));
            }}
          />
          <Button
            label="Import JSON"
            onClick={() => {
              dispatch({type: 'SET_MODAL',
                modal: <ImportJSONModal
                  conversation={conversation}
                  dispatch={dispatch}
                />
              });
            }}
          />
        </div>


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
        gap: 15,
      }}
    >
      <Button
        label="New Conversation"
        style={{
          display: 'block',
          marginTop: 15,
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
