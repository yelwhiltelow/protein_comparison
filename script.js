const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const searchWrapper = document.getElementById("searchWrapper");
const searchBox = document.getElementById("searchBox");
const topBar = document.getElementById("topBar");
const mainArea = document.getElementById("mainArea");

/* 결과 영역 (성공 시만 사용) */
const resultArea = document.createElement("div");
resultArea.id = "resultArea";
mainArea.appendChild(resultArea);

/* 검색 실패 메시지 (검색창 아래 고정) */
const noResultMsg = document.createElement("div");
noResultMsg.className = "no-result";
noResultMsg.textContent = "일치하는 단백질 정보가 없습니다";
noResultMsg.style.display = "none";
searchWrapper.appendChild(noResultMsg);

let dataCache = [];

/* JSON 로드 */
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataCache = Array.isArray(data) ? data : [data];
  });

function resetToCenter() {
  mainArea.appendChild(searchWrapper);
  searchBox.classList.remove("search--attached");
  resultArea.innerHTML = "";
  noResultMsg.style.display = "none";
}

function handleSearch() {
  const keyword = input.value.trim();

  /* 빈 입력 */
  if (keyword === "") {
    resetToCenter();
    return;
  }

  const match = dataCache.find(
    item => item.name.toLowerCase() === keyword.toLowerCase()
  );

  /* ❌ 검색 실패 */
  if (!match) {
    resetToCenter();
    noResultMsg.style.display = "block";
    return;
  }

  /* ✅ 검색 성공 */
  noResultMsg.style.display = "none";
  topBar.after(searchWrapper);
  searchBox.classList.add("search--attached");

  resultArea.innerHTML = `
    <div class="section-title">1. About Protein</div>
    <div class="result-text">${match.description}</div>

    <div class="section-title">2. Aligned Wildtype-Mutant</div>
    <table class="result-table">
      <tr><th>항목</th><th>수치</th><th>의미</th></tr>
      <tr>
        <td>비교 대상</td>
        <td>${match.comparison.comparison_target.name}</td>
        <td>${match.comparison.comparison_target.description}</td>
      </tr>
      <tr>
        <td>정렬 점수</td>
        <td>${match.comparison.alignment_score.value}</td>
        <td>${match.comparison.alignment_score.description}</td>
      </tr>
      <tr>
        <td>최종 정렬 원자 수</td>
        <td>${match.comparison.aligned_atom_count.value}</td>
        <td>${match.comparison.aligned_atom_count.description}</td>
      </tr>
      <tr>
        <td>최종 RMSD</td>
        <td>${match.comparison.rmsd.value}</td>
        <td>${match.comparison.rmsd.description}</td>
      </tr>
    </table>

    <div class="section-title">3. Wildtype-Ligand & Mutant-Ligand</div>
    <table class="result-table">
      <tr>
        <th>측정 항목</th>
        <th>야생형</th>
        <th>돌연변이</th>
        <th>변화</th>
      </tr>
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

/* 이벤트 */
button.addEventListener("click", handleSearch);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});