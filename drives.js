if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

async function loadFaults() {
  const invtResponse = await fetch("data/invt.json");
  const invtFaults = await invtResponse.json();

  const inovanceResponse = await fetch("data/inovance.json");
  const inovanceFaults = await inovanceResponse.json();

  const faults = [...invtFaults, ...inovanceFaults];

  const makeSelect = document.getElementById("make-input");
  const errorSelect = document.getElementById("err-input");

  makeSelect.addEventListener("change", () => {
    const selectedMake = makeSelect.value;
    populateModels(faults, selectedMake);
    errorSelect.length = 1;
    clearResults();
  });

  const modelSelect = document.getElementById("model-input");

  modelSelect.addEventListener("change", () => {
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    populateErrorCodes(faults, selectedMake, selectedModel);
    clearResults();
  });

  function populateList(elementId, items) {
    const list = document.getElementById(elementId);
    list.innerHTML = "";

    for (const item of items) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
  }

  errorSelect.addEventListener("change", () => {
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const selectedErrorCode = errorSelect.value;

    const match = faults.find(
      (f) =>
        f.make === selectedMake &&
        f.model === selectedModel &&
        f.errorCode === selectedErrorCode,
    );

    if (!match) {
      clearResults();
      return;
    }
    document.getElementById("results").classList.add("has-result");
    document.getElementById("err-desc").textContent = `${match.description}`;
    populateList("err-cause", match.possibleCauses);
    populateList("err-solution", match.solutions);
  });

  populateMakes(faults);
}

function populateMakes(faults) {
  const uniqueMakes = [...new Set(faults.map((f) => f.make))];
  const makeSelect = document.getElementById("make-input");
  makeSelect.length = 1;

  for (const make of uniqueMakes) {
    const option = document.createElement("option");
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  }
}

function populateModels(faults, selectedMake) {
  const modelsForMake = faults.filter((f) => f.make === selectedMake);
  const uniqueModels = [...new Set(modelsForMake.map((f) => f.model))];
  const modelSelect = document.getElementById("model-input");
  modelSelect.length = 1;

  for (const model of uniqueModels) {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  }
}

function populateErrorCodes(faults, selectedMake, selectedModel) {
  const errForModel = faults.filter(
    (f) => f.make === selectedMake && f.model === selectedModel,
  );
  const uniqueErr = [...new Set(errForModel.map((f) => f.errorCode))];
  const errorSelect = document.getElementById("err-input");
  errorSelect.length = 1;

  for (const errorCode of uniqueErr) {
    const option = document.createElement("option");
    option.value = errorCode;
    option.textContent = errorCode;
    errorSelect.appendChild(option);
  }
}

function clearResults() {
  document.getElementById("err-desc").textContent = "";
  document.getElementById("err-cause").innerHTML = "";
  document.getElementById("err-solution").innerHTML = "";
  document.getElementById("results").classList.remove("has-result");
}

loadFaults();
