let toggleList = document.querySelectorAll('.toggle');
let actionsContainer = document.querySelector('.account-actions');

function toggleSection(e){    
    let isSectionVisible = false;
    toggleList.forEach(function(section){
        if(section.classList.contains(e.target.id)){
            if(section.style.display == 'block'){
                section.style.display = 'none'
            }else{
                section.style.display = 'block';
                isSectionVisible = true;
            }
        }else{
            section.style.display = 'none';
        }

        if(isSectionVisible){
            actionsContainer.style.flexBasis = '200px';
        }else{
            actionsContainer.style.flexBasis = '100px';
        }
    })    
}

document.querySelector('#deposit').addEventListener('click', (e) => toggleSection(e));
document.querySelector('#transfer').addEventListener('click', (e) => toggleSection(e))
document.querySelector('#withdraw').addEventListener('click', (e) => toggleSection(e))

let usersList = [
  {
    id: 123,
    firstName: 'Nate',
    lastName: 'Haile',
    email: 'natnael@gmail.com',
    tel: '00447654312566',
    address: {
      line1: '1 Oxford House',
      line2: 'Victoria Street',
      postcode: 'SW1E 5AD',
      city: 'London'
    },
    accounts: new Map([
      [
        'AC12314',
        {
          id: 321,
          type: 'CurrentAccount',
          accountNumber: 'AC12345',
          sortCode: '110022',
          balance: 10547
        }
      ]
    ])
  },
  {
    id: 124,
    firstName: 'Daniel',
    lastName: 'Ghirmay',
    email: 'daniel@gmail.com',
    tel: '00447854712566',
    address: {
      line1: 'Flat 1 George House',
      line2: 'King William Road',
      postcode: 'WC1 2HA',
      city: 'London'
    },
    accounts: new Map([
      [
        'AC12312',
        {
          id: 543,
          type: 'CurrentAccount',
          accountNumber: 'AC12312',
          sortCode: '125322',
          balance: 5000
        }
      ]
    ])
  },
  // Abel
  {
    id: 125,
    firstName: 'Abel',
    lastName: 'Tesfay',
    email: 'abel.tesfay@gmail.com',
    tel: '00447555123456',
    address: {
      line1: '12 Sunrise Apartments',
      line2: 'Main Street',
      postcode: 'AB12 3CD',
      city: 'Asmara'
    },
    accounts: new Map([
      [
        'AC56789',
        {
          id: 654,
          type: 'SavingsAccount',
          accountNumber: 'AC56789',
          sortCode: '210033',
          balance: 7500
        }
      ]
    ])
  },
  // Sami
  {
    id: 126,
    firstName: 'Sami',
    lastName: 'Kebede',
    email: 'sami.kebede@gmail.com',
    tel: '00447777123456',
    address: {
      line1: '5 Green Villas',
      line2: 'Elm Road',
      postcode: 'XY98 7ZT',
      city: 'Addis Ababa'
    },
    accounts: new Map([
      [
        'AC67890',
        {
          id: 765,
          type: 'SavingsAccount',
          accountNumber: 'AC67890',
          sortCode: '310044',
          balance: 8900
        }
      ]
    ])
  }
];

// Search by account number
document.querySelector(".btn-find").addEventListener("click", function () {
    let searchValue = document.getElementById("search").value.trim();

    if (!searchValue) {
        alert("Please enter an account number.");
        return;
    }

    // Normalize search: remove dashes and uppercase
    let normalizedSearch = searchValue.replace(/-/g, "").toUpperCase();

    let foundUser = null;
    let foundAccount = null;

    usersList.forEach(user => {
        user.accounts.forEach(account => {
            let normalizedAccount = account.accountNumber.replace(/-/g, "").toUpperCase();
            if (normalizedAccount === normalizedSearch) {
                foundUser = user;
                foundAccount = account;
            }
        });
    });

    if (!foundUser) {
        alert("Account not found.");
        return;
    }

    currentUser = foundUser;
    currentAccount = foundAccount;
    updateAccountDisplay();
});


