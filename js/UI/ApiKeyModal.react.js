const React = require('react');
const {Modal, TextField} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const ApiKeyModal = (props) => {
  const {dispatch} = props;

  const [apiKeyText, setApiKeyText] = useState(localStorage.getItem('gptAPIKey') ?? '');

  return (
    <Modal
      title={"Provide API Key"}
      dismiss={() => dispatch({type: 'DISMISS_MODAL'})}
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
          If your key gets rotated, then click the NEW API KEY button to add a new one.
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

