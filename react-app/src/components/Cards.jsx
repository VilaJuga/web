import { useState } from "react";
import { EditableText, EditableImage } from "./Editable";
import { AddButton, DeleteButton } from "./AdminControls";
import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Cards({ cards }) {
  const { addCard, removeCard } = useSiteData();
  const { can } = useAuth();
  const canReorder = can("tarjetas", "modificar");
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  async function reorderCards(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    try {
      // Build reordered arrays from current state (cards is already merged)
      const newOrder = [...cards];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);

      // Write parallel arrays back to both Firestore docs
      const contentCards = newOrder.map((c) => ({ title: c.title, text: c.text }));
      const imagesCards = newOrder.map((c) => ({ src: c.image, alt: c.alt }));

      await Promise.all([
        updateDoc(doc(db, "site", "content"), { cards: contentCards }),
        updateDoc(doc(db, "site", "images"), { cards: imagesCards }),
      ]);
    } catch (err) {
      console.error("Error reordering cards:", err);
      alert("Error reordenant: " + err.message);
    }
  }

  function handleDragStart(i) {
    setDragIndex(i);
  }

  function handleDragOver(e, i) {
    e.preventDefault();
    if (dragIndex === null || i === dragIndex) return;
    setDragOverIndex(i);
  }

  function handleDrop(e, i) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== i) {
      reorderCards(dragIndex, i);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <section className="container section-gap what">
      <h2>Què hi trobarem?</h2>
      <div className="divider center" />
      <div className="cards">
        {cards.map((card, i) => (
          <article
            key={i}
            className={`card admin-item-wrap${canReorder ? " admin-draggable" : ""}${
              dragOverIndex === i ? " drag-over" : ""
            }${dragIndex === i ? " dragging" : ""}`}
            draggable={canReorder}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            <DeleteButton
              onClick={() => removeCard(i)}
              resource="tarjetas"
              action="eliminar"
            />
            <EditableImage
              path={`cards.${i}.src`}
              src={card.image}
              alt={card.alt}
              loading="lazy"
              resource="tarjetas"
              action="modificar"
            />
            <EditableText
              path={`cards.${i}.title`}
              value={card.title}
              tag="h3"
              resource="tarjetas"
              action="modificar"
            />
            <EditableText
              path={`cards.${i}.text`}
              value={card.text}
              tag="p"
              resource="tarjetas"
              action="modificar"
            />
          </article>
        ))}
      </div>
      <div className="admin-add-btn-wrap">
        <AddButton
          label="Afegir targeta"
          onClick={addCard}
          resource="tarjetas"
          action="añadir"
        />
      </div>
    </section>
  );
}
