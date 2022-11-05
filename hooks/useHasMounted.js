import { useState, useEffect, useMemo } from "react";

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  return useMemo(() => ({ hasMounted }), [hasMounted]);
}
