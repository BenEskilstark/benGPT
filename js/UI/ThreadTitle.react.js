const React = require('react');
const {createModelParams, getModelParamBounds} = require('../gpt');
const {Slider, Button, TextField} = require('bens_ui_components');
const ImportJSONModal = require('./ImportJSONModal.react');
const {deepCopy} = require('bens_utils').helpers;
const {useEffect, useState, useMemo} = React;

const ThreadTitle = (props) => {
  const {state, dispatch, conversation, name} = props;

  const [showParams, setShowParams] = useState(false);

  return (
    <div
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
        label={showParams ? 'Hide' : "Edit"}
        style={{
          border: 'none',
          backgroundColor: 'inherit',
          display: state.selectedConversation != name
            ? 'none' : 'inline',
          padding: 2,
          cursor: 'pointer',
          fontSize: 10,
        }}
        onClick={() => {
          if (Object.keys(conversation.modelParams).length == 0) {
            dispatch({type: 'UPDATE_CONVERSATION',
              conversation: {...conversation, modelParams: createModelParams()},
            });
          }
          setShowParams(!showParams);
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
      {showParams && state.selectedConversation == name ? (<ModelParams
        conversation={conversation} dispatch={dispatch} />) : null
      }
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
};

const ModelParams = (props) => {
  const {conversation, dispatch} = props;
  const {modelParams} = conversation;
  const bounds = getModelParamBounds();

  const sliders = [];
  for (const param in bounds) {
    sliders.push(
      <Slider
        style={{
          fontSize: 10,
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: 2,
        }}
        key={"slider_" + param}
        label={param}
        min={bounds[param].min} max={bounds[param].max}
        value={modelParams[param]}
        step={bounds[param].inc}
        onChange={(value) => {
          dispatch({type: 'UPDATE_CONVERSATION',
            conversation: {
              ...conversation,
              modelParams: {
                ...conversation.modelParams,
                [param]: value,
              },
            },
          });
        }}
        noNumberField={false}
        noOriginalValue={true}
        isFloat={bounds[param].inc < 1}
      />
    );
  }

  return (
    <div
      style={{

      }}
    >
      {sliders}
    </div>
  );
};


module.exports = ThreadTitle;

