import { createColumnHelper, createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, type FilterFn } from '@tanstack/solid-table'
import { createSignal, For } from 'solid-js';
import { permanentTeeth, primaryTeeth, type ToothData } from './data/toothData';
import { getToothName, t } from './i18n';



// Tokenized, unordered, partial substring search across multiple fields.
// Example: "max can right" => matches "maxillary canine right"
const tokenizedGlobalFilter: FilterFn<any> = (row, _, filterValue) => {
  if (!filterValue) return true;

  const raw = String(filterValue).toLowerCase().trim();
  if (!raw) return true;

  // split by whitespace, ignore empty tokens
  const tokens = raw.split(/\s+/).filter(Boolean);

  const data = row.original;

  // Build searchable strings for each record -- all lowercased
  const searchableFields = [
    data.name?.toLowerCase() || '',
    data.type?.toLowerCase() || '',
    data.position?.toLowerCase() || '',
    data.side?.toLowerCase() || '',
    data.eruption?.ageRange?.toLowerCase() || '',
    data.shedding?.ageRange?.toLowerCase() || '',
    data.rootCompletion?.ageRange?.toLowerCase() || '',
    // combined full text
    `${data.position} ${data.side} ${data.name}`.toLowerCase(),
  ].join(' ');

  // Each token must appear somewhere (substring) in the combined searchable text.
  // This enables tokens in any order and partial words.
  return tokens.every((t) => searchableFields.includes(t));
};

const columnHelper = createColumnHelper<ToothData>();

const defaultColumns = [
  columnHelper.accessor('nameKey', {
    id: 'name',
    header: () => {
      return (
        <span class="capitalize font-semibold text-gray-100">
          {t('referenceTable.toothName')}
        </span>
      )
    },
    cell: ({ cell, row }) => {
      const nameKey = cell.getValue();
      const position = row.original.position;
      const side = row.original.side;
      return (
        <div class="flex flex-col">
          <span class="capitalize font-medium text-gray-100">
            {t(`commonTerms.${position}`)} {t(`commonTerms.${side}`)} {nameKey ? getToothName(nameKey) : ''}
          </span>
          <span class={`w-fit px-3 py-1 mt-1 rounded-full text-xs font-semibold ${row.original.type === 'primary'
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
            {row.original.type === 'primary' ? t('referenceTable.primary') : t('referenceTable.permanent')}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('crownCompletion.ageRange', {
    id: 'crownCompletion',
    header: () => <span class="font-semibold text-gray-100">{t('referenceTable.crownCompletion')}</span>,
    cell: ({ cell }) => (
      <span class="text-gray-200 font-medium">
        {cell.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('eruption.ageRange', {
    id: 'eruption',
    header: () => <span class="font-semibold text-gray-100">{t('referenceTable.eruptionAge')}</span>,
    cell: ({ cell }) => (
      <span class="text-gray-200 font-medium">
        {cell.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor((row) => row.shedding?.ageRange,
    {
      id: 'shedding',
      header: () => <span class="font-semibold text-gray-100">{t('referenceTable.sheddingAge')}</span>,
      cell: ({ cell }) => {
        const value = cell.getValue();
        return value ? (
          <span class="text-gray-200 font-medium">{value}</span>
        ) : (
          <span class="text-gray-500 italic">{t('referenceTable.na')}</span>
        );
      },
    }),

  columnHelper.accessor('rootCompletion.ageRange', {
    id: 'rootCompletion',
    header: () => <span class="font-semibold text-gray-100">{t('referenceTable.rootCompletion')}</span>,
    cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? (
        <span class="text-gray-200 font-medium">{value}</span>
      ) : (
        <span class="text-gray-500 italic">{t('referenceTable.na')}</span>
      );
    },
  }),
];

export default function ReferenceTable() {
  const [search, setSearch] = createSignal('');
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
      exact: tokenizedGlobalFilter,
      fuzzy: tokenizedGlobalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: tokenizedGlobalFilter,
    state: {
      get globalFilter() {
        return search()
      },
    },
    onGlobalFilterChange: setSearch
  })

  return (
    // <div class="min-h-screen p-6" style="background: linear-gradient(to bottom right, back, oklch(0.1767 0.05 239.48), oklch(0.1967 0.029 239.48));">

    <div class="mx-auto">

      {/* Tooth Chart */}

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{t('referenceTable.title')}</h1>
        <p class="text-gray-400">{t('referenceTable.subtitle')}</p>
      </div>

      {/* Filters */}
      <div class="mb-8">
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          {/* Search Input */}
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-200 mb-2">
              {t('referenceTable.searchTeeth')}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('referenceTable.searchPlaceholder')}
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
                {t('referenceTable.toothType')}
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
                    {type === 'all' ? t('referenceTable.allTeeth') : t(`referenceTable.${type}` as any)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Info */}
          <div class="mt-4 pt-4 border-t border-gray-700/50">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-300">
                {t('referenceTable.showingOfTeeth', {
                  shown: table.getFilteredRowModel().rows.length,
                  total: filteredData().length
                })}
                {toothTypeFilter() !== 'all' && (
                  <span class="ml-2 text-gray-400">
                    ({t('referenceTable.only')})
                  </span>
                )}
              </span>
              {search() && table.getFilteredRowModel().rows.length > 0}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="divide-y divide-gray-700/50 w-full">
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
            <h3 class="text-lg font-medium text-gray-300 mb-2">{t('referenceTable.noTeethFound')}</h3>
            <p class="text-gray-500">{t('referenceTable.tryAdjustingSearch')}</p>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {/* <div class="mt-6 p-4 rounded-xl border bg-gray-700/20 border-gray-600/30 backdrop-blur-sm"> */}
      {/*   <div class="text-xs space-y-2  text-gray-300" > */}
      {/*     <div class="flex items-center"> */}
      {/*       <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"max mol pri"</code> */}
      {/*       <span>finds maxillary primary molars</span> */}
      {/*     </div> */}
      {/*     <div class="flex items-center"> */}
      {/*       <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"can"</code> */}
      {/*       <span>finds canine teeth</span> */}
      {/*     </div> */}
      {/*     <div class="flex items-center"> */}
      {/*       <code class="bg-gray-600/50 text-gray-200 px-2 py-1 rounded text-xs mr-2">"primary"</code> */}
      {/*       <span>finds primary teeth</span> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  )
}
