const React = require('react');
const {
  TextArea
} = require('bens_ui_components');
const {
  debounce
} = require('bens_utils').helpers;
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
const {
  useEffect,
  useState,
  useMemo
} = React;
const resetSize = (name, index) => {
  const elem = document.getElementById("text_area_" + name + "_" + index);
  if (!elem) return;
  elem.style.height = 0;
  setTimeout(() => {
    elem.style.height = elem.scrollHeight + 'px';
  }, 0);
};
const debounceResetSize = debounce(resetSize, 300);
const Message = props => {
  const {
    roleNames,
    index,
    onEdit,
    name
  } = props;
  const {
    role,
    content
  } = props.message;
  useEffect(() => {
    resetSize(name, index);
  }, [name]);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!isEditing) return;
    const elem = document.getElementById("text_area_" + name + "_" + index);
    if (!elem) return;
    elem.focus();
  }, [isEditing]);
  useEffect(() => {
    const elem = document.getElementById("text_area_" + name + "_" + index);
    if (!elem) return;
    elem.style.height = elem.scrollHeight + 'px';
    debounceResetSize(name, index);
  }, [content, isEditing]);
  let displayContent = content;
  if (onEdit && isEditing) {
    displayContent = /*#__PURE__*/React.createElement(TextArea, {
      id: "text_area_" + name + "_" + index,
      style: {
        border: 'none',
        resize: 'none',
        width: '100%',
        height: 'auto',
        flex: 1
      },
      value: content,
      onChange: value => {
        onEdit({
          role,
          content: value
        }, index);
      },
      onBlur: () => {
        setIsEditing(false);
        dispatch({
          type: 'SET_EDITING_PREVIOUS',
          isEditingPreviousMessage: false
        });
      }
    });
  } else {
    displayContent = /*#__PURE__*/React.createElement("div", {
      style: {
        border: 'none',
        resize: 'none',
        width: '90%',
        height: 'auto',
        marginRight: 35,
        maxWidth: 800,
        flex: 1
      },
      onClick: () => {
        const isTextSelected = window.getSelection().toString().length > 0;
        if (isTextSelected) return;
        setTimeout(() => {
          setIsEditing(true);
          dispatch({
            type: 'SET_EDITING_PREVIOUS',
            isEditingPreviousMessage: true
          });
        }, 100);
      }
    }, /*#__PURE__*/React.createElement(Markdown, {
      rehypePlugins: [[rehypeHighlight, {
        ignoreMissing: true
      }]]
    }, content));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      // whiteSpace: 'pre-wrap',
      display: 'flex',
      // flex: 1,
      fontSize: 14,
      marginBottom: 10,
      width: 900
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      minWidth: 70,
      textAlign: "left"
    }
  }, roleNames && roleNames[role] ? roleNames[role] : role), " \xA0", displayContent);
};
module.exports = Message;