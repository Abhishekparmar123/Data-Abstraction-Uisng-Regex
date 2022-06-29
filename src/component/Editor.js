import React from 'react'
import RichTextEditor from 'react-rte'

function EditorComponent({text, value, setValue, placeholder}) {
  return (
    <>
      <h1 className='my-3 is-size-5 has-text-weight-semibold has-text-centered'>{text}</h1>
      <RichTextEditor
        value={value}
        onChange={(e) => setValue(e)}
        placeholder={placeholder}
        editorStyle={{height:300, border:'1px solid grey'}}
        toolbarStyle={{border:'1px solid grey', margin:0, padding:10}}
      />
    </>
  )
}

export default EditorComponent