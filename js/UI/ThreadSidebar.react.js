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
        {state.selectedConversation == name ? (
          <TextField
            value={name}
            onChange={(val) => {
              dispatch({type: 'SET_CONVERSATION_NAME',
                oldName: name, newName: val,
              });
            }}
          />
        ) : (
          name
        )}
        <Button
          label="❌"
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
            border: 'none',
            backgroundColor: 'inherit',
            float: 'right',
            cursor: 'pointer',
            fontSize: 10,
          }}
          onClick={() => {
            dispatch({type: 'DELETE_CONVERSATION', name});
          }}
        />
        <div
          style={{
            fontSize: 12,
          }}
        >
          {conversation.tokens}/4096 tokens
        </div>
        <div
          style={{
            display: state.selectedConversation != name
              ? 'none' : 'inline',
          }}
        >
          <Button
            label="Clone"
            style={{
              width: '33%',
              fontSize: 15,
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
            style={{
              width: '33%',
              fontSize: 15,
            }}
            label="Copy"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(conversation));
            }}
          />
          <Button
            label="Import"
            style={{
              width: '33%',
              fontSize: 15,
            }}
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
        paddingTop: 15,
      }}
    >
      {convoHeaders}
      <Button
        label="New Conversation"
        style={{
          display: 'block',
          marginTop: 15,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 20,
          paddingRight: 20,
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


    </div>
  );
}

module.exports = ThreadSidebar;
