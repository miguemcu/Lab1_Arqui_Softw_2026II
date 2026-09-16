import { BASE_URL } from "@/config/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function extractError(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) return `Error ${response.status} en la petición al servidor.`;
  try {
    const body = JSON.parse(text) as Record<string, unknown>;
    const msg = body["message"] ?? body["error"] ?? body["detail"];
    if (typeof msg === "string" && msg.trim()) return msg;
  } catch {
    /* respuesta en texto plano */
  }
  return text.slice(0, 300);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      `No fue posible conectar con el servidor (${BASE_URL}). Verifica que el backend esté en ejecución.`,
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await extractError(response), response.status);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
