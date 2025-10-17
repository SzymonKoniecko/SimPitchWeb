// src/api/fetchData.ts
export interface ApiState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export async function fetchData<T>(
  fetchFn: () => Promise<any>, // może zwracać Response lub gotowe JSON
  parseJson: boolean = true
): Promise<ApiState<T>> {
  try {
    const maybeRes = await fetchFn();

    // 🔍 Obsługa fetch() Response
    if (
      maybeRes &&
      typeof maybeRes === "object" &&
      "ok" in maybeRes &&
      typeof maybeRes.ok === "boolean"
    ) {
      const res = maybeRes as Response;
      if (!res.ok) {
        return {
          loading: false,
          error: `Request failed: ${res.status} ${res.statusText}`,
          data: null,
        };
      }

      const parsed = parseJson ? await res.json() : await res.text();
      return {
        loading: false,
        error: null,
        data: parsed as T,
      };
    }

    // 🔄 Zwrócono już gotowe dane (axios lub inny klient)
    return {
      loading: false,
      error: null,
      data: maybeRes as T,
    };
  } catch (err) {
    return {
      loading: false,
      error: err instanceof Error ? err.message : "Unknown error",
      data: null,
    };
  }
}
