import external from '../../externalModules';

const state = { activeManipulators: {} };

function addActiveManipulatorForElement(element, cancelFn) {
  const enabledElement = external.cornerstone.getEnabledElement(element);
  const enabledElementUUID = enabledElement.uuid;

  state.activeManipulators[enabledElementUUID] = cancelFn;
}

function removeActiveManipulatorForElement(element) {
  const enabledElement = external.cornerstone.getEnabledElement(element);
  const enabledElementUUID = enabledElement.uuid;
  const { activeManipulators } = state;

  delete activeManipulators[enabledElementUUID];
}

function cancelActiveManipulatorsForElement(element) {
  const enabledElement = external.cornerstone.getEnabledElement(element);
  const enabledElementUUID = enabledElement.uuid;
  _cancelActiveManipulatorsForElementUUID(enabledElementUUID);
}

function _cancelActiveManipulatorsForElementUUID(enabledElementUUID) {
  const { activeManipulators } = state;
  const cancelFn = activeManipulators[enabledElementUUID];

  if (typeof cancelFn === 'function') {
    cancelFn();
  }

  delete activeManipulators[enabledElementUUID];
}

function cancelActiveManipulators() {
  const { activeManipulators } = state;

  Object.keys(activeManipulators).forEach(enabledElementUUID =>
    _cancelActiveManipulatorsForElementUUID(enabledElementUUID)
  );
}

function _cornerstoneNewImageHandler(evt) {
  const eventData = evt.detail;
  const { element } = eventData;

  removeActiveManipulatorForElement(element);
}

function removeEnabledElementCallback(element) {
  const { NEW_IMAGE } = external.cornerstone.EVENTS;

  element.removeEventListener(NEW_IMAGE, _cornerstoneNewImageHandler);
  removeActiveManipulatorForElement(element);
}

//

// const enabledElements = cornerstoneTools.store.state.enabledElements;

// const cancelActiveManipulatorsForElement = cornerstoneTools.getModule(
//   'manipulatorState'
// ).setters.cancelActiveManipulatorsForElement;

// enabledElements.forEach(element => {
//   element.addEventListener('keydown', evt => {
//     if (evt.keyCode === 27) {
//       cancelActiveManipulatorsForElement(element);
//     }
//   });
// });

///

function enabledElementCallback(element) {
  const { NEW_IMAGE } = external.cornerstone.EVENTS;

  element.removeEventListener(NEW_IMAGE, _cornerstoneNewImageHandler);
  element.addEventListener(NEW_IMAGE, _cornerstoneNewImageHandler);
}

export default {
  setters: {
    // add/remove
    addActiveManipulatorForElement,
    removeActiveManipulatorForElement,

    // cancel
    cancelActiveManipulatorsForElement,
    cancelActiveManipulators,
  },
  state,
  enabledElementCallback,
  removeEnabledElementCallback,
};