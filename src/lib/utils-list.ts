import { DeepReadonly } from 'solid-js/store';
import { isAltKey, isCtrlKey, isLeftClick, isRightClick } from './utils-events';

type ListItem = {
  id: string;
};

/**
 * Super-function able to retrieve the right user-selection based on a list
 * of item, and modifiers (like shift, cmd/ctrl, etc)
 */
export async function smartSelect(
  list: DeepReadonly<Array<ListItem>>,
  selected: Set<string>,
  id: string,
  event: MouseEvent
): Promise<Set<string>> {
  const isSelectable = !selected.has(id);

  // Shortcut in case nothing needs to be changed
  if (!isSelectable && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
    return selected;
  }

  const ctrlKey = await isCtrlKey(event);
  const altKey = await isAltKey(event);
  const shiftKey = event.shiftKey;

  if (isLeftClick(event) || (isRightClick(event) && isSelectable)) {
    if (ctrlKey) {
      // Scenario 1. Add or remove single item via CMD/CTRL
      if (selected.has(id)) {
        selected.delete(id);
        return new Set(selected);
      } else {
        selected.add(id);
        return new Set(selected);
      }
    } else if (shiftKey) {
      // Scenario 2. Multi-select range
      if (selected.size === 0) {
        return new Set([id]);
      } else {
        // TODO: multiSelect(index);
        // from max/min to selected
      }
    } else if (!altKey) {
      // Scenario 3. Just standard click
      return new Set([id]);
    }
  }

  // Otherwise, nothing to be done
  return selected;
}
