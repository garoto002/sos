import React from 'react';
import Container from '@mui/material/Container';

/**
 * ModulePageLayout - Layout base para páginas de módulos do dashboard
 * Props:
 *  - title: string
 *  - description: string
 *  - kpis: ReactNode (cards de KPIs)
 *  - shortcuts: ReactNode (atalhos rápidos)
 *  - filters: ReactNode (drawer ou barra de filtros)
 *  - actions: ReactNode (botões de ação, ex: novo registro)
 *  - tools: ReactNode (botões utilitários, ex: estatísticas, imprimir)
 *  - children: conteúdo principal (tabela/cards)
 */
const ModulePageLayout = ({
  title,
  description,
  kpis,
  shortcuts,
  filters,
  actions,
  tools,
  children,
}) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 tracking-tight mb-1">{title}</h1>
          {description && <p className="text-base md:text-lg text-gray-500 font-medium max-w-2xl">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end">
          {tools && (
            <div className="flex gap-2">{tools}</div>
          )}
          {actions && (
            <div className="flex gap-2">{
              Array.isArray(actions) ? actions.map((a, i) => <span key={i}>{a}</span>) : actions
            }</div>
          )}
        </div>
      </div>
      {/* KPIs */}
      {kpis && <div className="mb-8">{kpis}</div>}
      {/* Atalhos */}
      {shortcuts && <div className="flex flex-wrap gap-3 mb-8">{shortcuts}</div>}
      {/* Filtros */}
      {filters && <div className="mb-6">{filters}</div>}
      {/* Conteúdo principal */}
      <div>{children}</div>
    </Container>
  );
};

export default ModulePageLayout;
