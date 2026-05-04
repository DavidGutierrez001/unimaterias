"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

export default function Home() {
  const [signatures, setSignatures] = useState([]);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await fetch(
          "https://qzvzxvckgvuknxxoggwr.supabase.co/rest/v1/signature?select=*",
          {
            headers: {
              apikey: "sb_publishable_ENb1qTDEm73-XxDtaq4LsA_lkQGDh4d",
              Authorization:
                "Bearer sb_publishable_ENb1qTDEm73-XxDtaq4LsA_lkQGDh4d",
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar las materias");
        }

        const data = await response.json();
        const ordered = [...data].reverse();

        if (ordered.length >= 6) {
          alert("Solo se permiten 5 Materias, tienes: " + ordered.length);
        }

        setSignatures(ordered.slice(0, 5));
      } catch (err) {
        setError(err.message || "Ocurrió un error al cargar las materias");
      } finally {
        setFetching(false);
      }
    };

    fetchSignatures();
  }, []);

  const handleSelect = (signature) => {
    setLoading(true);
    setSelectedSignature(signature);

    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleReturn = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSelectedSignature(null);
  };

  const formattedData = useMemo(() => {
    if (!selectedSignature) return null;

    return {
      hourStart: new Date(
        `2000-01-01T${selectedSignature.hora_inicio}`
      ).toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      hourEnd: new Date(
        `2000-01-01T${selectedSignature.hora_fin}`
      ).toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      dateStart: new Date(selectedSignature.fecha_inicio).toLocaleDateString(
        "es-ES",
        {
          day: "numeric",
          month: "long",
        }
      ),
      dateEnd: new Date(selectedSignature.fecha_fin).toLocaleDateString(
        "es-ES",
        {
          day: "numeric",
          month: "long",
        }
      ),
    };
  }, [selectedSignature]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <header
        className={`header fixed top-0 gap-7 items-center md:justify-end justify-between w-full h-16 p-5 z-50 ${selectedSignature ? "flex" : "hidden"}`}
      >
        <div className="flex gap-2 justify-center items-center py-2 px-4 border border-white/50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

          <span>{selectedSignature ? `${selectedSignature.creditos} Créditos` : ""}</span>
        </div>


        <button
          onClick={handleReturn}
          className="bg-white text-black py-2 px-3 gap-2 flex rounded-full items-center font-semibold cursor-pointer"
        >
          <Icon icon="hugeicons:circle-arrow-up-02" className="size-6"></Icon>
        </button>
      </header>

      <div className="min-h-screen flex flex-col gap-10 justify-center items-center">
        {fetching ? (
          <h1 className="font-bold text-white text-4xl md:text-5xl px-5 text-center">
            Cargando materias
          </h1>) : (
          <h1 className="font-bold text-white text-4xl md:text-5xl px-5 text-center">
            Selecciona una <br /> Materia
          </h1>
        )}

        {fetching ? (
          <span className="loader"></span>
        ) : error ? (
          <p className="text-red-400 text-center px-4">{error}</p>
        ) : (
          <div className="flex items-center md:justify-center w-screen overflow-auto p-5 snap-mandatory snap-x gap-10">
            {signatures.map((signature) => (
              <label
                key={signature.nrc}
                className={`target badge snap-center cursor-pointer ${selectedSignature?.nombre === signature.nombre ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="signature"
                  value={signature.nombre}
                  checked={selectedSignature?.nombre === signature.nombre}
                  onChange={() => handleSelect(signature)}
                />
                <span className="leading-none">{signature.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div >

      <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2 md:grid-rows-2 items-center justify-center relative top-16">
        <section className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-white text-5xl md:text-[8rem] text-center md:text-end leading-none md:max-w-200 max-w-100">
            {selectedSignature?.nombre || ""}
          </h1>
        </section>

        <section className="flex flex-col items-center">
          <div className="flex gap-5 flex-col justify-center items-center">
            <h2 className="md:text-7xl text-4xl font-bold">
              {formattedData?.hourStart || ""}
              &ensp;-&ensp;
              {formattedData?.hourEnd || ""}
            </h2>
          </div>

          <div className="flex gap-5 justify-center items-center text-white/70">
            <span className="md:text-4xl text-2xl font-bold">
              {formattedData?.dateStart || ""}
            </span>
            <span className="md:text-6xl text-xl">-</span>
            <span className="md:text-4xl text-2xl font-bold">
              {formattedData?.dateEnd || ""}
            </span>
          </div>
        </section>

        <section
          className={`col-span-full h-full ${loading ? "loading" : ""}`}
        >
          <div className="w-screen overflow-auto flex md:justify-center gap-5 px-10 py-5 snap-x snap-mandatory">
            <div className="targetS snap-center">
              <Icon icon="hugeicons:meeting-room" className="text-5xl text-white/40" />
              <p className="flex flex-col gap-4 md:text-2xl text-white/40 font-light">
                <span className="font-bold text-white text-3xl md:text-4xl">
                  {selectedSignature?.salon || ""}
                </span>
                Salón
              </p>
            </div>

            <div className="targetS snap-center">
              <Icon icon="hugeicons:building-05" className="text-5xl text-white/40" />
              <p className="flex flex-col justify-center gap-4 md:text-2xl text-white/40 font-light">
                <span className="font-bold text-white text-2xl md:text-4xl leading-none">
                  {selectedSignature?.edificio || ""}
                </span>
                Edificio
              </p>
            </div>

            <div className="targetS snap-center">
              <Icon icon="hugeicons:calendar-04" className="text-5xl text-white/40" />
              <p className="flex flex-col gap-4 md:text-2xl text-white/40 font-light">
                <span className="font-bold text-white text-3xl md:text-4xl">
                  {selectedSignature?.semana || ""}
                </span>
                Semana
              </p>
            </div>

            <div className="targetS snap-center">
              <Icon icon="hugeicons:input-numeric" className="text-5xl text-white/40" />
              <p className="flex flex-col gap-4 md:text-2xl text-white/40 font-light">
                <span className="font-bold text-white text-3xl md:text-4xl">
                  {selectedSignature?.nrc || ""}
                </span>
                NRC
              </p>
            </div>

            <div className="targetS snap-center">
              <Icon icon="hugeicons:teaching" className="text-5xl text-white/40" />
              <p className="flex flex-col gap-4 md:text-2xl text-white/40 font-light">
                <span className="font-bold text-white text-2xl md:text-3xl leading-none">
                  {selectedSignature?.profesor || ""}
                </span>
                Profesor
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
