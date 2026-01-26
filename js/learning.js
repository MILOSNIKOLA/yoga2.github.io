// Learning Page Logic
(function () {
  "use strict";

  // Check authentication
  requireAuth();

  // State
  let articles = [];
  let readArticles = [];
  let currentUser = null;

  // Initialize
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    currentUser = getCurrentUser();
    if (!currentUser) return;

    loadArticles();
    loadReadArticles();
    setupEventListeners();
    renderArticles();
  }

  function setupEventListeners() {
    // Logout
    document.getElementById("logout-btn")?.addEventListener("click", logout);

    // Search
    document
      .getElementById("search-articles")
      ?.addEventListener("input", handleSearch);

    // Filter
    document
      .getElementById("filter-category")
      ?.addEventListener("change", handleFilter);

    // Modal close
    document
      .getElementById("close-article-modal")
      ?.addEventListener("click", closeModal);

    // Mark as read
    document
      .getElementById("mark-as-read-btn")
      ?.addEventListener("click", markCurrentAsRead);
  }

  function loadArticles() {
    // Hardcoded articles
    articles = [
      {
        id: "1",
        title: "Qu'est-ce que le yoga ?",
        category: "bases",
        readTime: "3 min",
        icon: "🧘",
        excerpt:
          "Découvrez les origines millénaires du yoga, ses différentes branches et comment il s'est adapté au monde moderne.",
        content: `
                    <h3>Les origines du yoga</h3>
                    <p>Le yoga trouve ses racines en Inde il y a plus de 5000 ans. Le mot "yoga" vient du sanskrit et signifie "union" - l'union du corps, de l'esprit et de l'âme.</p>
                    
                    <h3>Les 8 branches du yoga</h3>
                    <p>Selon les Yoga Sutras de Patanjali, le yoga traditionnel comprend 8 branches :</p>
                    <ul>
                        <li><strong>Yama</strong> : principes éthiques envers les autres</li>
                        <li><strong>Niyama</strong> : disciplines personnelles</li>
                        <li><strong>Asana</strong> : postures physiques</li>
                        <li><strong>Pranayama</strong> : contrôle du souffle</li>
                        <li><strong>Pratyahara</strong> : retrait des sens</li>
                        <li><strong>Dharana</strong> : concentration</li>
                        <li><strong>Dhyana</strong> : méditation</li>
                        <li><strong>Samadhi</strong> : état d'unité</li>
                    </ul>

                    <h3>Yoga moderne vs traditionnel</h3>
                    <p>Le yoga moderne se concentre souvent sur les <em>asanas</em> (postures) et le <em>pranayama</em> (respiration), tandis que le yoga traditionnel englobe un système philosophique complet de vie.</p>

                    <h3>Les bénéfices scientifiques</h3>
                    <p>De nombreuses études ont démontré les bienfaits du yoga :</p>
                    <ul>
                        <li>Réduction du stress et de l'anxiété</li>
                        <li>Amélioration de la flexibilité et de la force</li>
                        <li>Meilleure qualité de sommeil</li>
                        <li>Diminution des douleurs chroniques</li>
                        <li>Renforcement du système immunitaire</li>
                    </ul>
                `,
      },
      {
        id: "2",
        title: "Pourquoi respirer par le nez ?",
        category: "pranayama",
        readTime: "2 min",
        icon: "🌬️",
        excerpt:
          "La respiration nasale n'est pas qu'une recommandation : c'est une clé essentielle pour votre bien-être physique et mental.",
        content: `
                    <h3>Filtration naturelle de l'air</h3>
                    <p>Le nez filtre, réchauffe et humidifie l'air avant qu'il n'atteigne les poumons. Les poils nasaux et le mucus piègent les particules, bactéries et virus.</p>

                    <h3>Activation du système parasympathique</h3>
                    <p>La respiration nasale stimule le <strong>système nerveux parasympathique</strong>, responsable de la relaxation et de la régénération. C'est pourquoi respirer par le nez calme naturellement le mental.</p>

                    <h3>Production d'oxyde nitrique</h3>
                    <p>Les sinus produisent de l'oxyde nitrique (NO), un gaz qui :</p>
                    <ul>
                        <li>Améliore l'oxygénation du sang</li>
                        <li>Dilate les vaisseaux sanguins</li>
                        <li>Possède des propriétés antibactériennes</li>
                        <li>Renforce le système immunitaire</li>
                    </ul>

                    <h3>La connexion souffle-mental</h3>
                    <p>Dans le yoga, on dit que <em>"le souffle est le pont entre le corps et l'esprit"</em>. En contrôlant votre respiration, vous contrôlez votre état mental.</p>

                    <h3>Exercice pratique : Respiration alternée</h3>
                    <p>Essayez <strong>Nadi Shodhana</strong> (respiration alternée) :</p>
                    <ol>
                        <li>Bouchez votre narine droite avec le pouce</li>
                        <li>Inspirez par la narine gauche (4 secondes)</li>
                        <li>Bouchez les deux narines et retenez (4 secondes)</li>
                        <li>Relâchez la narine droite et expirez (4 secondes)</li>
                        <li>Inversez et répétez 5 fois</li>
                    </ol>
                `,
      },
      {
        id: "3",
        title: "La philosophie du yoga",
        category: "philosophie",
        readTime: "4 min",
        icon: "☯️",
        excerpt:
          "Au-delà des postures, le yoga est une philosophie de vie basée sur des principes éthiques millénaires.",
        content: `
                    <h3>Les Yamas : principes envers les autres</h3>
                    <p>Les <strong>Yamas</strong> sont 5 principes éthiques qui guident nos relations avec le monde :</p>
                    <ul>
                        <li><strong>Ahimsa</strong> (Non-violence) : ne pas nuire par la pensée, la parole ou l'action</li>
                        <li><strong>Satya</strong> (Vérité) : être honnête et authentique</li>
                        <li><strong>Asteya</strong> (Non-vol) : ne pas prendre ce qui ne nous appartient pas</li>
                        <li><strong>Brahmacharya</strong> (Modération) : utiliser son énergie avec sagesse</li>
                        <li><strong>Aparigraha</strong> (Non-attachement) : ne pas être possessif</li>
                    </ul>

                    <h3>Les Niyamas : disciplines personnelles</h3>
                    <p>Les <strong>Niyamas</strong> concernent notre relation à nous-mêmes :</p>
                    <ul>
                        <li><strong>Saucha</strong> (Pureté) : propreté du corps et de l'esprit</li>
                        <li><strong>Santosha</strong> (Contentement) : acceptation et gratitude</li>
                        <li><strong>Tapas</strong> (Discipline) : persévérance et effort</li>
                        <li><strong>Svadhyaya</strong> (Étude de soi) : introspection et lecture</li>
                        <li><strong>Ishvara Pranidhana</strong> (Lâcher-prise) : accepter ce qui est</li>
                    </ul>

                    <h3>Ahimsa : la non-violence au quotidien</h3>
                    <p><em>Ahimsa</em> ne signifie pas seulement ne pas faire de mal physiquement. Cela inclut :</p>
                    <ul>
                        <li>Parler avec bienveillance (à soi et aux autres)</li>
                        <li>Avoir des pensées positives</li>
                        <li>Respecter l'environnement</li>
                        <li>Être doux avec son corps pendant la pratique</li>
                    </ul>

                    <h3>Santosha : le pouvoir du contentement</h3>
                    <p><strong>Santosha</strong> nous invite à trouver la paix dans ce qui est, plutôt que de toujours chercher plus. C'est accepter le moment présent sans résistance.</p>

                    <p><em>"Le bonheur n'est pas d'avoir ce que l'on désire, mais de désirer ce que l'on a."</em></p>
                `,
      },
      {
        id: "4",
        title: "Les postures de base",
        category: "asanas",
        readTime: "5 min",
        icon: "🤸",
        excerpt:
          "Maîtrisez les postures fondamentales du yoga avec leurs alignements clés pour une pratique sûre et efficace.",
        content: `
                    <h3>1. Chien tête en bas (Adho Mukha Svanasana)</h3>
                    <p>La posture la plus iconique du yoga. Elle étire toute la chaîne postérieure et renforce les bras.</p>
                    <p><strong>Alignements clés :</strong></p>
                    <ul>
                        <li>Mains écartées largeur d'épaules, doigts bien écartés</li>
                        <li>Bras tendus, épaules loin des oreilles</li>
                        <li>Colonne vertébrale longue, dos plat</li>
                        <li>Talons poussent vers le sol (pas obligé de toucher)</li>
                        <li>Tête relâchée, regard vers les genoux</li>
                    </ul>

                    <h3>2. Guerrier I (Virabhadrasana I)</h3>
                    <p>Posture de force et d'ancrage qui ouvre les hanches et renforce les jambes.</p>
                    <p><strong>Alignements clés :</strong></p>
                    <ul>
                        <li>Jambe avant pliée à 90°, genou au-dessus de la cheville</li>
                        <li>Jambe arrière tendue, pied à 45°</li>
                        <li>Hanches face à l'avant autant que possible</li>
                        <li>Bras levés, paumes jointes ou parallèles</li>
                        <li>Regard vers le ciel ou droit devant</li>
                    </ul>

                    <h3>3. Posture de l'enfant (Balasana)</h3>
                    <p>Posture de repos et d'introspection, idéale entre deux postures intenses.</p>
                    <p><strong>Alignements clés :</strong></p>
                    <ul>
                        <li>Genoux écartés largeur de tapis</li>
                        <li>Gros orteils qui se touchent</li>
                        <li>Front au sol, bras tendus devant ou le long du corps</li>
                        <li>Respiration profonde dans le dos</li>
                        <li>Relâchement total des épaules et du cou</li>
                    </ul>

                    <h3>4. Guerrier II (Virabhadrasana II)</h3>
                    <p>Développe la concentration, l'équilibre et la force des jambes.</p>
                    <p><strong>Alignements clés :</strong></p>
                    <ul>
                        <li>Jambe avant pliée, genou aligné avec la cheville</li>
                        <li>Jambe arrière tendue, pied perpendiculaire</li>
                        <li>Bras parallèles au sol, en ligne avec les jambes</li>
                        <li>Épaules au-dessus des hanches</li>
                        <li>Regard vers la main avant</li>
                    </ul>

                    <h3>Conseils généraux</h3>
                    <p><strong>Ne jamais forcer :</strong> Le yoga n'est pas une compétition. Respectez vos limites.</p>
                    <p><strong>Respirer :</strong> Si vous ne pouvez plus respirer profondément, sortez légèrement de la posture.</p>
                    <p><strong>Activer le core :</strong> Engagez légèrement les abdominaux dans chaque posture pour protéger le dos.</p>
                `,
      },
      {
        id: "5",
        title: "Méditation pour débutants",
        category: "meditation",
        readTime: "3 min",
        icon: "🧠",
        excerpt:
          "Commencez la méditation sans stress avec ce guide simple et bienveillant. 5 minutes suffisent !",
        content: `
                    <h3>Différence yoga et méditation</h3>
                    <p>Le <strong>yoga</strong> prépare le corps et l'esprit à la méditation à travers les postures et la respiration. La <strong>méditation</strong> est l'état de présence et de conscience pure qui peut émerger.</p>
                    <p>On peut dire que le yoga est le chemin, et la méditation est la destination.</p>

                    <h3>Comment commencer ?</h3>
                    <p>Pas besoin d'être expert ou d'avoir un matériel spécial :</p>
                    <ol>
                        <li><strong>Trouvez un endroit calme</strong> où vous ne serez pas dérangé</li>
                        <li><strong>Asseyez-vous confortablement</strong> : sur une chaise, un coussin, ou même allongé</li>
                        <li><strong>Réglez un timer</strong> pour 5 minutes (pas plus au début !)</li>
                        <li><strong>Fermez les yeux</strong> et portez attention à votre respiration</li>
                        <li><strong>Observez sans juger</strong> quand votre esprit s'évade</li>
                    </ol>

                    <h3>La règle des 5 minutes par jour</h3>
                    <p>Mieux vaut <strong>5 minutes chaque jour</strong> que 30 minutes une fois par semaine. La régularité est la clé.</p>
                    <p>Commencez petit et augmentez progressivement. Après quelques semaines, vous pouvez passer à 10 minutes, puis 15, etc.</p>

                    <h3>Gérer les pensées</h3>
                    <p>❌ Idée reçue : "Je dois arrêter de penser"</p>
                    <p>✅ Réalité : Les pensées vont continuer. C'est normal et c'est OK.</p>
                    
                    <p>Le but n'est pas d'avoir un esprit vide, mais d'<strong>observer les pensées sans s'y accrocher</strong>.</p>
                    
                    <p>Imaginez vos pensées comme des nuages qui passent dans le ciel. Vous êtes le ciel, pas les nuages.</p>

                    <h3>Techniques simples</h3>
                    <p><strong>1. Comptage du souffle :</strong> Comptez vos respirations de 1 à 10, puis recommencez.</p>
                    <p><strong>2. Body scan :</strong> Portez attention à chaque partie du corps, des pieds à la tête.</p>
                    <p><strong>3. Mantra :</strong> Répétez un mot simple comme "paix", "calme" ou "om".</p>

                    <h3>Quand méditer ?</h3>
                    <p>Le <strong>matin au réveil</strong> est idéal car l'esprit est frais. Mais n'importe quel moment où vous pouvez être régulier fonctionne !</p>

                    <p><em>"La méditation n'est pas une évasion. C'est une rencontre sereine avec la réalité."</em> - Thich Nhat Hanh</p>
                `,
      },
    ];
  }

  function loadReadArticles() {
    try {
      const stored = localStorage.getItem(`readArticles_${currentUser.id}`);
      readArticles = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading read articles:", error);
      readArticles = [];
    }
  }

  function saveReadArticles() {
    try {
      localStorage.setItem(
        `readArticles_${currentUser.id}`,
        JSON.stringify(readArticles),
      );
    } catch (error) {
      console.error("Error saving read articles:", error);
    }
  }

  function renderArticles() {
    const grid = document.getElementById("articles-grid");
    const emptyState = document.getElementById("empty-articles");

    if (!grid) return;

    const searchQuery =
      document.getElementById("search-articles")?.value.toLowerCase() || "";
    const categoryFilter =
      document.getElementById("filter-category")?.value || "all";

    let filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery);
      const matchesCategory =
        categoryFilter === "all" || article.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";

    grid.innerHTML = filtered
      .map((article) => {
        const isRead = readArticles.includes(article.id);
        return `
                <div class="article-card" onclick="openArticle('${article.id}')">
                    <span class="article-icon">${article.icon}</span>
                    <h3 class="article-card-title">${article.title}</h3>
                    <div class="article-card-meta">
                        <span class="category-badge ${article.category}">
                            ${getCategoryLabel(article.category)}
                        </span>
                        <span>📖 ${article.readTime}</span>
                    </div>
                    <p class="article-card-excerpt">${article.excerpt}</p>
                    <div class="article-card-footer">
                        ${isRead ? '<span class="read-status">✓ Lu</span>' : ""}
                        <span class="read-link">Lire l'article →</span>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  function getCategoryLabel(category) {
    const labels = {
      bases: "Bases",
      pranayama: "Pranayama",
      philosophie: "Philosophie",
      asanas: "Asanas",
      meditation: "Méditation",
    };
    return labels[category] || category;
  }

  let currentArticleId = null;

  window.openArticle = function (id) {
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    currentArticleId = id;

    document.getElementById("article-title").textContent = article.title;
    document.getElementById("article-category").textContent = getCategoryLabel(
      article.category,
    );
    document.getElementById("article-category").className =
      `category-badge ${article.category}`;
    document.getElementById("article-read-time").textContent =
      `📖 ${article.readTime}`;
    document.getElementById("article-content").innerHTML = article.content;

    // Update button text
    const isRead = readArticles.includes(id);
    const markBtn = document.getElementById("mark-as-read-btn");
    if (markBtn) {
      markBtn.textContent = isRead ? "✓ Déjà lu" : "✓ Marquer comme lu";
      markBtn.disabled = isRead;
    }

    document.getElementById("article-modal").style.display = "flex";
  };

  function markCurrentAsRead() {
    if (!currentArticleId) return;

    if (!readArticles.includes(currentArticleId)) {
      readArticles.push(currentArticleId);
      saveReadArticles();
      renderArticles();

      const markBtn = document.getElementById("mark-as-read-btn");
      if (markBtn) {
        markBtn.textContent = "✓ Déjà lu";
        markBtn.disabled = true;
      }

      showToast("Article marqué comme lu ! 📚");
    }
  }

  function closeModal() {
    document.getElementById("article-modal").style.display = "none";
    currentArticleId = null;
  }

  function handleSearch() {
    renderArticles();
  }

  function handleFilter() {
    renderArticles();
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
})();
