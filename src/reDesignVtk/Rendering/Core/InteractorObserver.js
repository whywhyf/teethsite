import _defineProperty from '@babel/runtime/helpers/defineProperty';
import macro from '@kitware/vtk.js/macro.js';
import vtkRenderWindowInteractor from './RenderWindowInteractor.js';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var vtkErrorMacro = macro.vtkErrorMacro,
    VOID = macro.VOID; // ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Description:
// Transform from world to display coordinates.

function computeWorldToDisplay(renderer, x, y, z) {
  var view = renderer.getRenderWindow().getViews()[0];
  return view.worldToDisplay(x, y, z, renderer);
} //----------------------------------------------------------------------------
// Description:
// Transform from display to world coordinates.


function computeDisplayToWorld(renderer, x, y, z) {
  var view = renderer.getRenderWindow().getViews()[0];
  return view.displayToWorld(x, y, z, renderer);
} // ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------


var STATIC = {
  computeWorldToDisplay: computeWorldToDisplay,
  computeDisplayToWorld: computeDisplayToWorld
}; // ----------------------------------------------------------------------------
// vtkInteractorObserver methods
// ----------------------------------------------------------------------------

function vtkInteractorObserver(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorObserver');

  var superClass = _objectSpread({}, publicAPI); //----------------------------------------------------------------------------


  function unsubscribeFromEvents() {
    while (model.subscribedEvents.length) {
      model.subscribedEvents.pop().unsubscribe();
    }
  } //----------------------------------------------------------------------------
  // Check what events we can handle and register callbacks


  function subscribeToEvents() {
    vtkRenderWindowInteractor.handledEvents.forEach(function (eventName) {
      if (publicAPI["handle".concat(eventName)]) {
        model.subscribedEvents.push(model.interactor["on".concat(eventName)](function (callData) {
          if (model.processEvents) {
            return publicAPI["handle".concat(eventName)](callData);
          }

          return VOID;
        }, model.priority));
      }
    });
  } //----------------------------------------------------------------------------
  // Public API methods
  //----------------------------------------------------------------------------


  publicAPI.setInteractor = function (i) {
    if (i === model.interactor) {
      return;
    }

    unsubscribeFromEvents();
    model.interactor = i;

    if (i && model.enabled) {
      subscribeToEvents();
    }

    publicAPI.modified();
  }; //----------------------------------------------------------------------------


  publicAPI.setEnabled = function (enable) {
    if (enable === model.enabled) {
      return;
    }

    unsubscribeFromEvents();

    if (enable) {
      if (model.interactor) {
        subscribeToEvents();
      } else {
        vtkErrorMacro("\n          The interactor must be set before subscribing to events\n        ");
      }
    }

    model.enabled = enable;
    publicAPI.modified();
  }; //----------------------------------------------------------------------------
  // Description:
  // Transform from display to world coordinates.


  publicAPI.computeDisplayToWorld = function (renderer, x, y, z) {
    if (!renderer) {
      return null;
    }

    return model.interactor.getView().displayToWorld(x, y, z, renderer);
  }; //----------------------------------------------------------------------------
  // Description:
  // Transform from world to display coordinates.


  publicAPI.computeWorldToDisplay = function (renderer, x, y, z) {
    if (!renderer) {
      return null;
    }

    return model.interactor.getView().worldToDisplay(x, y, z, renderer);
  }; //----------------------------------------------------------------------------


  publicAPI.setPriority = function (priority) {
    var modified = superClass.setPriority(priority);

    if (modified && model.interactor) {
      unsubscribeFromEvents();
      subscribeToEvents();
    }
  };
} // ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------


var DEFAULT_VALUES = {
  enabled: true,
  interactor: null,
  priority: 0.0,
  processEvents: true,
  subscribedEvents: []
}; // ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues); // Object methods

  macro.obj(publicAPI, model);
  macro.event(publicAPI, model, 'InteractionEvent');
  macro.event(publicAPI, model, 'StartInteractionEvent');
  macro.event(publicAPI, model, 'EndInteractionEvent'); // Create get-only macros

  macro.get(publicAPI, model, ['interactor', 'enabled']); // Create get-set macros

  macro.setGet(publicAPI, model, ['priority', 'processEvents']); // For more macro methods, see "Sources/macro.js"
  // Object specific methods

  vtkInteractorObserver(publicAPI, model);
} // ----------------------------------------------------------------------------

var newInstance = macro.newInstance(extend, 'vtkInteractorObserver'); // ----------------------------------------------------------------------------

var vtkInteractorObserver$1 = _objectSpread({
  newInstance: newInstance,
  extend: extend
}, STATIC);

export default vtkInteractorObserver$1;
export { STATIC, extend, newInstance };
