import { createColumnHelper, createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, type ColumnDef, type Row, type FilterFn, type SortingFn, sortingFns } from '@tanstack/solid-table'
import ChronologyTable from './components/ChronologyTable'
import { createSignal, For } from 'solid-js';
import { permanentTeeth, primaryTeeth, type ToothData } from './data/toothData';

// Import the match-sorter utils for fuzzy filtering
// You'll need to install: npm install @tanstack/match-sorter-utils
import { rankItem, compareItems, type RankingInfo } from '@tanstack/match-sorter-utils';

// Extend the table types to include both fuzzy and exact filters
declare module '@tanstack/solid-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
    exact: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

function App() {
  return (
    <div class="min-h-screen bg-gray-900">
      <ReferenceTable />
      {/* <ChronologyTable /> */}
    </div>
  )
}

const columnHelper = createColumnHelper<ToothData>();

// Define a custom fuzzy filter function that will apply ranking info to rows
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

// Custom global fuzzy filter that searches across multiple fields
const globalFuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value) return true;

  const data = row.original;

  // Define all searchable fields
  const searchableFields = [
    data.name || '',
    data.type || '',
    data.position || '',
    data.side || '',
    data.eruption?.ageRange || '',
    data.shedding?.ageRange || '',
    data.rootCompletion?.ageRange || '',
    // Combined display text
    `${data.position} ${data.side} ${data.name}`,
  ];

  // Combine all fields into a single searchable string
  const combinedText = searchableFields.join(' ');

  // Use rankItem on the combined text
  const itemRank = rankItem(combinedText, value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
}

// Non-fuzzy exact string matching filter
const customGlobalFilter: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  if (!filterValue) return true;

  const searchTerm = filterValue.toLowerCase().trim();
  const data = row.original;

  // Define all searchable fields
  const searchableFields = [
    data.name?.toLowerCase() || '',
    data.type?.toLowerCase() || '',
    data.position?.toLowerCase() || '',
    data.side?.toLowerCase() || '',
    data.eruption?.ageRange?.toLowerCase() || '',
    data.shedding?.ageRange?.toLowerCase() || '',
    data.rootCompletion?.ageRange?.toLowerCase() || '',
    // You can also search the combined display text
    `${data.position} ${data.side} ${data.name}`.toLowerCase()
  ];

  // Check if any field contains the search term
  return searchableFields.some(field => field.includes(searchTerm));
};

