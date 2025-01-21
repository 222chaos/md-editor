// Components
export type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from './components/editable';

export { DefaultPlaceholder, Editable } from './components/editable';

export { DefaultElement } from './components/element';
export { DefaultLeaf } from './components/leaf';
export { Slate } from './components/slate';

// Hooks
export { useComposing } from './hooks/use-composing';
export { useEditor } from './hooks/use-editor';
export { useFocused } from './hooks/use-focused';
export { useReadOnly } from './hooks/use-read-only';
export { useSelected } from './hooks/use-selected';
export { useSlate, useSlateWithV } from './hooks/use-slate';
export { useSlateSelection } from './hooks/use-slate-selection';
export { useSlateSelector } from './hooks/use-slate-selector';
export { useSlateStatic } from './hooks/use-slate-static';

// Plugin
export { ReactEditor } from './plugin/react-editor';
export { withReact } from './plugin/with-react';

// Utils
export { NODE_TO_INDEX, NODE_TO_PARENT } from 'slate-dom';
