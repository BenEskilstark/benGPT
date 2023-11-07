const React = require('react');
const {
  createModelParams,
  getModelParamBounds
} = require('../gpt');
const {
  Slider,
  Button,
  TextField,
  Dropdown
} = require('bens_ui_components');
const ImportJSONModal = require('./ImportJSONModal.react');
const {
  config
} = require('../config');
const {
  deepCopy
} = require('bens_utils').helpers;
const {
  useEffect,
  useState,
  useMemo
} = React;
const ThreadTitle = props => {
  const {
    state,
    dispatch,
    conversation,
    name
  } = props;
  const [showParams, setShowParams] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      boxShadow: state.selectedConversation == name ? '0 0 10px 10px #FAEBD7' : 'none',
      backgroundColor: state.selectedConversation == name ? '#FAEBD7' : 'inherit'
    },
    onClick: () => {
      if (state.selectedConversation != name) {
        dispatch({
          type: 'SELECT_CONVERSATION',
          selectedConversation: name
        });
      }
    }
  }, state.selectedConversation == name ? /*#__PURE__*/React.createElement(TextField, {
    value: name,
    onChange: val => {
      dispatch({
        type: 'SET_CONVERSATION_NAME',
        oldName: name,
        newName: val
      });
    }
  }) : name, /*#__PURE__*/React.createElement(Button, {
    label: showParams ? 'Hide' : "Edit",
    style: {
      border: 'none',
      backgroundColor: 'inherit',
      display: state.selectedConversation != name ? 'none' : 'inline',
      padding: 2,
      cursor: 'pointer',
      fontSize: 10
    },
    onClick: () => {
      if (Object.keys(conversation.modelParams).length == 0) {
        dispatch({
          type: 'UPDATE_CONVERSATION',
          conversation: {
            ...conversation,
            modelParams: createModelParams()
          }
        });
      }
      setShowParams(!showParams);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "\u274C",
    style: {
      display: state.selectedConversation != name ? 'none' : 'inline',
      border: 'none',
      backgroundColor: 'inherit',
      float: 'right',
      cursor: 'pointer',
      fontSize: 10
    },
    onClick: () => {
      dispatch({
        type: 'DELETE_CONVERSATION',
        name
      });
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12
    }
  }, conversation.tokens, "/", conversation.modelParams.max_tokens, " tokens"), showParams && state.selectedConversation == name ? /*#__PURE__*/React.createElement(ModelParams, {
    conversation: conversation,
    dispatch: dispatch
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: state.selectedConversation != name ? 'none' : 'inline'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Clone",
    style: {
      width: '33%',
      fontSize: 15
    },
    onClick: () => {
      dispatch({
        type: 'ADD_CONVERSATION',
        conversation: {
          ...deepCopy(conversation),
          name: 'conversation ' + (Object.keys(state.conversations).length + 1)
        },
        shouldSelect: true
      });
    }
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      width: '33%',
      fontSize: 15
    },
    label: "Copy",
    onClick: () => {
      navigator.clipboard.writeText(JSON.stringify(conversation));
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Import",
    style: {
      width: '33%',
      fontSize: 15
    },
    onClick: () => {
      dispatch({
        type: 'SET_MODAL',
        modal: /*#__PURE__*/React.createElement(ImportJSONModal, {
          conversation: conversation,
          dispatch: dispatch
        })
      });
    }
  })));
};
const ModelParams = props => {
  const {
    conversation,
    dispatch
  } = props;
  const {
    modelParams
  } = conversation;
  const bounds = getModelParamBounds(conversation.model);
  const sliders = [];
  for (const param in bounds) {
    sliders.push( /*#__PURE__*/React.createElement(Slider, {
      style: {
        fontSize: 10,
        display: 'flex',
        justifyContent: 'space-between',
        marginRight: 2
      },
      key: "slider_" + param,
      label: param,
      min: bounds[param].min,
      max: bounds[param].max,
      value: modelParams[param],
      step: bounds[param].inc,
      onChange: value => {
        dispatch({
          type: 'UPDATE_CONVERSATION',
          conversation: {
            ...conversation,
            modelParams: {
              ...conversation.modelParams,
              [param]: value
            }
          }
        });
      },
      noNumberField: false,
      noOriginalValue: true,
      isFloat: bounds[param].inc < 1
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {}
  }, "Model:", /*#__PURE__*/React.createElement(Dropdown, {
    options: Object.keys(config.modelToMaxTokens),
    onChange: model => {
      dispatch({
        type: 'UPDATE_CONVERSATION',
        conversation: {
          ...conversation,
          model,
          modelParams: {
            ...conversation.modelParams,
            max_tokens: config.modelToMaxTokens[model]
          }
        }
      });
    }
  }), sliders);
};
module.exports = ThreadTitle;