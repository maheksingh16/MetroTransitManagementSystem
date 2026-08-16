import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Loading } from './Loading';
import { Empty } from './Empty';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getItemKey: (item: T) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  getItemKey,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200/60 p-12">
        <Loading message="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200/60 p-8">
        <div className="text-red-600 text-center">{error}</div>
        {onRetry && (
          <div className="text-center mt-4">
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200/60">
        <Empty
          title={emptyTitle || 'No data'}
          description={emptyDescription || 'There are no records to display.'}
          actionLabel={emptyAction?.label}
          onAction={emptyAction?.onClick}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4 whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={getItemKey(item)} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg text-slate-500 hover:text-metro-blue-700 hover:bg-metro-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
