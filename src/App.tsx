import React, { useEffect, useState } from "react";

// const API_URL = "http://localhost:3000/api/censistas";
const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api") +
  "/censistas";

//console.log("API_URL RESUELTA =>", API_URL);



// Tipos para el JSON
interface Usuario {
  id: number;
  usuario: string;
  password: string;
  codsede: string;
  brigada: string;
  ruta: string;
  dni: string;
  nomb_ape: string;
  NOMBSEDE: string;
  PERMISOS: string;
  id_rol: number;
  DESC_ROL: string;
}

// Respuesta de la API intermedia
interface ApiResponse {
  ok: boolean;
  count: number;
  data: Usuario[];
}

const App: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inputs visibles
  const [dniInput, setDniInput] = useState<string>("");
  const [nombreInput, setNombreInput] = useState<string>("");

  // Filtros confirmados (al hacer clic en Buscar)
  const [dniFiltro, setDniFiltro] = useState<string>("");
  const [nombreFiltro, setNombreFiltro] = useState<string>("");

  const hasFilters =
    dniFiltro.trim() !== "" || nombreFiltro.trim() !== "";

  // Efecto: solo se ejecuta cuando cambian los filtros confirmados
  useEffect(() => {
    if (!hasFilters) {
      setUsuarios([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (dniFiltro.trim()) params.append("dni", dniFiltro.trim());
        if (nombreFiltro.trim())
          params.append("nombre", nombreFiltro.trim());

        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const json: ApiResponse = await response.json();

        if (!json || !Array.isArray(json.data)) {
          throw new Error("La API no devolvió la estructura esperada.");
        }

        setUsuarios(json.data);
      } catch (err: any) {
        setError(err.message || "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [dniFiltro, nombreFiltro, hasFilters]);

  const handleBuscar = () => {
    setError(null);
    setUsuarios([]);
    setDniFiltro(dniInput);
    setNombreFiltro(nombreInput);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Panel principal HUD */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-slate-800 shadow-[0_22px_60px_rgba(0,0,0,0.8)] px-5 py-6 md:px-8 md:py-8 backdrop-blur-md">
          {/* Barra RGB arriba */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400" />

          {/* Hero */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-cyan-500/40 px-3 py-1 text-[0.7rem] md:text-xs font-mono tracking-[0.18em] text-cyan-300 uppercase shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              Credential Recovery Console · Ci28
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-50 leading-tight drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)]">
              Hola censista, ¿olvidaste tu contraseña?
            </h1>

            <p className="mt-3 text-sm md:text-base text-slate-300 max-w-3xl">
              Usa la consola de búsqueda para recuperar tus credenciales.
              Puedes filtrar por <span className="font-semibold text-cyan-300">DNI</span> o por{" "}
              <span className="font-semibold text-fuchsia-300">nombres y apellidos</span>. 
              El sistema mostrará solo las coincidencias relevantes.
            </p>
          </header>

          {/* Zona de búsqueda */}
          <section className="mb-6">
            <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-4">
              {/* DNI */}
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm font-semibold text-slate-200">
                  Buscar por DNI
                </label>
                <input
                  type="text"
                  placeholder="Ejemplo: 7403345"
                  value={dniInput}
                  onChange={(e) => setDniInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-slate-700/80 bg-slate-900/70 rounded-lg px-3 py-2 text-sm md:text-base text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-[0_0_18px_rgba(15,23,42,0.9)]"
                />
                <p className="text-[0.7rem] text-slate-400">
                  Coincidencia parcial: cualquier segmento del DNI será considerado.
                </p>
              </div>

              {/* Nombre y apellidos */}
              <div className="flex flex-col gap-1">
                <label className="text-xs md:text-sm font-semibold text-slate-200">
                  Buscar por nombres y apellidos
                </label>
                <input
                  type="text"
                  placeholder="Ejemplo: JORGE PEREZ, RAISA PACORA"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-slate-700/80 bg-slate-900/70 rounded-lg px-3 py-2 text-sm md:text-base text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 shadow-[0_0_18px_rgba(15,23,42,0.9)]"
                />
                <p className="text-[0.7rem] text-slate-400">
                  Orden libre: escribe nombres y apellidos en cualquier orden, el sistema los combinará.
                </p>
              </div>
            </div>

            {/* Botón Buscar */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleBuscar}
                // Tailwind + estilos inline para asegurarnos que se vea correcto
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-2.5 text-sm md:text-base font-semibold shadow-[0_0_25px_rgba(37,99,235,0.65)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-transform hover:-translate-y-[1px]"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Buscar
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
              <p className="text-sm md:text-base text-slate-200 font-mono">
                Cargando datos…
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mb-6 rounded-xl border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm text-red-200 font-mono shadow-[0_0_25px_rgba(248,113,113,0.4)]">
              <p className="font-semibold mb-1">Error al cargar datos</p>
              <p className="text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Mensaje inicial */}
          {!loading && !error && !hasFilters && (
            <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/60 px-4 py-6 text-sm text-slate-300 text-center font-mono">
              Ingresa un <span className="font-semibold text-cyan-300">DNI</span> o{" "}
              <span className="font-semibold text-fuchsia-300">nombres y apellidos</span> y presiona{" "}
              <span className="font-semibold text-emerald-300">Buscar</span> para iniciar el escaneo de credenciales.
            </div>
          )}

          {/* Resultados */}
          {!loading && !error && hasFilters && (
            <>
              <section className="mb-3">
                <p className="text-xs md:text-sm text-slate-300 font-mono">
                  Resultados:{" "}
                  <span className="font-semibold text-emerald-300">
                    {usuarios.length}
                  </span>
                </p>
              </section>

              <section className="mt-2">
                {usuarios.length === 0 ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-6 text-sm text-slate-300 font-mono text-center">
                    No se encontraron coincidencias. Ajusta el DNI o los nombres y apellidos e intenta nuevamente.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {usuarios.map((u) => (
                      <article
                        key={u.id}
                        className="relative bg-slate-900/80 border border-slate-700 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col gap-2"
                      >
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400/80 via-fuchsia-400/80 to-emerald-400/80 opacity-80" />
                        <h2 className="mt-1 text-sm md:text-base font-semibold text-slate-50">
                          {u.nomb_ape || "Nombre no disponible"}
                        </h2>

                        <div className="space-y-1.5 text-[0.72rem] md:text-xs">
                          <InfoRow label="DNI" value={u.dni} />
                          <InfoRow label="Usuario" value={u.usuario} />
                          <InfoRow label="Contraseña" value={u.password} />
                          <InfoRow label="Sede" value={u.NOMBSEDE} />
                          <InfoRow label="Brigada" value={u.brigada} />
                          <InfoRow label="Ruta" value={u.ruta} />
                          <InfoRow label="Permisos" value={u.PERMISOS} />
                          <InfoRow label="Rol" value={u.DESC_ROL} />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer gamer Ci28 */}
        <footer className="mt-2">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-slate-100 px-4 py-4 md:px-6 md:py-5 shadow-lg border border-slate-800">
            {/* Barra RGB arriba */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              {/* Columna izquierda: estado del sistema */}
              <div className="space-y-1">
                <p className="text-[0.65rem] md:text-xs font-mono tracking-[0.2em] text-cyan-300 uppercase">
                  &lt;&lt; system ready &gt;&gt;
                </p>
                <p className="text-xs md:text-sm font-mono text-slate-200">
                  Engine: <span className="text-cyan-400">React</span> ·{" "}
                  <span className="text-fuchsia-400">Vite</span> ·{" "}
                  <span className="text-emerald-400">Tailwind</span>
                </p>
              </div>

              {/* Columna derecha: tu firma gamer */}
              <div className="text-right space-y-1">
                <p className="text-xs md:text-sm font-mono">
                  Developer:{" "}
                  <span className="text-fuchsia-400 font-semibold">
                    Ci28
                  </span>
                </p>
                <p className="text-[0.7rem] md:text-xs font-mono text-emerald-400">
                  Status: <span className="animate-pulse">ONLINE █████▒▒▒▒</span>
                </p>
              </div>
            </div>

            {/* Barra de progreso / energía */}
            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-900">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 animate-pulse" />
            </div>

            {/* Línea final pequeña */}
            <p className="mt-3 text-[0.65rem] md:text-[0.7rem] text-slate-400 text-center font-mono">
              © {new Date().getFullYear()} · BY Ci28 · Demo educativa de recuperación de credenciales
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => {
  const displayValue =
    value !== null && value !== undefined && value !== "" ? value : "—";

  return (
    <div className="flex flex-col">
      <span className="text-[0.6rem] uppercase tracking-[0.16em] text-slate-400 font-mono">
        {label}
      </span>
      <span className="text-[0.75rem] text-slate-100 font-medium">
        {displayValue}
      </span>
    </div>
  );
};

export default App;
