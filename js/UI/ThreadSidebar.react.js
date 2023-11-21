const React = require('react');
const {createConversation, createModelParams} = require('../gpt');
const {
  Button
} = require('bens_ui_components');
const {isMobile} = require('bens_utils').platform;
const ThreadTitle = require('./ThreadTitle.react');
const ImportManyJSONModal = require('./ImportManyJSONModal.react');
const ApiKeyModal = require('./ApiKeyModal.react');
const {useState} = React;


const ThreadSidebar = (props) => {
  const {state, dispatch} = props

  const convoHeaders = [];
  let i = 0;
  for (const name in state.conversations) {
    const conversation = state.conversations[name];
    convoHeaders.push(<ThreadTitle
      key={"convo_" + i}
      state={state} dispatch={dispatch}
      conversation={conversation} name={name}
    />);
    i++;
  }

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        width: 250,
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 5,
        gap: 15,
        paddingTop: 15,
        ...(isMobile() && expanded ? {
          backgroundColor: '#faf8ef',
          position: 'absolute',
          zIndex: 10,
          left: 1,
        } : {}),
      }}
    >
      <Button
        label={expanded ? '<' : '>'}
        onClick={() => setExpanded(!expanded)}
        style={{
          display: isMobile() ? 'block' : 'none',
          position: 'absolute',
          height: 25, width: 30,
          top: 0, left: expanded ? 220 : 8,
          zIndex: 10,
        }}
      />
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
              placeholder: 'Type anything...', tokens: 0, modelParams: createModelParams(),
            }),
            shouldSelect: true,
          });
        }}
      />

      <Button
        label="New API Key"
        onClick={() => {
          dispatch({type: 'SET_MODAL', modal: <ApiKeyModal dispatch={dispatch} />});
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '15px',
        }}
      >
        <Button
          label="Copy All"
          style={{
            fontSize: 15,
          }}
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(state.conversations))
          }}
        />
        <Button
          label="Import Many"
          style={{
            fontSize: 15,
          }}
          onClick={() => {
            dispatch({type: 'SET_MODAL',
              modal: <ImportManyJSONModal dispatch={dispatch} />
            });
          }}
        />

      </div>
    </div>
  );
}

module.exports = ThreadSidebar;
