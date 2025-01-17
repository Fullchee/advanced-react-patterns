// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useControlledSwitchWarning({isControlled, componentName, propName}) {
  // we only care about the initial value, no need to set the value again
  const {current: wasControlled} = React.useRef(isControlled)

  // 2. Passing a value for `on` and later passing `undefined` or `null`
  // 3. Passing `undefined` or `null` for `on` and later passing a value
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    const initialStateName = wasControlled ? 'controlled' : 'uncontrolled'
    const endStateName = wasControlled ? 'uncontrolled' : 'controlled'
    warning(
      !((!wasControlled && isControlled) || (wasControlled && !isControlled)),
      `Warning: ${componentName} is changing from ${initialStateName} to ${endStateName}. Check the prop '${propName}'`,
    )
    return () => {}
  }, [componentName, isControlled, propName, wasControlled])
}

function useReadOnlyWarning({onChange, readOnly, isControlled}) {
  // use this bool or a useCallback so that the useEffect doesn't get called every render
  const hasOnChange = Boolean(onChange)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    warning(
      !(!hasOnChange && isControlled && !readOnly),
      'Warning: Failed prop type: You provided a `on` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.',
    )
  }, [hasOnChange, isControlled, readOnly])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const isControlled = controlledOn != null
  const on = isControlled ? controlledOn : state.on

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning({
      isControlled,
      componentName: 'useToggle',
      propName: 'on',
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReadOnlyWarning({onChange, readOnly, isControlled})
  }

  function dispatchWithOnChange(action) {
    if (!isControlled) {
      dispatch(action)
    }
    const newState = reducer({...state, on}, action)
    onChange?.(newState, action)
  }
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    readOnly,
  })
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(null)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
