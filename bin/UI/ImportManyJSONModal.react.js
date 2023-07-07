const React = require('react');
const {
  Modal,
  TextArea
} = require('bens_ui_components');
const {
  useEffect,
  useState,
  useMemo
} = React;
const ImportManyJSONModal = props => {
  const {
    dispatch
  } = props;
  const [convoJSON, setConvoJSON] = useState('');
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Paste conversation JSON",
    dismiss: () => dispatch({
      type: 'DISMISS_MODAL'
    }),
    body: /*#__PURE__*/React.createElement("div", {
      style: {}
    }, "The pasted JSON will create all new conversations. Name overlaps with conversations that already exist here will have numbers appended to the end. The format is the same as what is exported by the COPY ALL button", /*#__PURE__*/React.createElement(TextArea, {
      style: {
        width: '99%'
      },
      value: convoJSON,
      onChange: setConvoJSON,
      placeholder: "JSON goes here"
    })),
    buttons: [{
      label: 'Import Conversation',
      onClick: () => {
        const conversations = JSON.parse(convoJSON);
        for (const name in conversations) {
          dispatch({
            type: 'ADD_CONVERSATION',
            conversation: conversations[name]
          });
        }
        dispatch({
          type: 'DISMISS_MODAL'
        });
      }
    }],
    style: {}
  });
};
module.exports = ImportManyJSONModal;