const React = require('react');
const {
  Button,
  Modal,
  Divider,
  TextArea,
  TextField,
  useHotKeyHandler,
  hotKeyReducer,
  useEnhancedReducer,
  Dropdown,
  Checkbox
} = require('bens_ui_components');
const Message = require('./Message.react');
const {
  isMobile
} = require('bens_utils').platform;
const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;

/**
 *  type Conversation = {
 *    messages: Array<{role: 'system' | 'user' | 'assistant', content: string}>,
 *    name: string, // the name of this conversation
 *    placeholder: ?string, // optional placeholder prompt
 *    roleNames: ?Object, // optional object mapping roles to display names for them
 *    ...params // additional params for GPT API
 *  }
 */

function Chat(props) {
  const {
    conversation,
    onSubmit,
    // (Message, toAPI) => void,
    // optional
    submitOnEnter,
    // boolean for whether to use the enter hotkey
    onClear,
    // only needed with showClear
    onUndo,
    // also tied to showClear
    onEdit,
    // if provided, each already-sent message is editable (message, index) => void
    style,
    showRole,
    showClear,
    showSystem
  } = props;
  const messages = [];
  for (let i = 0; i < conversation.messages.length; i++) {
    if (conversation.messages[i].role == 'system' && !showSystem) continue;
    messages.push( /*#__PURE__*/React.createElement(Message, {
      onEdit: onEdit,
      index: i,
      name: conversation.name,
      message: conversation.messages[i],
      key: "message_" + i,
      roleNames: conversation.roleNames
    }));
  }
  const [curPrompt, setCurPrompt] = useState('');
  const [role, setRole] = useState('user');

  // auto scroll on messages received
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    var _messagesEndRef$curre;
    (_messagesEndRef$curre = messagesEndRef.current) === null || _messagesEndRef$curre === void 0 ? void 0 : _messagesEndRef$curre.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // text input of different sizes
  const [showBigTextBox, setShowBigTextBox] = useState(false);
  const [showTextExpander, setShowTextExpander] = useState(false);
  let textInput = /*#__PURE__*/React.createElement("div", {
    style: {
      width: 800,
      position: 'relative'
    }
  }, showBigTextBox ? /*#__PURE__*/React.createElement(TextArea, {
    value: curPrompt,
    style: {
      resize: 'none',
      width: '100%',
      marginBottom: -8
    },
    rows: 10,
    placeholder: conversation.placeholder ?? "ask the assistant anything",
    onChange: setCurPrompt,
    onFocus: () => setShowTextExpander(true),
    onBlur: () => {
      setTimeout(() => setShowTextExpander(false), 500);
    }
  }) : /*#__PURE__*/React.createElement(TextField, {
    value: curPrompt,
    style: {
      width: '100%',
      height: 25
    },
    placeholder: conversation.placeholder ?? "ask the assistant anything",
    onChange: setCurPrompt,
    onFocus: () => setShowTextExpander(true),
    onBlur: () => {
      setTimeout(() => setShowTextExpander(false), 500);
    }
  }), showTextExpander ? /*#__PURE__*/React.createElement(Button, {
    label: showBigTextBox ? 'V' : '^',
    onClick: () => setShowBigTextBox(!showBigTextBox),
    style: {
      position: 'absolute',
      height: 25,
      width: 30,
      top: -25,
      left: 0
    }
  }) : null);
  const [submitToAPI, setSubmitToAPI] = useState(true);

  // press enter to submit
  const [hotKeys, hotKeyDispatch, getHotKeyState] = useEnhancedReducer(hotKeyReducer);
  useHotKeyHandler({
    dispatch: hotKeyDispatch,
    getState: getHotKeyState
  });
  useEffect(() => {
    hotKeyDispatch({
      type: 'SET_HOTKEY',
      key: 'enter',
      press: 'onKeyDown',
      fn: () => {
        if (!showBigTextBox && submitOnEnter) {
          submitPrompt(role, onSubmit, curPrompt, setCurPrompt, submitToAPI);
        }
      }
    });
  }, [curPrompt, role, showBigTextBox, submitToAPI, conversation, submitOnEnter]);

  // for calculating the height of the message area vs input area
  let inputAreaHeight = 45;
  if (showBigTextBox) {
    inputAreaHeight = 180;
  }
  if (isMobile()) {
    inputAreaHeight += 25;
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 400,
      margin: 'auto',
      marginTop: 15,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      // border: '1px solid black',
      backgroundColor: 'white',
      width: '100%',
      height: `calc(100% - ${inputAreaHeight}px`,
      overflowY: 'scroll',
      padding: 6,
      paddingBottom: 64,
      boxShadow: 'inset 0.3em -0.3em 0.5em rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, messages, /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  })), isMobile() ? textInput : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'baseline'
    }
  }, showRole ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
    style: {
      width: 70,
      height: 25
    },
    options: ['user', 'system', 'assistant'],
    selected: role,
    onChange: setRole
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Submit",
    checked: submitToAPI,
    onChange: setSubmitToAPI,
    style: {
      display: 'inherit'
    }
  })) : null, !isMobile() ? textInput : null, /*#__PURE__*/React.createElement(Button, {
    label: "Submit",
    style: {
      fontSize: 16
    },
    onClick: () => {
      submitPrompt(role, onSubmit, curPrompt, setCurPrompt, submitToAPI);
    }
  }), showClear ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    label: "Undo",
    style: {
      fontSize: 16
    },
    onClick: onUndo
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Clear",
    style: {
      fontSize: 16
    },
    onClick: onClear
  })) : null));
}
const submitPrompt = (role, onSubmit, curPrompt, setCurPrompt, submitToAPI) => {
  onSubmit({
    role,
    content: curPrompt
  }, submitToAPI);
  setCurPrompt('');
};
module.exports = Chat;