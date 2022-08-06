// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

// Starter file: https://github.com/kentcdodds/advanced-react-patterns/blob/main/src/exercise/03.js
// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

// 🐨 create your ToggleContext context here
// 📜 https://reactjs.org/docs/context.html#reactcreatecontext

const ToggleContext = React.createContext()
ToggleContext.displayName = 'ToggleContext'

function useToggle() {
  const context = React.useContext(ToggleContext)
  if (!context) {
    throw new Error('useToggle must be used within a <Toggle />')
  }
  return context
}

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {children}
    </ToggleContext.Provider>
  )
}

function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

// 🐨 do the same thing to this that you did to the ToggleOn component
function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

// 🐨 get `on` and `toggle` from the ToggleContext with `useContext`
function ToggleButton({...props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

const App = () => <ToggleButton />

export default App

/*
eslint
  no-unused-vars: "off",
*/
