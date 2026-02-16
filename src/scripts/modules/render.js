export function renderNav(target, links) {
  target.innerHTML = links
    .map(
      (link) => `
      <li>
        <a class="${link.active ? "active" : ""}" href="${link.href}">${link.label}</a>
      </li>`
    )
    .join("");
}

export function renderHero(target, slides) {
  target.innerHTML = `
    ${slides
      .map(
        (slide, index) =>
          `<div class="hero-slide ${index === 0 ? "active" : ""}" style="background-image: url('${slide}');"></div>`
      )
      .join("")}
    <button class="hero-arrow prev" aria-label="Anterior">‹</button>
    <button class="hero-arrow next" aria-label="Següent">›</button>
    <div class="hero-dots" aria-label="Paginació slider"></div>
  `;
}

export function renderIntro(titleTarget, descriptionTarget, galleryTarget, intro, gallery) {
  titleTarget.textContent = intro.title;
  descriptionTarget.textContent = intro.description;

  galleryTarget.innerHTML = gallery
    .map(
      (item) =>
        `<img class="${item.tall ? "tall" : ""}" src="${item.src}" alt="${item.alt}" loading="lazy" />`
    )
    .join("");
}

export function renderCards(target, cards) {
  target.innerHTML = cards
    .map(
      (card) => `
      <article class="card">
        <img src="${card.image}" alt="${card.alt}" loading="lazy" />
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </article>
    `
    )
    .join("");
}

export function renderTimeline(target, items) {
  target.innerHTML = items
    .map(
      (item) => `
      <article class="timeline-item ${item.side}">
        <div class="timeline-chip">
          <h3>${item.chipTitle}</h3>
          <p>${item.chipText}</p>
        </div>
        <div class="timeline-content">
          <h4>${item.contentTitle}</h4>
          <p>${item.contentText}</p>
        </div>
      </article>
    `
    )
    .join("");
}

export function renderVisit(titleTarget, addressTarget, visitSection, visit) {
  titleTarget.textContent = visit.title;
  addressTarget.textContent = visit.address;
  visitSection.style.background = `
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url("${visit.backgroundImage}") center/cover no-repeat
  `;
}
