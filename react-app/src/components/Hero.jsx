import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSiteData } from "../context/SiteDataContext";
import EditModal from "./EditModal";
import { AddButton, DeleteButton } from "./AdminControls";

export default function Hero({ slides }) {
  const [current, setCurrent] = useState(0);
  const { can } = useAuth();
  const canEditHero = can("textos", "modificar");
  const { saveField, addArrayItem, removeArrayItem } = useSiteData();
  const [editing, setEditing] = useState(false);

  const goTo = useCallback(
    (index) => setCurrent((index + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length === 0 || canEditHero) return;
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length, canEditHero]);

  useEffect(() => {
    if (current >= slides.length && slides.length > 0) setCurrent(0);
  }, [slides.length, current]);

  function handleSlideClick(e) {
    if (!canEditHero) return;
    e.stopPropagation();
    setEditing(true);
  }

  function handleRemove() {
    removeArrayItem("images", "hero", current);
    setCurrent(0);
  }

  function handleAdd() {
    addArrayItem("images", "hero", "");
  }

  return (
    <section className="hero" aria-label="Slider principal">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide${i === current ? " active" : ""}${canEditHero && i === current ? " admin-editable" : ""}`}
          style={{
            backgroundImage: `url('${slide}')`,
            pointerEvents: i === current ? "auto" : "none",
          }}
          onClick={i === current ? handleSlideClick : undefined}
        />
      ))}
      {slides.length > 1 && (
        <>
          <button className="hero-arrow prev" aria-label="Anterior" onClick={() => goTo(current - 1)}>‹</button>
          <button className="hero-arrow next" aria-label="Següent" onClick={() => goTo(current + 1)}>›</button>
        </>
      )}
      <div className="hero-dots" aria-label="Paginació slider">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === current ? "active" : ""}
            aria-label={`Anar a la diapositiva ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      {canEditHero && (
        <div className="hero-admin-controls">
          <AddButton
            label="Afegir slide"
            onClick={handleAdd}
            resource="textos"
            action="modificar"
          />
          {slides.length > 0 && (
            <DeleteButton
              onClick={handleRemove}
              label="Eliminar slide actual"
              resource="textos"
              action="modificar"
            />
          )}
        </div>
      )}
      {editing && (
        <EditModal
          value={slides[current]}
          type="image"
          pathKey={`hero.${current}`}
          onSave={(v) => { saveField("images", `hero.${current}`, v); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
    </section>
  );
}
