import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";
import { EditableText, EditableImage } from "../components/Editable";
import { AddButton, DeleteButton } from "../components/AdminControls";

export default function HomeV2() {
  const { data, addCard, removeCard, addArrayItem, removeArrayItem, reorderArrayItem } = useSiteData();
  const { can } = useAuth();
  const canEditTexts = can("textos", "modificar");
  const canReorderCards = can("tarjetas", "modificar");
  const [heroIndex, setHeroIndex] = useState(0);

  // Drag state for gallery
  const [galleryDrag, setGalleryDrag] = useState({ from: null, over: null });
  // Drag state for feature cards
  const [cardsDrag, setCardsDrag] = useState({ from: null, over: null });

  useEffect(() => {
    if (!data.heroSlides || data.heroSlides.length <= 1) return;
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % data.heroSlides.length),
      7000
    );
    return () => clearInterval(t);
  }, [data.heroSlides]);

  const { intro, introGallery, cards, timelineItems, visit } = data;

  // ── Gallery handlers (images.introGallery is a simple array) ──
  function handleAddGalleryItem() {
    addArrayItem("images", "introGallery", {
      src: "",
      alt: "Nova imatge",
      tall: false,
    });
  }
  function handleRemoveGalleryItem(i) {
    removeArrayItem("images", "introGallery", i);
  }
  function handleGalleryDrop(toIndex) {
    const from = galleryDrag.from;
    if (from == null || from === toIndex) return;
    reorderArrayItem("images", "introGallery", from, toIndex);
    setGalleryDrag({ from: null, over: null });
  }

  // ── Cards reorder (cards are split between content.cards and images.cards) ──
  async function reorderCards(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    try {
      const newOrder = [...cards];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
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

  return (
    <>
      {/* ───── HERO FULL-WIDTH (blurred bg + sharp centered poster) ───── */}
      <section className="v2-hero v2-hero-full">
        {/* Blurred backgrounds filling the full width */}
        {data.heroSlides.map((src, i) => (
          <div
            key={i}
            className={`v2-hero-fullbg ${i === heroIndex ? "active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="v2-hero-fullbg-overlay" />

        {/* Sharp poster in the foreground */}
        <div className="v2-hero-full-inner">
          <div className="v2-hero-poster-stage">
            {data.heroSlides.map((src, i) => (
              <div
                key={i}
                className={`v2-hero-poster ${i === heroIndex ? "active" : ""}`}
              >
                <img src={src} alt="" />
              </div>
            ))}
          </div>
          {data.heroSlides.length > 1 && (
            <div className="v2-hero-pager">
              {data.heroSlides.map((_, i) => (
                <button
                  key={i}
                  className={i === heroIndex ? "active" : ""}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Anar al cartell ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───── TEXT ROW below the hero ───── */}
      <section className="v2-hero-text-section">
        <div className="v2-hero-text-row">
          <span className="v2-hero-kicker">Festival del joc del Penedès</span>
          <EditableText
            path="intro.description"
            value={intro.description}
            tag="p"
            className="v2-hero-desc"
          />
          <div className="v2-hero-actions">
            <Link to="/v2/activitats-2026" className="v2-btn v2-btn-primary">
              Veure activitats
            </Link>
            <Link to="/v2/ludoteca" className="v2-btn v2-btn-ghost">
              Explorar ludoteca
            </Link>
          </div>
        </div>
      </section>

      {/* ───── STATS / PULSE ───── */}
      <section className="v2-stats">
        <div className="v2-stat">
          <span className="v2-stat-num">300+</span>
          <span className="v2-stat-label">Jocs de taula</span>
        </div>
        <div className="v2-stat">
          <span className="v2-stat-num">{timelineItems.length}</span>
          <span className="v2-stat-label">Espais temàtics</span>
        </div>
        <div className="v2-stat">
          <span className="v2-stat-num">∞</span>
          <span className="v2-stat-label">Diversió garantida</span>
        </div>
      </section>

      {/* ───── GALLERY MOSAIC ───── */}
      <section className="v2-section v2-mosaic-section">
        <div className="v2-section-header">
          <span className="v2-eyebrow">Galeria</span>
          <h2>Viu el festival</h2>
          <div className="v2-section-divider" />
        </div>
        <div className="v2-mosaic">
          {introGallery.map((img, i) => (
            <div
              key={i}
              className={`v2-mosaic-item admin-item-wrap ${img.tall ? "tall" : ""}${
                canEditTexts ? " admin-draggable" : ""
              }${galleryDrag.over === i ? " drag-over" : ""}${
                galleryDrag.from === i ? " dragging" : ""
              }`}
              draggable={canEditTexts}
              onDragStart={() => setGalleryDrag({ from: i, over: null })}
              onDragOver={(e) => {
                e.preventDefault();
                if (galleryDrag.from != null && i !== galleryDrag.from) {
                  setGalleryDrag((d) => ({ ...d, over: i }));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleGalleryDrop(i);
              }}
              onDragEnd={() => setGalleryDrag({ from: null, over: null })}
            >
              <DeleteButton
                onClick={() => handleRemoveGalleryItem(i)}
                resource="textos"
                action="modificar"
              />
              <EditableImage
                path={`introGallery.${i}.src`}
                src={img.src}
                alt={img.alt}
                loading="lazy"
              />
              <div className="v2-mosaic-overlay">
                <span>{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="admin-add-btn-wrap">
          <AddButton
            label="Afegir imatge a la galeria"
            onClick={handleAddGalleryItem}
            resource="textos"
            action="modificar"
          />
        </div>
      </section>

      {/* ───── FEATURE CARDS ───── */}
      <section className="v2-section v2-features-section">
        <div className="v2-section-header">
          <span className="v2-eyebrow">Què t'oferim</span>
          <h2>Què hi trobaràs?</h2>
          <div className="v2-section-divider" />
        </div>
        <div className="v2-features">
          {cards.map((card, i) => (
            <article
              key={i}
              className={`v2-feature-card admin-item-wrap${
                canReorderCards ? " admin-draggable" : ""
              }${cardsDrag.over === i ? " drag-over" : ""}${
                cardsDrag.from === i ? " dragging" : ""
              }`}
              draggable={canReorderCards}
              onDragStart={() => setCardsDrag({ from: i, over: null })}
              onDragOver={(e) => {
                e.preventDefault();
                if (cardsDrag.from != null && i !== cardsDrag.from) {
                  setCardsDrag((d) => ({ ...d, over: i }));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (cardsDrag.from != null && cardsDrag.from !== i) {
                  reorderCards(cardsDrag.from, i);
                }
                setCardsDrag({ from: null, over: null });
              }}
              onDragEnd={() => setCardsDrag({ from: null, over: null })}
            >
              <DeleteButton
                onClick={() => removeCard(i)}
                resource="tarjetas"
                action="eliminar"
              />
              <div className="v2-feature-img-wrap">
                <EditableImage
                  path={`cards.${i}.src`}
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  resource="tarjetas"
                  action="modificar"
                />
                <div className="v2-feature-number">{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div className="v2-feature-body">
                <EditableText
                  path={`cards.${i}.title`}
                  value={card.title}
                  tag="h3"
                  className="v2-feature-title"
                  resource="tarjetas"
                  action="modificar"
                />
                <EditableText
                  path={`cards.${i}.text`}
                  value={card.text}
                  tag="p"
                  className="v2-feature-text"
                  resource="tarjetas"
                  action="modificar"
                />
              </div>
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

      {/* ───── TIMELINE VERTICAL MODERNA ───── */}
      <section className="v2-section v2-timeline-section">
        <div className="v2-section-header light">
          <span className="v2-eyebrow light">Experiències</span>
          <h2>Què s'hi inclou?</h2>
          <div className="v2-section-divider" />
        </div>
        <div className="v2-timeline">
          {timelineItems.map((item, i) => (
            <div
              key={i}
              className={`v2-timeline-item ${item.side === "left" ? "left" : "right"}`}
            >
              <div className="v2-timeline-dot">
                <i className={item.iconClass} aria-hidden="true" />
              </div>
              <div className="v2-timeline-card">
                <span className="v2-timeline-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p className="v2-timeline-sub">{item.subLabel}</p>
                <p className="v2-timeline-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── VISIT CTA ───── */}
      <section
        className="v2-visit"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(10,10,30,0.75), rgba(0,0,0,0.55)), url('${visit.backgroundImage}')`,
        }}
      >
        <div className="v2-visit-content">
          <span className="v2-eyebrow light">On trobar-nos</span>
          <EditableText
            path="visit.title"
            value={visit.title}
            tag="h2"
            className="v2-visit-title"
          />
          <EditableText
            path="visit.address"
            value={visit.address}
            tag="p"
            className="v2-visit-address"
          />
          <Link to="/v2/com-arribar" className="v2-btn v2-btn-primary">
            Com arribar →
          </Link>
        </div>
      </section>
    </>
  );
}
