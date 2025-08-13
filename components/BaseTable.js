import React from "react";
import IconButton from '@mui/material/IconButton';
import { Edit, Delete, Visibility, PictureAsPdf } from '@mui/icons-material';

/**
 * BaseTable - Tabela padronizada para todo o sistema
 * Props:
 *  columns: [{ label: string, accessor: string, align?: 'left'|'right'|'center' }]
 *  data: array de objetos
 *  loading: boolean
 *  onEdit, onDelete, onDetails: function(row)
 *  actions: { edit?: boolean, delete?: boolean, details?: boolean, pdf?: boolean }
 */
const BaseTable = ({ columns, data, loading, onEdit, onDelete, onDetails, onPdf, actions = { edit: true, delete: true, details: true, pdf: true } }) => {
  const handleAction = (e, action, row) => {
    e.preventDefault();
    e.stopPropagation();
    action(row);
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-blue-100 bg-white">
      <table className="min-w-full divide-y divide-blue-100">
        <thead className="bg-white sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.accessor || col.label || idx}
                className={`px-4 py-3 text-xs font-bold text-blue-700 uppercase tracking-wider text-${col.align || 'left'} ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
            {(actions.edit || actions.delete || actions.details || actions.pdf) && (
              <th className="px-4 py-3 text-xs font-bold text-blue-700 uppercase tracking-wider text-right">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8 text-blue-600">
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8 text-gray-400">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/50 hover:bg-blue-50'}>
                {columns.map((col, colIdx) => (
                  <td
                    key={col.accessor || col.label || colIdx}
                    className={`px-4 py-2 text-${col.align || 'left'} text-gray-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row, i) : row[col.accessor]}
                  </td>
                ))}
                {(actions.edit || actions.delete || actions.details || actions.pdf) && (
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {actions.details && (
                        <IconButton
                          size="small"
                          onClick={(e) => onDetails && handleAction(e, onDetails, row)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="Ver detalhes"
                        >
                          <Visibility className="w-5 h-5" />
                        </IconButton>
                      )}
                      {actions.edit && (
                        <IconButton
                          size="small"
                          onClick={(e) => onEdit && handleAction(e, onEdit, row)}
                          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </IconButton>
                      )}
                      {actions.delete && (
                        <IconButton
                          size="small"
                          onClick={(e) => onDelete && handleAction(e, onDelete, row)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Delete className="w-5 h-5" />
                        </IconButton>
                      )}
                      {actions.pdf && (
                        <IconButton
                          size="small"
                          onClick={(e) => onPdf && handleAction(e, onPdf, row)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="Gerar PDF"
                        >
                          <PictureAsPdf className="w-5 h-5" />
                        </IconButton>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
