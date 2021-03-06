import { createElement } from 'preact';
import classnames from 'classnames';
import { useMemo, useState, useEffect } from 'preact/hooks';
import propTypes from 'prop-types';

/** */
import { withServices } from '../util/service-context';
/** */

const defaultListFormatter = item => item;

/**
 * @template T
 * @typedef AutocompleteListProps
 * @prop {number} [activeItem] - The index of the highlighted item.
 * @prop {string} [id] - Optional unique HTML attribute id. This can be used
 *   for parent `aria-controls` coupling.
 * @prop {string} [itemPrefixId] - Optional unique HTML attribute id prefix
 *   for each item in the list. The final value of each items' id is
 *   `{itemPrefixId}{activeItem}`
 * @prop {T[]} list - The list of items to render. This can be a simple
 *   list of strings or a list of objects when used with listFormatter.
 * @prop {(item: T, index?: number) => any} [listFormatter] - An optional formatter
 *   to render each item inside an <li> tag This is useful if the list is an array of
 *   objects rather than just strings.
 * @prop {(item: T) => void} onSelectItem - Callback when an item is clicked with
 *   the mouse.
 * @prop {boolean} [open] - Is the list open or closed?
 */

/**
 * Custom autocomplete component. Use this in conjunction with an <input> field.
 * To make this component W3 accessibility compliant, it is is intended to be
 * coupled to an <input> field or the TagEditor component and can not be
 * used by itself.
 *
 * Modeled after the "ARIA 1.1 Combobox with Listbox Popup"
 *
 * @template T
 * @param {AutocompleteListProps<T>} props
 */
export default function AutocompleteList({
  activeItem = -1,
  id,
  itemPrefixId,
  list,
  listFormatter = defaultListFormatter,
  onSelectItem,
  open = false,
  tags: tagsService
}) {
  // console.log("id: ", id);
  // console.log("itemPrefixId: ", itemPrefixId);
  //console.log("list: ", list);

  // const [tooltips, setTooltips] = useState(['']);

  /** */
  const tagMap = tagsService.getTagMap();
  /** */

  // const fetchTooltips = async () => {
  //     const response = await fetch('https://raw.githubusercontent.com/MaastrichtU-IDS/cbcm-ontology/master/working_copy/tooltips1.csv');
  //     const responseText = await response.text();
  //     const splittedText = await responseText.split('\n');
  //     setTooltips(splittedText);
  // };

  // useEffect(() => {
  //   fetchTooltips();
  // },[]);

  const items = useMemo(() => {
    return list.map((item, index) => {
      // only add an id if itemPrefixId is passed
      const props = itemPrefixId ? { id: `${itemPrefixId}${index}` } : {};
      // console.log("item: ", item);
      // console.log("tagMap[item]: ", tagMap[item]);
      // console.log("index: ", index);
      // console.log("tagMap[item][tooltip]: ", tagMap[item]["tooltip"]);
      // console.log("list: ", list);
      return (
        // The parent <input> field should capture keyboard events
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <li
            key={`autocomplete-list-${index}`}
            title={(item === undefined || tagMap[item] === undefined) ? "No tooltip" : tagMap[item]["tooltip"]}
            role="option"
            aria-selected={(activeItem === index).toString()}
            className={classnames(
              {
                'is-selected': activeItem === index,
              },
              `autocomplete-list__li${tagMap[item]["type"]}`
              //'autocomplete-list__li'
            )}
            onClick={() => {
              // console.log("item: ", item);
              onSelectItem(item);
            }}
            {...props}
          >
              {listFormatter(item, index)}
          </li>
      );
    });
  }, [activeItem, itemPrefixId, list, listFormatter, onSelectItem]);

  const props = id ? { id } : {}; // only add the id if its passed
  const isHidden = list.length === 0 || !open;
  return (//TODO needs refactoring
    <div style="background-color: #ffffff;
                height: 300px;
                overflow-x: hidden;
                overflow-y: auto;
                text-align: left;
                padding: 20px;"
      className={classnames(
        {
          'is-hidden': isHidden,
        },
        'autocomplete-list'
      )}
    >
      <ul
        className="autocomplete-list__items"
        tabIndex={-1}
        aria-label="Suggestions"
        role="listbox"
        {...props}
      >
        {items}
      </ul>
    </div>
  );
}

AutocompleteList.propTypes = {
  activeItem: propTypes.number,
  id: propTypes.string,
  itemPrefixId: propTypes.string,
  list: propTypes.array.isRequired,
  listFormatter: propTypes.func,
  onSelectItem: propTypes.func.isRequired,
  open: propTypes.bool,
  tags: propTypes.object.isRequired,
};

AutocompleteList.injectedProps = ['tags'];

withServices(AutocompleteList);