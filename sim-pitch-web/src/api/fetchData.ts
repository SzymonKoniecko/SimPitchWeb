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
  const state: ApiState<T> = {
    loading: true,
    error: null,
    data: null,
  };

  try {
    const maybeRes = await fetchFn();

    if (maybeRes && typeof maybeRes === "object" && "ok" in maybeRes && typeof maybeRes.ok === "boolean") {
      const res = maybeRes as Response;
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      state.data = (parseJson ? (await res.json()) : (await res.text())) as T;
    } else {
      state.data = maybeRes as T;
    }
  } catch (err) {
    state.error = err instanceof Error ? err.message : "Unknown error";
  } finally {
    state.loading = false;
  }

  return state;
}
