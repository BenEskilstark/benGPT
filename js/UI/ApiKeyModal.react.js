const React = require('react');
const {Modal, TextField} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const ApiKeyModal = (props) => {
  const {state, dispatch} = props;

  const [apiKeyText, setApiKeyText] = useState('');

  return (
    <Modal
      title={"Provide API Key"}
      body={
        <div
          style={{

          }}
        >
          The key you provide here will be saved to localStorage for next time.
          It will not be stored on any server outside OpenAI's.
          Get a key <a
            target="_blank"
            href="https://platform.openai.com/account/api-keys">here</a>.
          If your key gets rotated, then delete it in the console with
          localStorage.removeItem("gptAPIKey") and then refresh
          <TextField
            style={{
              width: '99%',
            }}
            value={apiKeyText}
            onChange={setApiKeyText}
            placeholder={"Key goes here"}
          />
        </div>
      }
      buttons={[{
        label: 'Save API Key',
        onClick: () => {
          localStorage.setItem("gptAPIKey", apiKeyText);
          dispatch({type: 'DISMISS_MODAL'});
        }
      }]}
      style={{

      }}
    >

    </Modal>
  );
};

module.exports = ApiKeyModal;

