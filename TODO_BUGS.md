# e-Social Systems — Bug Fixes Todo List

**Project:** Application JavaScript simulant un organisme de sécurité sociale (type CNSS)  
**Generated:** 12 février 2026

Ce document recense les bugs et améliorations identifiés dans le codebase, classés en 3 niveaux de priorité.

---

## Niveau 1 — Critique / Haute priorité

Bugs qui provoquent des calculs incorrects, des crashs, ou bloquent les fonctionnalités principales.

| # | Ticket | Description | Fichier(s) | Impact |
|---|--------|-------------|------------|--------|
| 1.1 | **Calcul cotisation patronale incorrecte** | `get_employee_rights()` applique un plafond à la part patronale avec `Math.min(employee.salary, 6000) * 0.08` alors que la part patronale ne doit pas être plafonnée. | `src/lib/functions.js` L51-52 | Totaux droits sociaux erronés |
| 1.2 | **Moyenne patronale dans `Declaration.total_contribution` et `penalties`** | Utilisation de `employer.contribution / employer.employee_count` au lieu de la contribution réelle par employé (`employee.salary * 0.08`). | `src/lib/classes.js` L129, L138 | Montants par déclaration faux |
| 1.3 | **`generateExampleData()` appelé plusieurs fois** | `assures.js`, `declaration.js` et `Historique.js` appellent tous `generateExampleData()` au chargement. Les pages sont importées ensemble → données dupliquées. | `src/pages/assures.js`, `declaration.js`, `Historique.js` | Données multipliées à chaque chargement |
| 1.4 | **Crash si employeur inexistant dans le Dashboard** | `EMPLOYERS.get(decl.employer_id).company_name` sans vérification de null → crash si `employer_id` invalide. | `src/pages/Dashboard.js` L214 | Erreur fatale sur tableau de bord |
| 1.5 | **Déclaration non fonctionnelle** | Le bouton "Déclarer" affiche uniquement un toast ; aucune création de `Declaration`, pas de lecture du mois, pas de validation unicité (employeur + mois). | `src/pages/declaration.js` | Fonctionnalité non implémentée |
| 1.6 | **Ajout assuré sans employeur sélectionné** | `add_employee(employeurSelect.value, emp)` avec `""` si aucun employeur → `EMPLOYERS.get("")` = undefined → crash. | `src/pages/assures.js` L332 | Crash à l’ajout d’assuré sans employeur |
| 1.7 | **Liste employeurs dupliquée** | `displayEmployers()` n’efface pas le `tbody` avant de remplir ; chaque soumission ajoute des lignes sans vider les anciennes. | `src/pages/Employeurs.js` L306-319 | Doublons dans le tableau |
| 1.8 | **Tests vs implémentation incohérents** | Tests utilisent `new Employer("Tech", "Company A", 100000)` alors que `Employer` n’accepte que `(sector, company_name)`. | `src/lib/functions.test.js` | Suite de tests en échec |

---

## Niveau 2 — Moyenne priorité

Bugs qui altèrent le comportement attendu, l’UX ou ne respectent pas les specs.

| # | Ticket | Description | Fichier(s) | Impact |
|---|--------|-------------|------------|--------|
| 2.1 | **Secteurs employeurs incohérents** | Options du formulaire (Technologie, Industrie, Commerce, etc.) ne correspondent pas à `sector_list` (Technology, Healthcare, Education, etc.). `"Technologie"` → fallback sur `"Other"`. | `src/pages/Employeurs.js` L53-59, `src/lib/classes.js` | Secteur toujours "Other" |
| 2.2 | **Typo Dashboard** | Texte "MSur l'ensemble des assurés" au lieu de "Sur l'ensemble des assurés". | `src/pages/Dashboard.js` L69 | Erreur de présentation |
| 2.3 | **Doublons dans `get_all_employees()`** | Si un employé apparaît chez plusieurs employeurs, il peut être retourné plusieurs fois. | `src/lib/functions.js` L24-31 | Doublons dans la liste des assurés |
| 2.4 | **IDs HTML dupliqués** | Deux éléments avec `id="filter__employer"` (employeur et mois). | `src/pages/Historique.js` L43, L62 | HTML invalide, risque de sélecteurs erronés |
| 2.5 | **Unicité des déclarations** | Spécification : unicité (employeur + mois). Le modèle actuel est par employé/mois ; pas de contrôle de doublon. | `src/lib/functions.js`, `src/pages/declaration.js` | Doublons possibles |
| 2.6 | **`Employee.months_declared` inutilisé** | Propriété jamais mise à jour ; `get_employee_declared_months()` recalcule à partir des déclarations. | `src/lib/classes.js`, `src/pages/assures.js` | Code mort / confusion |
| 2.7 | **Pénalités de retard mal définies** | `days_late = days_since - 30` par rapport à la date de déclaration, pas à une échéance métier (ex. fin du mois suivant). | `src/lib/classes.js` L123-129 | Logique métier imprécise |
| 2.8 | **`data.js` vs `example.js`** | `src/utils/data.js` utilise `Employer(sector, company_name, income_per_month)` et `Declaration` avec `month` (nombre) ; API incompatible avec le reste du projet. | `src/utils/data.js` | Risque d’usage incorrect |
| 2.9 | **Historique : `render_table` sur tableau** | `Array.from(data.values())` sur un tableau ; `data` est déjà un tableau. Utiliser directement `data` ou `Array.from(data)`. | `src/pages/Historique.js` L354 | Redondance / confusion |
| 2.10 | **Colonne "Salarie" dans Historique** | Affiche `employer.employee_count` (total employés) au lieu du nombre lié à la déclaration (1 par ligne). | `src/pages/Historique.js` L418 | Affichage trompeur |

