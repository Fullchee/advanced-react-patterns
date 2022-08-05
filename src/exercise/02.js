// Compound Components
// http://localhost:3000/isolated/exercise/02.js

// Starter code
// https://github.com/kentcdodds/advanced-react-patterns/blob/main/src/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

// the children we can pass to `<Toggle>`
const ToggleOn = ({on, children}) => on && children
const ToggleOff = ({on, children}) => !on && children
const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />
const ALLOWED_CHILDREN = [ToggleOn, ToggleOff, ToggleButton]

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(children, (child, index) => {
    if (!ALLOWED_CHILDREN.includes(child.type)) {
      return child
    }

    // // if you just want to ignore DOM elements
    // if (typeof child.type === 'string') {
    //   return child
    // }

    // need to use React.cloneElement
    // React doesn't let us directly edit child.props
    return React.cloneElement(child, {
      id: `i-am-child-${index}`,
      on,
      toggle,
    })
  })
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <ToggleButton />
        <span>Hello</span>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
