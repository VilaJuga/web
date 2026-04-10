import { useState } from "react";
import { EditableText, EditableImage } from "./Editable";
import { AddButton, DeleteButton } from "./AdminControls";
import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";

export default function Intro({ intro, gallery }) {
  const { addArrayItem, removeArrayItem, reorderArrayItem } = useSiteData();
  const { isAdmin } = useAuth();
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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
      reorderArrayItem("images", "introGallery", dragIndex, i);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <section className="intro container section-gap">
      <div className="intro-text">
        <EditableText path="intro.title" value={intro.title} tag="h1" />
        <div className="divider" />
        <EditableText path="intro.description" value={intro.description} tag="p" />
      </div>
      <div className="intro-gallery">
        {gallery.map((item, i) => (
          <div
            key={i}
            className={`admin-item-wrap${isAdmin ? " admin-draggable" : ""}${
              dragOverIndex === i ? " drag-over" : ""
            }${dragIndex === i ? " dragging" : ""}`}
            draggable={isAdmin}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            <EditableImage
              path={`introGallery.${i}.src`}
              src={item.src}
              alt={item.alt}
              className={item.tall ? "tall" : ""}
              loading="lazy"
            />
            <DeleteButton
              onClick={() => removeArrayItem("images", "introGallery", i)}
            />
          </div>
        ))}
        {isAdmin && (
          <div className="admin-add-btn-wrap" style={{ gridColumn: "1 / -1" }}>
            <AddButton
              label="Afegir imatge"
              onClick={() =>
                addArrayItem("images", "introGallery", {
                  src: "",
                  alt: "Nova imatge",
                  tall: false,
                })
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