const defaultColumns = [
  columnHelper.accessor('name', {
    id: 'name',
    header: () => {
      return (
        <span class="capitalize font-semibold text-gray-100">
          Tooth Name
        </span>
      )
    },
    cell: ({ cell, row }) => {
      const name = cell.renderValue();
      const position = row.original.position;
      const side = row.original.side;
      return (
        <div class="flex flex-col">
          <span class="capitalize font-medium text-gray-100">
            {position} {side} {name}
          </span>
          <span class="text-xs text-gray-400 mt-1">
            {row.original.type === 'primary' ? 'Primary' : 'Permanent'}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('type', {
    id: 'type',
    header: () => <span class="font-semibold text-gray-100">Type</span>,
    cell: ({ cell }) => {
      const type = cell.getValue();
      return (
        <span class={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${type === 'primary'
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
    },
  }),

  columnHelper.accessor('eruption.ageRange', {
    id: 'eruption',
    header: () => <span class="font-semibold text-gray-100">Eruption Age</span>,
    cell: ({ cell }) => (
      <span class="text-gray-200 font-medium">
        {cell.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor((row) => row.shedding?.ageRange,
    {
      id: 'shedding',
      header: () => <span class="font-semibold text-gray-100">Shedding Age</span>,
      cell: ({ cell }) => {
        const value = cell.getValue();
        return value ? (
          <span class="text-gray-200 font-medium">{value}</span>
        ) : (
          <span class="text-gray-500 italic">N/A</span>
        );
      },
    }),

  columnHelper.accessor('rootCompletion.ageRange', {
    id: 'rootCompletion',
    header: () => <span class="font-semibold text-gray-100">Root Completion</span>,
    cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? (
        <span class="text-gray-200 font-medium">{value}</span>
      ) : (
        <span class="text-gray-500 italic">N/A</span>
      );
    },
  }),
];

function ReferenceTable() {
  const [search, setSearch] = createSignal('');
  const [isFuzzySearch, setIsFuzzySearch] = createSignal(true);
  const [toothTypeFilter, setToothTypeFilter] = createSignal('all'); // 'all', 'primary', 'permanent'

  // Filter data based on tooth type selection
  const filteredData = () => {
    const allData = [...primaryTeeth, ...permanentTeeth];
    if (toothTypeFilter() === 'all') return allData;
    return allData.filter(tooth => tooth.type === toothTypeFilter());
  };

  const table = createSolidTable({
    get data() { return filteredData() },
    columns: defaultColumns,
    filterFns: {
      fuzzy: globalFuzzyFilter,
      exact: customGlobalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: isFuzzySearch() ? 'fuzzy' : 'exact',
    state: {
      get globalFilter() {
        return search()
      },
    },
    onGlobalFilterChange: setSearch
  })

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Dental Reference Table</h1>
          <p class="text-gray-400">Comprehensive tooth eruption and development timeline</p>
        </div>

        {/* Filters */}
        <div class="mb-8">
          <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            {/* Search Input */}
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                Search Teeth
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={isFuzzySearch()
                    ? "Try fuzzy search: 'uppr mlr', 'canin', 'prmry'..."
                    : "Search teeth with exact matching..."}
                  value={search()}
                  oninput={(e) => setSearch(e.currentTarget.value)}
                  class="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div class="flex flex-wrap gap-4 items-center">
              {/* Tooth Type Filter */}
              <div class="flex-1 min-w-48">
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Tooth Type
                </label>
                <div class="flex bg-gray-700/50 rounded-lg p-1">
                  {['all', 'primary', 'permanent'].map((type) => (
                    <button
                      onclick={() => setToothTypeFilter(type)}
                      class={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${toothTypeFilter() === type
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                        }`}
                    >
                      {type === 'all' ? 'All Teeth' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Mode Toggle */}
              <div class="flex flex-col items-center">
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Search Mode
                </label>
                <button
                  onclick={() => setIsFuzzySearch(!isFuzzySearch())}
                  class={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isFuzzySearch()
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'
                      : 'bg-gray-600/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/70'
                    }`}
                >
                  {isFuzzySearch() ? (
                    <>
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                      </svg>
                      Fuzzy
                    </>
                  ) : (
                    <>
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                      Exact
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div class="mt-4 pt-4 border-t border-gray-700/50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">
                  Showing <span class="font-semibold text-blue-300">{table.getFilteredRowModel().rows.length}</span> of{' '}
                  <span class="font-semibold text-gray-100">{filteredData().length}</span> teeth
                  {toothTypeFilter() !== 'all' && (
                    <span class="ml-2 text-gray-400">
                      ({toothTypeFilter()} only)
                    </span>
                  )}
                </span>
                {search() && table.getFilteredRowModel().rows.length > 0 && isFuzzySearch() && (
                  <span class="text-purple-300 text-xs font-medium">
                    Sorted by relevance
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700/50">
              <thead class="bg-gray-800/50">
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <th
                            class="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-200 bg-gray-800/70"
                            colspan={header.colSpan}
                          >
                            <span>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                          </th>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </thead>

              <tbody class="bg-gray-800/20 backdrop-blur-sm divide-y divide-gray-700/30">
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <tr class="hover:bg-gray-700/30 transition-all duration-200 border-b border-gray-700/20">
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {table.getFilteredRowModel().rows.length === 0 && (
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-300 mb-2">No teeth found</h3>
              <p class="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {!search() && (
          <div class={`mt-6 p-4 rounded-xl border ${isFuzzySearch()
              ? 'bg-purple-500/10 border-purple-500/20 backdrop-blur-sm'
              : 'bg-gray-700/20 border-gray-600/30 backdrop-blur-sm'
            }`}>
            <h3 class={`text-sm font-semibold mb-3 ${isFuzzySearch() ? 'text-purple-300' : 'text-gray-300'
              }`}>
              {isFuzzySearch() ? '🔍 Fuzzy Search Examples:' : '📝 Exact Search Examples:'}
            </h3>
            <div class={`text-xs space-y-2 ${isFuzzySearch() ? 'text-purple-200' : 'text-gray-400'
              }`}>
              {isFuzzySearch() ? (
                <>
                  <div class="flex items-center">
                    <code class="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs mr-2">"uppr mlr"</code>
                    <span>finds "upper molar"</span>
                  </div>
                  <div class="flex items-center">
                    <code class="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs mr-2">"canin"</code>
                    <span>finds "canine"</span>
                  </div>
                  <div class="flex items-center">
                    <code class="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs mr-2">"prmry"</code>
                    <span>finds "primary" teeth</span>
                  </div>
                </>
              ) : (
                <>
                  <div class="flex items-center">
                    <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"upper molar"</code>
                    <span>finds upper molars</span>
                  </div>
                  <div class="flex items-center">
                    <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"canine"</code>
                    <span>finds canine teeth</span>
                  </div>
                  <div class="flex items-center">
                    <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"primary"</code>
                    <span>finds primary teeth</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
