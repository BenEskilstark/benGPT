const React = require('react');
const {Modal, TextField} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const ApiKeyModal = (props) => {
  const {conversation, dispatch} = props;

  const [convoJSON, setConvoJSON] = useState('');

  return (
    <Modal
      title={"Paste conversation JSON"}
      dismiss={() => dispatch({type: 'DISMISS_MODAL'})}
      body={
        <div
          style={{

          }}
        >
          The pasted JSON will overwrite whatever is in this conversation.
          The format is the same as what is exported by the Export JSON button
          <TextField
            style={{
              width: '99%',
            }}
            value={convoJSON}
            onChange={setConvoJSON}
            placeholder={"JSON goes here"}
          />
        </div>
      }
      buttons={[{
        label: 'Import Conversation',
        onClick: () => {
          dispatch({type: 'UPDATE_CONVERSATION',
            conversation: {...JSON.parse(convoJSON), name: conversation.name},
          });
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

