const React = require('react');
const {
  TextArea,
} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const Message = (props) => {
  const {roleNames, index, onEdit, name} = props;
  const {role, content} = props.message;

  useEffect(() => {
    const elem = document.getElementById("text_area_" + name + "_" + index);
    // if (elem.style.height != elem.scrollHeight + 'px') {
      if (index == 1) {
        console.log(elem.style.height, elem.scrollHeight);
      }
      elem.style.height = 0;
      setTimeout(() => {
        elem.style.height = elem.scrollHeight + 'px';
      }, 0);
    // }
  }, [name]);

  useEffect(() => {
    const elem = document.getElementById("text_area_" + name + "_" + index);
    elem.style.height = elem.scrollHeight + 'px';
  }, [content]);

  let displayContent = content;
  if (onEdit) {
    displayContent = (
      <TextArea
        id={"text_area_" + name + "_" + index}
        style={{
          border: 'none',
          font: 'inherit',
          resize: 'none',
          width: '100%',
          height: 'auto',
          flex: 1,
        }}
        value={content}
        onChange={(value) => {
          onEdit({role, content: value}, index);
        }}
        onFocus={() => {
          setTimeout(() => {
            dispatch({type: 'SET_EDITING_PREVIOUS', isEditingPreviousMessage: true});
          }, 100);
        }}
        onBlur={() => {
          dispatch({type: 'SET_EDITING_PREVIOUS', isEditingPreviousMessage: false});
        }}
      />
    );
  }

  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        display: 'flex',
        // flex: 1,
        fontSize: 14,
      }}
    >
    <b>{(roleNames && roleNames[role]) ? roleNames[role] : role}</b>: {displayContent}
    </div>
  );
};

module.exports = Message;

