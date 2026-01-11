const input = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
const clearIcon = document.getElementById("clearIcon");
const noResult = document.getElementById("noResult");
const mainArea = document.getElementById("mainArea");
const hero = document.getElementById("hero");

let dataCache = [];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataCache = Array.isArray(data) ? data : [data];
  });

function clearResult() {
  mainArea.innerHTML = "";
  mainArea.style.display = "none";
  noResult.style.display = "none";
  hero.classList.remove("hero--collapsed");
}

function handleSearch() {
  const keyword = input.value.trim();
  clearResult();
  if (!keyword) return;

  const match = dataCache.find(
    item => item.name.toLowerCase() === keyword.toLowerCase()
  );

  if (!match) {
    noResult.style.display = "block";
    return;
  }

  hero.classList.add("hero--collapsed");
  mainArea.style.display = "block";

  mainArea.innerHTML = `
    <div class="section-title">1. About Protein</div>
    <div class="result-text">${match.description}</div>

    <div class="section-title">2. Aligned Wildtype-Mutant</div>
    <table class="result-table">
      <tr><th>항목</th><th>수치</th><th>의미</th></tr>
      <tr><td>비교 대상</td><td>${match.comparison.comparison_target.name}</td><td>${match.comparison.comparison_target.description}</td></tr>
      <tr><td>정렬 점수</td><td>${match.comparison.alignment_score.value}</td><td>${match.comparison.alignment_score.description}</td></tr>
      <tr><td>최종 정렬 원자 수</td><td>${match.comparison.aligned_atom_count.value}</td><td>${match.comparison.aligned_atom_count.description}</td></tr>
      <tr><td>최종 RMSD</td><td>${match.comparison.rmsd.value}</td><td>${match.comparison.rmsd.description}</td></tr>
    </table>

    <div class="section-title">3. Wildtype-Ligand & Mutant-Ligand</div>
    <table class="result-table">
      <tr><th>측정 항목</th><th>야생형</th><th>돌연변이</th><th>변화</th></tr>
      <tr>
        <td>최대 결합 친화도</td>
        <td>${match.binding_analysis.binding_affinity.wild_type}</td>
        <td>${match.binding_analysis.binding_affinity.mutant}</td>
        <td>${match.binding_analysis.binding_affinity.change}</td>
      </tr>
      <tr>
        <td>최소 Ki</td>
        <td>${match.binding_analysis.ki.wild_type}</td>
        <td>${match.binding_analysis.ki.mutant}</td>
        <td>${match.binding_analysis.ki.change}</td>
      </tr>
    </table>
  `;
}

searchIcon.addEventListener("click", handleSearch);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});

clearIcon.addEventListener("click", () => {
  input.value = "";
  clearResult();
  input.focus();
});