import { useState, useCallback, useMemo, useRef } from "react";

interface UseDataTableProps<F> {
  initialFilters?: F;
  initialSortBy?: string;
}

export function useDataTable<F>(props?: UseDataTableProps<F>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(
    props?.initialSortBy
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const initialFiltersRef = useRef<F>((props?.initialFilters || {}) as F);
  const [filters, setFilters] = useState<F>(initialFiltersRef.current);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const handleSortRequest = useCallback(
    (property: string) => {
      setSortBy((prevSortBy) => {
        const isAsc = prevSortBy === property && sortOrder === "asc";
        setSortOrder(isAsc ? "desc" : "asc");
        return property;
      });
    },
    [sortOrder]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setPage(0);
    },
    []
  );

  const updateFilter = useCallback((name: keyof F, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  }, []);

  const clearAllFilters = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setSearch("");
      setFilters(initialFiltersRef.current);
      setPage(0);
    },
    []
  );

  const queryParams = useMemo(() => {
    const params: any = {
      pageNr: page + 1,
      pageSize: rowsPerPage,
      sortOrder,
    };
    if (sortBy) params.sortBy = sortBy;
    if (search) params.search = search;
    Object.keys(filters as object).forEach((key) => {
      const value = (filters as any)[key];
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    return params;
  }, [page, rowsPerPage, sortBy, sortOrder, search, filters]);

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
    setTotalCount,
    sortBy,
    sortOrder,
    search,
    filters,
    handlePageChange,
    handleRowsPerPageChange,
    handleSortRequest,
    handleSearchChange,
    updateFilter,
    clearAllFilters,
    queryParams,
  };
}
