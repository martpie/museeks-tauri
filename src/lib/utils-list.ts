import { DeepReadonly } from 'solid-js/store';
import { isAltKey, isCtrlKey, isLeftClick, isRightClick } from './utils-events';

type ListItem = {
  id: string;
};

/**
 * Data agnostic super-function able to retrieve the right user-selection based
 * on a list of item, and an event. Supports modifiers (like shift, cmd/ctrl, etc)
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
        // retrieve the first and the last element of the list
        let selectedMinIndex: null | number = null;
        let selectedMaxIndex: null | number = null;
        let clickedIndex: null | number = null;

        for (const [index, item] of list.entries()) {
          if (selectedMinIndex === null && selected.has(item.id)) {
            selectedMinIndex = index;
            selectedMaxIndex = index;
          } else if (selected.has(item.id)) {
            selectedMaxIndex = index;
          }

          if (id === item.id) {
            clickedIndex = index;
          }
        }

        // type check, should not happen but still
        if (
          selectedMinIndex === null ||
          selectedMaxIndex === null ||
          clickedIndex === null
        ) {
          return selected;
        }

        // now, return all the IDs of all the indices between "min/max" and "clicked"
        const selection = new Set(selected);
        const min = Math.min(clickedIndex, selectedMinIndex);
        const max = Math.max(clickedIndex, selectedMaxIndex);

        console.log();

        for (let i = min; i <= max; i++) {
          selection.add(list[i].id);
        }

        return selection;
      }
    } else if (!altKey) {
      // Scenario 3. Just standard click
      return new Set([id]);
    }
  }

  // Otherwise, nothing to be done
  return selected;
}
