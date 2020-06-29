<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-plugins-kibana\_utils-common-state\_containers](./kibana-plugin-plugins-kibana_utils-common-state_containers.md)

## kibana-plugin-plugins-kibana\_utils-common-state\_containers package

State containers are Redux-store-like objects meant to help you manage state in your services or apps. Refer to [guides and examples](https://github.com/elastic/kibana/tree/master/src/plugins/kibana_utils/docs/state_containers) for more info

## Functions

|  Function | Description |
|  --- | --- |
|  [createStateContainer(defaultState)](./kibana-plugin-plugins-kibana_utils-common-state_containers.createstatecontainer.md) | Creates a state container without transitions and without selectors. |
|  [createStateContainer(defaultState, pureTransitions)](./kibana-plugin-plugins-kibana_utils-common-state_containers.createstatecontainer_1.md) | Creates a state container with transitions, but without selectors |
|  [createStateContainer(defaultState, pureTransitions, pureSelectors, options)](./kibana-plugin-plugins-kibana_utils-common-state_containers.createstatecontainer_2.md) | Creates a state container with transitions and selectors |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [BaseStateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.basestatecontainer.md) | Base state container shape without transitions or selectors |
|  [CreateStateContainerOptions](./kibana-plugin-plugins-kibana_utils-common-state_containers.createstatecontaineroptions.md) | State container options |
|  [ReduxLikeStateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.reduxlikestatecontainer.md) | Fully featured state container which matches Redux store interface. Extends [StateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md) Allows to use state container with redux libraries |
|  [StateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md) | Fully featured state container with [Selectors](./kibana-plugin-plugins-kibana_utils-common-state_containers.selector.md) and . Extends [BaseStateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.basestatecontainer.md) |

## Variables

|  Variable | Description |
|  --- | --- |
|  [createStateContainerReactHelpers](./kibana-plugin-plugins-kibana_utils-common-state_containers.createstatecontainerreacthelpers.md) | Creates helpers for using [State Containers](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md) with react Refer to [guide](https://github.com/elastic/kibana/blob/master/src/plugins/kibana_utils/docs/state_containers/react.md) for details |
|  [useContainerSelector](./kibana-plugin-plugins-kibana_utils-common-state_containers.usecontainerselector.md) | React hook to apply selector to state container to extract only needed information. Will re-render your component only when the section changes. |
|  [useContainerState](./kibana-plugin-plugins-kibana_utils-common-state_containers.usecontainerstate.md) | React hooks that returns the latest state of a [StateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md)<!-- -->. |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [BaseState](./kibana-plugin-plugins-kibana_utils-common-state_containers.basestate.md) | Base [StateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md) state shape |
|  [Comparator](./kibana-plugin-plugins-kibana_utils-common-state_containers.comparator.md) | Used to compare state. see [useContainerSelector](./kibana-plugin-plugins-kibana_utils-common-state_containers.usecontainerselector.md) |
|  [Connect](./kibana-plugin-plugins-kibana_utils-common-state_containers.connect.md) | Similar to <code>connect</code> from react-redux, allows to map state from state container to component's props |
|  [Dispatch](./kibana-plugin-plugins-kibana_utils-common-state_containers.dispatch.md) | Redux like dispatch |
|  [EnsurePureSelector](./kibana-plugin-plugins-kibana_utils-common-state_containers.ensurepureselector.md) |  |
|  [EnsurePureTransition](./kibana-plugin-plugins-kibana_utils-common-state_containers.ensurepuretransition.md) |  |
|  [MapStateToProps](./kibana-plugin-plugins-kibana_utils-common-state_containers.mapstatetoprops.md) | State container state to component props mapper. See [Connect](./kibana-plugin-plugins-kibana_utils-common-state_containers.connect.md) |
|  [Middleware](./kibana-plugin-plugins-kibana_utils-common-state_containers.middleware.md) | Redux like Middleware |
|  [PureSelector](./kibana-plugin-plugins-kibana_utils-common-state_containers.pureselector.md) |  |
|  [PureSelectorsToSelectors](./kibana-plugin-plugins-kibana_utils-common-state_containers.pureselectorstoselectors.md) |  |
|  [PureSelectorToSelector](./kibana-plugin-plugins-kibana_utils-common-state_containers.pureselectortoselector.md) |  |
|  [Reducer](./kibana-plugin-plugins-kibana_utils-common-state_containers.reducer.md) | Redux like Reducer |
|  [Selector](./kibana-plugin-plugins-kibana_utils-common-state_containers.selector.md) |  |
|  [UnboxState](./kibana-plugin-plugins-kibana_utils-common-state_containers.unboxstate.md) | Utility type for inferring state shape from [StateContainer](./kibana-plugin-plugins-kibana_utils-common-state_containers.statecontainer.md) |
