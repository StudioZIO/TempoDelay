import type { KeyboardEvent } from 'react';

const HUB_SEARCH = 'https://studiozio.vercel.app/search/';

/**
 * The header's search box, the same one every StudioZIO site carries.
 *
 * It does not search. The index lives on the hub and covers all four
 * properties, so this box hands what was typed to the hub's search page --
 * which is why the box behaves identically wherever a visitor happens to be
 * standing.
 *
 * The jump is made on Enter rather than by a <form>, because every site sets
 * form-action 'none' in its CSP: a form would look right, submit nothing and
 * report nothing. Two copies ship, one in the row and one inside the compact
 * menu, since the row is put away on a phone and the box should not be.
 */
export const HeaderSearch = ({ variant }: { variant: 'bar' | 'panel' }) => {
  const jump = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const query = event.currentTarget.value.trim();
    window.location.href = query ? `${HUB_SEARCH}?q=${encodeURIComponent(query)}` : HUB_SEARCH;
  };

  return (
    <div className={`header-search header-search--${variant}`}>
      <input
        className="field header-search-field"
        type="search"
        name="q"
        aria-label="Search StudioZIO"
        placeholder="Search"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={jump}
      />
    </div>
  );
};
