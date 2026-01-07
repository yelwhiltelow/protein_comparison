const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const searchWrapper = document.getElementById("searchWrapper");
const searchBox = document.getElementById("searchBox");
const topBar = document.getElementById("topBar");

// 결과 출력 영역
const resultArea = document.createElement("div");
resultArea.id = "resultArea";
resultArea.style.width = "100%";
resultArea.style.maxWidth = "900px";
resultArea.style.margin = "40px auto";
document.querySelector(".page").appendChild(resultArea);

let dataCache = [];

// JSON 로드
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    // ✅ 배열 보정 (핵심)
    if (Array.isArray(data)) {
      dataCache = data;
    } else {
      dataCache = [data];
    }

    console.log("Loaded data:", dataCache);
  })
  .catch(err => {
    console.error("JSON 로드 실패:", err);
  });

function handleSearch() {
  const keyword = input.value.trim().toLowerCase();
  resultArea.innerHTML = "";

  if (!keyword) return;

  const match = dataCache.find(
    item => item.name.toLowerCase() === keyword
  );

  if (!match) {
    resultArea.innerHTML = "<p>일치하는 단백질 정보가 없습니다.</p>";
    return;
  }

  // 검색창 위치 이동
  topBar.after(searchWrapper);
  searchBox.classList.add("search--attached");

  resultArea.innerHTML = `
    <h2>About Protein</h2>
    <p>${match.description}</p>

    <h2>Aligned Wildtype-Mutant</h2>
    <table border="1" cellspacing="0" cellpadding="8">
      <tr>
        <th>항목</th><th>수치</th><th>의미</th>
      </tr>
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

    <h2>Wildtype-Ligand & Mutant-Ligand</h2>
    <table border="1" cellspacing="0" cellpadding="8">
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

// 이벤트 연결
button.addEventListener("click", handleSearch);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});