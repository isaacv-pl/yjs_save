/* eslint-env browser */

// @ts-ignore
import CodeMirror from 'codemirror'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { CodeMirrorBinding } from 'y-codemirror'
import 'codemirror/mode/clike/clike.js'

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    `${location.protocol === 'http:' ? 'ws:' : 'wss:'}${location.host}`,
    'codemirror',
    ydoc
  )
  const yText = ydoc.getText('codemirror')
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  const editor = CodeMirror(editorContainer, {
    mode: 'text/x-java',
    lineNumbers: true
  })

  const binding = new CodeMirrorBinding(yText, editor, provider.awareness)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, yText, binding }
})

document.getElementById("form").onsubmit = function(evt){
      document.getElementById("editortext").value = editor.save();
      console.log("TEXTAREA has the following: "+document.getElementById("editortext").value);
}
