import { createSignal, createMemo, For } from 'solid-js';
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from '@tanstack/solid-table';
import { permanentTeeth, primaryTeeth, type ToothData } from '../data/toothData';
import { t } from '../i18n';

// Extend the table types to include custom filter functions
declare module '@tanstack/solid-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
    exact: FilterFn<unknown>
  }
}

// Custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value) return true;
  const itemValue = row.getValue(columnId);
  if (typeof itemValue === 'string') {
    return itemValue.toLowerCase().includes(value.toLowerCase());
  }
  return String(itemValue).toLowerCase().includes(value.toLowerCase());
};

// Custom exact filter function
const exactFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value) return true;
  const itemValue = row.getValue(columnId);
  return String(itemValue) === String(value);
};


const getAllTeeth = () => [...primaryTeeth, ...permanentTeeth];

export default function DentalChart() {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = createSignal('');
  const [notationSystem, setNotationSystem] = createSignal<'fdi' | 'universal' | 'palmer'>('fdi');

  const data = createMemo(() => getAllTeeth());

  const toggleNotationSystem = () => {
    const current = notationSystem();
    if (current === 'fdi') {
      setNotationSystem('universal');
    } else if (current === 'universal') {
      setNotationSystem('palmer');
    } else {
      setNotationSystem('fdi');
    }
  };

  const columns: ColumnDef<ToothData>[] = [
    {
      accessorKey: 'name',
      header: t('referenceTable.toothName'),
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => (
        <span class={`px-2 py-1 rounded text-xs font-medium ${info.getValue() === 'primary'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-green-100 text-green-800'
          }`}>
          {(info.getValue() as string).charAt(0).toUpperCase() + (info.getValue() as string).slice(1)}
        </span>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (info) => (
        <span class="capitalize">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: (info) => (
        <span class="capitalize">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'side',
      header: 'Side',
      cell: (info) => (
        <span class="capitalize">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'notation',
      header: () => (
        <button
          onClick={toggleNotationSystem}
          class="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          title="Click to switch notation system"
        >
          <span>
            {notationSystem() === 'fdi' ? t('studyMode.fdi') :
              notationSystem() === 'universal' ? t('studyMode.universal') : t('studyMode.palmer')}
          </span>
          <span class="text-xs">🔄</span>
        </button>
      ),
      cell: (info) => {
        const notation = info.getValue() as ToothData['notation'];
        const system = notationSystem();

        return (
          <span class={`font-mono font-bold ${system === 'fdi' ? 'text-teal-600' :
            system === 'universal' ? 'text-purple-600' : 'text-orange-600'
            }`}>
            {system === 'fdi' ? notation.fdi :
              system === 'universal' ? notation.universal : notation.palmer}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const system = notationSystem();
        const a = rowA.original.notation[system];
        const b = rowB.original.notation[system];
        return a.localeCompare(b);
      },
    },
    {
      accessorKey: 'eruption.ageRange',
      header: t('referenceTable.eruptionAge'),
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'shedding.ageRange',
      header: t('referenceTable.sheddingAge'),
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? value : <span class="text-gray-400">N/A</span>;
      },
    },
    {
      accessorKey: 'rootCompletion.ageRange',
      header: t('referenceTable.rootCompletion'),
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? value : <span class="text-gray-400">N/A</span>;
      },
    },
  ];

  const table = createMemo(() =>
    createSolidTable({
      data: data(),
      columns,
      state: {
        sorting: sorting(),
        columnFilters: columnFilters(),
        globalFilter: globalFilter(),
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
        exact: exactFilter,
      },
    })
  );

  const typeFilter = createMemo(() => {
    const filter = columnFilters().find(f => f.id === 'type');
    return filter?.value as string || 'all';
  });

  const setTypeFilter = (value: string) => {
    if (value === 'all') {
      setColumnFilters(prev => prev.filter(f => f.id !== 'type'));
    } else {
      setColumnFilters(prev => [
        ...prev.filter(f => f.id !== 'type'),
        { id: 'type', value }
      ]);
    }
  };

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dental Chart</h1>
        <p class="text-gray-600">Comprehensive tooth eruption and development data</p>
      </div>

      {/* Filters */}
      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search teeth..."
              value={globalFilter()}
              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tooth Type
            </label>
            <select
              value={typeFilter()}
              onChange={(e) => setTypeFilter(e.currentTarget.value)}
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="primary">{t('referenceTable.primary')}</option>
              <option value="permanent">{t('referenceTable.permanent')}</option>
            </select>
          </div>
        </div>

        <div class="text-sm text-gray-600">
          Showing {table().getFilteredRowModel().rows.length} of {data().length} teeth
        </div>
      </div>

      {/* Table */}
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <For each={table().getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div class="flex items-center space-x-1">
                            <span>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {header.column.getCanSort() && (
                              <span class="text-gray-400">
                                {{
                                  asc: ' ↑',
                                  desc: ' ↓',
                                }[header.column.getIsSorted() as string] ?? ' ↕'}
                              </span>
                            )}
                          </div>
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={table().getRowModel().rows}>
                {(row) => (
                  <tr class="hover:bg-gray-50">
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      </div>

      {/* Legend */}
      <div class="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Notation Systems</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="font-medium text-purple-600">Universal:</span>
            <p class="text-gray-600">Numbers 1-32 (permanent), Letters A-T (primary)</p>
          </div>
          <div>
            <span class="font-medium text-orange-600">Palmer:</span>
            <p class="text-gray-600">Numbers 1-8 with quadrant symbols</p>
          </div>
          <div>
            <span class="font-medium text-teal-600">FDI:</span>
            <p class="text-gray-600">Two-digit system (quadrant + tooth number)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