---

## Niveau 3 — Basse priorité

Améliorations, qualité de code et fonctionnalités bonus manquantes.

| # | Ticket | Description | Fichier(s) | Impact |
|---|--------|-------------|------------|--------|
| 3.1 | **Détection d’anomalies (bonus)** | Aucune implémentation de la détection de salaires anormalement élevés ni d’alertes métier. | À créer | Fonctionnalité bonus absente |
| 3.2 | **Arrondi non homogène** | Certaines fonctions arrondissent (ex. `Math.ceil`) à des niveaux différents ; stratégie d’arrondi à standardiser. | `src/lib/functions.js`, `classes.js` | Montants incohérents |
| 3.3 | **Input mois sans `id`** | Le champ mois de la déclaration n’a pas d’`id`, donc inaccessible pour le script. | `src/pages/declaration.js` L30 | Impossible de lire le mois |
| 3.4 | **`cleanup` Historique incomplet** | `reset_filters_handler`, `apply_filters_handler`, etc. ne sont pas nettoyés au `cleanup`. | `src/pages/Historique.js` L420-427 | Risque de fuites mémoire / listeners |
| 3.5 | **Emplacement des données d’exemple** | Centraliser `generateExampleData()` (ex. dans `app.js` ou au chargement du router) plutôt que dans chaque page. | `src/pages/*.js`, `src/app.js` | Architecture plus claire |
| 3.6 | **Tests `get_days_between_dates`** | Le test leap year attend 29 jours entre 2020-02-01 et 2020-03-01 ; la logique actuelle peut différer selon l’implémentation. À valider. | `src/lib/functions.test.js` L99-103 | Tests potentiellement fragiles |
| 3.7 | **Import `html` dans `assures.js`** | `renderTable` utilise `html\`...\`` mais le résultat est une chaîne ; vérifier que l’échappement HTML est correct pour éviter les XSS. | `src/pages/assures.js` | Sécurité (si données utilisateur) |
| 3.8 | **Employeur vide dans le select Déclarations** | Vérifier qu’aucune option vide ou invalide n’est ajoutée si la liste d’employeurs est vide. | `src/pages/declaration.js` L134-139 | UX / validation |

---

## Résumé par priorité

| Priorité | Nombre de tickets |
|----------|-------------------|
| Niveau 1 — Critique | 8 |
| Niveau 2 — Moyenne | 10 |
| Niveau 3 — Basse | 8 |

---

## Conformité au brief projet

| Exigence | Statut |
|----------|--------|
| Gestion des employeurs (ajout, association employés) | Partiellement OK — bugs sector, duplication |
| Gestion des assurés (ajout, liaison, mise à jour salaire) | Partiellement OK — validation employeur manquante |
| Déclaration mensuelle | Non implémentée |
| Unicité déclaration (employeur + mois) | Non implémentée |
| Calcul cotisations (salariale, patronale, plafond) | Bugs de plafond et de calcul |
| Droits sociaux (mois déclarés, total cotisations) | OK avec bugs de calcul |
| Pénalités de retard | Logique à clarifier |
| Statistiques globales | OK avec risque de crash |
| Historique et filtres | OK avec bugs mineurs |
| Détection d’anomalies (bonus) | Non implémentée |

---

## Ordre de correction suggéré

1. **Niveau 1** : tickets 1.3 (données dupliquées), 1.7 (doublons employeurs), 1.6 (validation employeur), 1.4 (crash Dashboard), 1.1–1.2 (calculs), 1.5 (déclarations), 1.8 (tests).
2. **Niveau 2** : corriger secteurs, typo, unicité déclarations, IDs, pénalités.
3. **Niveau 3** : détection d’anomalies, nettoyage du code, standardisation des arrondis.