// Account Display Initializer

let currentUser = usersList[0]; // Default logged-in user (Nate)
let currentAccount = [...currentUser.accounts.values()][0];

function updateAccountDisplay() {
    document.getElementById('fullname').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('email').textContent = currentUser.email;
    document.getElementById('tel').textContent = currentUser.tel;
    document.getElementById('address').textContent = `${currentUser.address.line1}, ${currentUser.address.line2}, ${currentUser.address.city} ${currentUser.address.postcode}`;

    document.getElementById('account-type').textContent = currentAccount.type;
    document.getElementById('sort-code').textContent = currentAccount.sortCode;
    document.getElementById('account-number').textContent = currentAccount.accountNumber;
    document.getElementById('balance').textContent = `£${currentAccount.balance.toFixed(2)}`;
}

function addTransactionRow(type, amount, source, target, balance) {
    const table = document.querySelector(".account-transactions table");
    const row = table.insertRow(-1);
    row.insertCell(0).textContent = new Date().toLocaleString();
    row.insertCell(1).textContent = type;
    row.insertCell(2).textContent = `£${amount}`;
    row.insertCell(3).textContent = source || '-';
    row.insertCell(4).textContent = target || '-';
    row.insertCell(5).textContent = `£${balance.toFixed(2)}`;
}

// Deposit

document.querySelector('.deposit button').addEventListener('click', function() {
    let amount = parseFloat(document.getElementById('depositAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid deposit amount.");
        return;
    }
    currentAccount.balance += amount;
    updateAccountDisplay();
    addTransactionRow("Deposit", amount, currentAccount.accountNumber, null, currentAccount.balance);
    document.getElementById('depositAmount').value = "";
});


// Withdraw

document.querySelector('.withdraw button').addEventListener('click', function() {
    let amount = parseFloat(document.getElementById('withdrawAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid withdrawal amount.");
        return;
    }
    if (amount > currentAccount.balance) {
        alert("Insufficient funds.");
        return;
    }
    currentAccount.balance -= amount;
    updateAccountDisplay();
    addTransactionRow("Withdraw", amount, currentAccount.accountNumber, null, currentAccount.balance);
    document.getElementById('withdrawAmount').value = "";
});


// Transfer (with confirm + success)

document.querySelector('.transfer button').addEventListener('click', function() {
    let sourceAccNo = document.getElementById('source-account').value;
    let targetAccNo = document.getElementById('destination-account').value;
    let amount = parseFloat(document.getElementById('amount').value);

    if (!sourceAccNo || !targetAccNo || sourceAccNo === targetAccNo) {
        alert("Select valid source and target accounts.");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid transfer amount.");
        return;
    }

    // Find accounts
    let sourceAcc, targetAcc;
    usersList.forEach(user => {
        user.accounts.forEach(acc => {
            if (acc.accountNumber === sourceAccNo) sourceAcc = acc;
            if (acc.accountNumber === targetAccNo) targetAcc = acc;
        });
    });

    if (!sourceAcc || !targetAcc) {
        alert("Account not found.");
        return;
    }
    if (amount > sourceAcc.balance) {
        alert("Insufficient funds.");
        return;
    }

    // Final confirmation before executing
    const confirmTransfer = confirm(`Are you sure you want to transfer £${amount} from ${sourceAcc.accountNumber} to ${targetAcc.accountNumber}?`);
    if (!confirmTransfer) return;

    // Perform transfer
    sourceAcc.balance -= amount;
    targetAcc.balance += amount;

    updateAccountDisplay();
    addTransactionRow("Transfer", amount, sourceAcc.accountNumber, targetAcc.accountNumber, sourceAcc.balance);

    document.getElementById('amount').value = "";

    alert("Transferred successfully!");
});


// Initial Load

updateAccountDisplay();


// Contact form submission

document
  .getElementById("contact-form")
  .addEventListener("submit", function (e){
    e.preventDefault();
    alert("Thanks For Your Message");
    this.reset();
  });
