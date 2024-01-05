let repeaterCount = 1;

function addRepeater(event) {
  repeaterCount++;
  const mainForm = document.getElementById('mainForm');
  const newRepeater = document.createElement('div');
  newRepeater.classList.add('repeater');
  newRepeater.id = repeaterCount;

  newRepeater.innerHTML = `
  <div class="box">
  <label for="elementName">Element Name:</label>
  <input class="elementName" type="text" name="elementName" required />
  <label for="elementType">Element Type:</label>
  <select
    class="elementType"
    name="elementType"
    onchange="handleSelectChange(this)"
  >
    <option selected value="text">Text</option>
    <option value="email">Email</option>
    <option value="password">Password</option>
    <option value="select">Select</option>
  </select>
  <label for="elementRequired">Element Required:</label>
  <select class="elementRequired" name="elementRequired">
    <option selected value="yes">Yes</option>
    <option value="no">No</option>
  </select>
  <button class="remove" onclick="removeRepeater(this)">-</button>
  <button class="add" onclick="addRepeater(this)">+</button>
</div>
<div class="onSelect">
  <span class="options">
    <p>Add your options</p>
    <button class="addOption" onclick="addOption(this)">+</button>
  </span>
  <div class="list">
    <label for="Option">Option:</label>
    <input class="option" type="text" name="Option" />
    <button class="removeOption" onclick="removeOption(this)">-</button>
  </div>
</div>
  `;

  const generateFormButton = document.getElementById('generateForm');
  mainForm.insertBefore(newRepeater, generateFormButton);
}

function removeRepeater(button) {
  if (repeaterCount === 1) return;
  const repeaterToRemove = button.closest('.repeater');
  repeaterToRemove.remove();
  repeaterCount--;
}

function handleSelectChange(selectElement) {
  // Get the selected value
  const parentElementId = selectElement.closest('.repeater').id;
  const onSelectDiv = document.getElementById(parentElementId).querySelector('.onSelect');
  if (selectElement.value === 'select') {
    onSelectDiv.style.display = 'block';
  } else {
    onSelectDiv.style.display = 'none';
  }
}

function addOption(button) {
  const onSelect = button.closest('.onSelect');
  const newList = document.createElement('div');
  newList.classList.add('list');
  newList.innerHTML = `
    <label for="Option">Option:</label>
    <input class="option" type="text" name="Option" />
    <button class="removeOption" onclick="removeOption(this)">-</button>
    `;
  onSelect.appendChild(newList);
}

function removeOption(button) {
  const optionToRemove = button.closest('.list');
  optionToRemove.remove();
}

function formGenerator(event) {
  event.preventDefault();
  let form = [];
  let repeaters = document.getElementsByClassName('repeater');
  for (let it = 0; it < repeaters.length; it++) {
    let box = repeaters[it].getElementsByClassName('box')[0];
    let elementName = box.querySelector(".elementName").value;
    let elementType = box.querySelector('.elementType').value;
    let elementRequired = box.querySelector(".elementRequired").value;
    let options = [];

    if (elementType === 'select') {
      let OptionsDiv = repeaters[it].getElementsByClassName('onSelect')[0];
      let elementOptions = OptionsDiv.getElementsByClassName('list');
      for (let i = 0; i < elementOptions.length; i++) {
        let option = elementOptions[i].getElementsByClassName('option')[0].value;
        options.push(option);
      }
    }
    else {
      options = null;
    }
    let element = {
      elementName: elementName,
      elementType: elementType,
      elementRequired: elementRequired,
      options: options
    };
    form.push(element);
  }

  cleanPage();
  displayForm(form);
  return false;
}

function cleanPage() {
  repeaterCount = 1;

  let body = document.getElementsByTagName('body')[0];

  body.innerHTML = `
  <h1>Form Builder</h1>
    <form id="mainForm" onsubmit="formGenerator(event)" method="post">
      <div id="1" class="repeater">
        <div class="box">
          <label for="elementName">Element Name:</label>
          <input class="elementName" type="text" name="elementName" required />
          <label for="elementType">Element Type:</label>
          <select
            class="elementType"
            name="elementType"
            onchange="handleSelectChange(this)"
          >
            <option selected value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="select">Select</option>
          </select>
          <label for="elementRequired">Element Required:</label>
          <select class="elementRequired" name="elementRequired">
            <option selected value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button class="remove" onclick="removeRepeater(this)">-</button>
          <button class="add" onclick="addRepeater(this)">+</button>
        </div>
        <div class="onSelect">
          <span class="options">
            <p>Add your options</p>
            <button class="addOption" onclick="addOption(this)">+</button>
          </span>
          <div class="list">
            <label for="Option">Option:</label>
            <input class="option" type="text" name="Option" />
            <button class="removeOption" onclick="removeOption(this)">-</button>
          </div>
        </div>
      </div>
      <button id="generateForm" type="submit">Generate Form</button>
    </form>
    `

};

function displayForm(form) {
  const newForm = document.createElement('form');
  newForm.setAttribute('class', 'newForm');
  for (let i = 0; i < form.length; i++) {
    const newSpan = document.createElement('span');
    const newLabel = document.createElement('label');
    newLabel.innerText = form[i].elementName + ":";

    if (form[i].elementType === 'select') {
      const newSelect = document.createElement('select');
      newLabel.setAttribute('for', form[i].elementName);
      newSelect.setAttribute('name', form[i].elementName);

      if (form[i].elementRequired === 'yes') {
        newSelect.setAttribute('required', 'required');
      }
      for (let j = 0; j < form[i].options.length; j++) {
        const newOption = document.createElement('option');
        newOption.innerText = form[i].options[j];
        newSelect.appendChild(newOption);
      }

      newSpan.appendChild(newLabel);
      newSpan.appendChild(newSelect);
    }
    else {
      const newInput = document.createElement('input');
      newLabel.setAttribute('for', form[i].elementName);
      newInput.setAttribute('name', form[i].elementName);

      if (form[i].elementRequired === 'yes') {
        newInput.setAttribute('required', 'required');
      }

      if (form[i].elementType === 'email') {
        newInput.setAttribute('type', 'email');
      } else if (form[i].elementType === 'password') {
        newInput.setAttribute('type', 'password');
        newInput.setAttribute('pattern', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$');
      } else {
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('pattern', '^[a-zA-Z]+$');
      }

      newSpan.appendChild(newLabel);
      newSpan.appendChild(newInput);
    }

    newSpan.setAttribute('class', 'newSpan');
    newForm.appendChild(newSpan);
  }

  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.innerText = 'Submit';
  newForm.appendChild(button);

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(newForm);
}
