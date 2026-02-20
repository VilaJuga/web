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
  target.innerHTML = `
    <div class="wpr-wrapper wpr-vertical wpr-centered">
      <div class="wpr-timeline-centered wpr-line wpr-both-sided-timeline">
        <div class="wpr-middle-line"></div>
        <div class="wpr-timeline-fill" data-layout="centered"></div>
      ${items
        .map(
          (item) => `
        <article class="wpr-timeline-entry ${
          item.side === "left" ? "wpr-left-aligned" : "wpr-right-aligned"
        }">
          <time class="wpr-extra-label">
            <span class="wpr-label">${item.label}</span>
            <span class="wpr-sub-label">${item.subLabel}</span>
          </time>
          <div class="wpr-timeline-entry-inner">
            <div class="wpr-main-line-icon wpr-icon">
              <i aria-hidden="true" class="${item.iconClass}"></i>
            </div>
            <div class="wpr-story-info-vertical wpr-data-wrap">
              <div class="wpr-timeline-content-wrapper">
                <div class="wpr-content-wrapper">
                  <div class="wpr-title-wrap">
                    <span class="wpr-title">${item.title}</span>
                  </div>
                  <div class="wpr-description">
                    <p>${item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      `
        )
        .join("")}
      </div>
    </div>
  `;
}

export function renderVisit(titleTarget, addressTarget, visitSection, visit) {
  titleTarget.textContent = visit.title;
  addressTarget.textContent = visit.address;
  visitSection.style.background = `
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url("${visit.backgroundImage}") center/cover no-repeat
  `;
}
