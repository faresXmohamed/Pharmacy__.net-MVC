
/* =====================================================
   PHARMACY ADMIN
   File: js/admin/admin.js
   Fixed Version 1.2
===================================================== */

(function () {
  "use strict";

  const PAGE_SIZE = 8;

  /* =========================
     HELPERS
  ========================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
  }

  function normalizeTarget(value) {
    return String(value || "").trim().replace(/^#/, "");
  }

  function showToast(message, type = "success") {
    if (window.PharmacyUI) {
      window.PharmacyUI.toast(message, type);
    } else {
      alert(message);
    }
  }

  function getTableByTarget(target) {
    const id = normalizeTarget(target);
    return id ? document.getElementById(id) : null;
  }

  /* =========================
     TABLE SEARCH & FILTERS
  ========================= */

  function getCellText(row, column) {
    const cell = row.cells[Number(column)];
    return cell ? normalize(cell.textContent) : "";
  }

  function getTableRows(table) {
    const body = $("tbody", table);
    return body ? $$("tr", body) : [];
  }

  function getTableSearch(table) {
    return $$("[data-table-search]").find((input) => {
      return (
        normalizeTarget(input.dataset.tableSearch) === table.id
      );
    }) || null;
  }

  function getTableFilters(table) {
    return $$("[data-table-filter]").filter((filter) => {
      return (
        normalizeTarget(filter.dataset.tableTarget) === table.id
      );
    });
  }

  function rowMatchesFilters(row, searchValue, filters) {
    const rowText = normalize(row.textContent);

    if (searchValue && !rowText.includes(searchValue)) {
      return false;
    }

    for (const filter of filters) {
      const value = normalize(filter.value);

      if (!value) continue;

      const column = Number(filter.dataset.filterColumn);

      if (!Number.isInteger(column) || column < 0) continue;

      const cellValue = getCellText(row, column);

      if (cellValue !== value) {
        return false;
      }
    }

    return true;
  }

  function updateTableCount(table, count) {
    const element = $(
      `[data-table-count="${table.id}"]`
    );

    if (element) {
      element.textContent = String(count);
    }
  }

  /* =========================
     PAGINATION
  ========================= */

  const tableStates = new Map();

  function getPagination(table) {
    return $(
      `[data-table-pagination="${table.id}"]`
    );
  }

  function renderPagination(
    container,
    tableId,
    currentPage,
    totalPages
  ) {
    container.innerHTML = "";

    if (totalPages <= 1) return;

    const previous = document.createElement("button");

    previous.type = "button";
    previous.className = "pagination-btn";
    previous.textContent = "Previous";
    previous.disabled = currentPage === 1;
    previous.dataset.pageAction = "previous";
    previous.dataset.tableTarget = tableId;

    container.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "pagination-btn";
      button.textContent = String(page);
      button.dataset.page = String(page);
      button.dataset.tableTarget = tableId;

      if (page === currentPage) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
      }

      container.appendChild(button);
    }

    const next = document.createElement("button");

    next.type = "button";
    next.className = "pagination-btn";
    next.textContent = "Next";
    next.disabled = currentPage === totalPages;
    next.dataset.pageAction = "next";
    next.dataset.tableTarget = tableId;

    container.appendChild(next);
  }

  function updatePagination(table, rows, currentPage) {
    const pagination = getPagination(table);

    if (!pagination) {
      rows.forEach((row) => {
        row.hidden = false;
      });

      return 1;
    }

    const totalPages = Math.max(
      1,
      Math.ceil(rows.length / PAGE_SIZE)
    );

    const page = Math.min(
      Math.max(currentPage, 1),
      totalPages
    );

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    rows.forEach((row, index) => {
      row.hidden = index < start || index >= end;
    });

    renderPagination(
      pagination,
      table.id,
      page,
      totalPages
    );

    return page;
  }

  /* =========================
     TABLE REFRESH
  ========================= */

  function refreshTable(table) {
    if (!table || !table.id) return;

    const searchInput = getTableSearch(table);
    const filters = getTableFilters(table);

    const searchValue = normalize(
      searchInput ? searchInput.value : ""
    );

    const allRows = getTableRows(table);

    const filteredRows = allRows.filter((row) => {
      return rowMatchesFilters(
        row,
        searchValue,
        filters
      );
    });

    allRows.forEach((row) => {
      row.hidden = !filteredRows.includes(row);
    });

    updateTableCount(table, filteredRows.length);

    const currentPage = tableStates.get(table.id) || 1;

    const newPage = updatePagination(
      table,
      filteredRows,
      currentPage
    );

    tableStates.set(table.id, newPage);
  }

  function refreshAllTables() {
    $$("table[id]").forEach((table) => {
      refreshTable(table);
    });
  }

  /* =========================
     SEARCH EVENTS
  ========================= */

  function initTableSearch() {
    document.addEventListener("input", (event) => {
      const input = event.target.closest(
        "[data-table-search]"
      );

      if (!input) return;

      const table = getTableByTarget(
        input.dataset.tableSearch
      );

      if (!table) return;

      tableStates.set(table.id, 1);
      refreshTable(table);
    });
  }

  /* =========================
     FILTER EVENTS
  ========================= */

  function initTableFilters() {
    document.addEventListener("change", (event) => {
      const filter = event.target.closest(
        "[data-table-filter]"
      );

      if (!filter) return;

      const table = getTableByTarget(
        filter.dataset.tableTarget
      );

      if (!table) return;

      tableStates.set(table.id, 1);
      refreshTable(table);
    });
  }

  /* =========================
     PAGINATION EVENTS
  ========================= */

  function initPagination() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(
        "[data-page], [data-page-action]"
      );

      if (!button) return;

      const tableId = normalizeTarget(
        button.dataset.tableTarget
      );

      const table = getTableByTarget(tableId);

      if (!table) return;

      let page = tableStates.get(tableId) || 1;

      if (button.dataset.page) {
        page = Number(button.dataset.page);
      } else if (button.dataset.pageAction === "next") {
        page += 1;
      } else if (button.dataset.pageAction === "previous") {
        page -= 1;
      }

      if (!Number.isInteger(page) || page < 1) return;

      tableStates.set(tableId, page);
      refreshTable(table);
    });
  }

  /* =========================
     CLEAR FILTERS
  ========================= */

  function clearTableFilters(table) {
    const searchInput = getTableSearch(table);

    if (searchInput) {
      searchInput.value = "";
    }

    getTableFilters(table).forEach((filter) => {
      filter.value = "";
    });

    tableStates.set(table.id, 1);
    refreshTable(table);
  }

  function initClearFilters() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(
        "[data-clear-filters]"
      );

      if (!button) return;

      const targetId = button.dataset.tableTarget;

      if (targetId) {
        const table = getTableByTarget(targetId);

        if (table) {
          clearTableFilters(table);
        }

        return;
      }

      $$("table[id]").forEach((table) => {
        clearTableFilters(table);
      });
    });
  }

  /* =========================
     ROW SELECTION
  ========================= */

  function updateSelectedCount() {
    const selectedRows = $$(
      "[data-row-select]:checked"
    );

    $$("[data-selected-count]").forEach((element) => {
      element.textContent = String(selectedRows.length);
    });
  }

  function updateSelectAllState(table) {
    const selectAll = $("[data-select-all]", table);

    if (!selectAll) return;

    const checkboxes = $$(
      "[data-row-select]",
      table
    );

    const checkedCount = checkboxes.filter(
      (checkbox) => checkbox.checked
    ).length;

    selectAll.checked =
      checkboxes.length > 0 &&
      checkedCount === checkboxes.length;

    selectAll.indeterminate =
      checkedCount > 0 &&
      checkedCount < checkboxes.length;
  }

  function initRowSelection() {
    document.addEventListener("change", (event) => {
      const selectAll = event.target.closest(
        "[data-select-all]"
      );

      if (selectAll) {
        const table = selectAll.closest("table");

        if (!table) return;

        $$("[data-row-select]", table).forEach((checkbox) => {
          checkbox.checked = selectAll.checked;
        });

        selectAll.indeterminate = false;
        updateSelectedCount();

        return;
      }

      const rowCheckbox = event.target.closest(
        "[data-row-select]"
      );

      if (!rowCheckbox) return;

      const table = rowCheckbox.closest("table");

      if (table) {
        updateSelectAllState(table);
      }

      updateSelectedCount();
    });
  }

  /* =========================
     ORDER STATUS
  ========================= */

  function getStatusClass(status) {
    const value = normalize(status);

    const classes = {
      pending: "warning",
      processing: "info",
      shipped: "info",
      delivered: "success",
      cancelled: "danger",
      completed: "success"
    };

    return classes[value] || "secondary";
  }

  function updateStatusBadge(select) {
    const row = select.closest("tr");

    if (!row) return;

    const badge = $("[data-status-badge]", row);

    if (!badge) return;

    const status = select.value;

    badge.textContent = status;
    badge.className = "badge";
    badge.classList.add(
      `badge-${getStatusClass(status)}`
    );

    badge.dataset.status = status;
  }

  function initOrderStatus() {
    document.addEventListener("change", (event) => {
      const select = event.target.closest(
        "[data-order-status]"
      );

      if (!select) return;

      updateStatusBadge(select);

      const table = select.closest("table");

      if (table) {
        refreshTable(table);
      }

      showToast(
        "Status changed in the interface only. Backend connection is required to save it.",
        "warning"
      );
    });
  }

  /* =========================
     TABLE INITIALIZATION
  ========================= */

  function initTables() {
    $$("table[id]").forEach((table) => {
      tableStates.set(table.id, 1);
      refreshTable(table);
    });

    updateSelectedCount();
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.PharmacyAdmin = {
    refreshTable,
    refreshAllTables,
    updateSelectedCount,
    updateStatusBadge,
    clearTableFilters
  };

  /* =========================
     START
  ========================= */

  function init() {
    initTableSearch();
    initTableFilters();
    initPagination();
    initClearFilters();
    initRowSelection();
    initOrderStatus();
    initTables();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* =========================================================
   PHARMACY ADMIN - MEDICINES MODULE
   Demo mode now - API ready structure for MVC integration
========================================================= */

(() => {
    "use strict";

    const table = document.getElementById("medicinesTable");
    const tbody = document.getElementById("medicinesTableBody");

    if (!table || !tbody) return;

    const addForm = document.getElementById("addMedicineForm");
    const editForm = document.getElementById("editMedicineForm");

    const addModal = document.getElementById("addMedicineModal");
    const editModal = document.getElementById("editMedicineModal");

    const editId = document.getElementById("editMedicineId");

    const LOW_STOCK_LIMIT = 10;

    /* =========================
       DEMO DATA
    ========================= */

    let medicines = [
        {
            id: "MED-001",
            name: "Panadol Extra",
            category: "Pain Relief",
            branch: "Sheikh Zayed",
            price: 45,
            quantity: 120,
            description: ""
        },
        {
            id: "MED-002",
            name: "Vitamin C",
            category: "Vitamins",
            branch: "October",
            price: 85,
            quantity: 8,
            description: ""
        },
        {
            id: "MED-003",
            name: "Brufen 400",
            category: "Pain Relief",
            branch: "Dokki",
            price: 35,
            quantity: 0,
            description: ""
        },
        {
            id: "MED-004",
            name: "Zyrtec",
            category: "Allergy",
            branch: "Maadi",
            price: 60,
            quantity: 6,
            description: ""
        },
        {
            id: "MED-005",
            name: "Augmentin 1g",
            category: "Antibiotics",
            branch: "Sheikh Zayed",
            price: 120,
            quantity: 45,
            description: ""
        },
        {
            id: "MED-006",
            name: "Omega 3",
            category: "Supplements",
            branch: "October",
            price: 180,
            quantity: 75,
            description: ""
        },
        {
            id: "MED-007",
            name: "Panadol Advance",
            category: "Pain Relief",
            branch: "Dokki",
            price: 40,
            quantity: 90,
            description: ""
        },
        {
            id: "MED-008",
            name: "Concor 5mg",
            category: "Heart Care",
            branch: "Maadi",
            price: 95,
            quantity: 4,
            description: ""
        }
    ];

    /* =========================
       API SERVICE
    ========================= */

    const MedicineService = {
        async getAll() {
            // TODO: Connect to the agreed MVC endpoint.
            return [...medicines];
        },

        async create(data) {
            // TODO: POST data to the agreed MVC endpoint.

            const medicine = {
                ...data,
                id: createMedicineId()
            };

            medicines.push(medicine);
            return medicine;
        },

        async update(id, data) {
            // TODO: PUT/PATCH data to the agreed MVC endpoint.

            const index = medicines.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error("Medicine not found.");
            }

            medicines[index] = {
                ...medicines[index],
                ...data,
                id
            };

            return medicines[index];
        },

        async delete(id) {
            // TODO: DELETE through the agreed MVC endpoint.

            const index = medicines.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error("Medicine not found.");
            }

            medicines.splice(index, 1);
            return true;
        }
    };

    /* =========================
       HELPERS
    ========================= */

    function createMedicineId() {
        const maxId = medicines.reduce((max, item) => {
            const number = Number(item.id.replace("MED-", "")) || 0;
            return Math.max(max, number);
        }, 0);

        return `MED-${String(maxId + 1).padStart(3, "0")}`;
    }

    function getStockStatus(quantity) {
        if (quantity <= 0) {
            return {
                text: "Out of Stock",
                className: "badge-danger"
            };
        }

        if (quantity <= LOW_STOCK_LIMIT) {
            return {
                text: "Low Stock",
                className: "badge-warning"
            };
        }

        return {
            text: "Available",
            className: "badge-success"
        };
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function showToast(message, type = "success") {
        if (window.PharmacyUI?.toast) {
            window.PharmacyUI.toast(message, type);
            return;
        }

        alert(message);
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add("active");
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("active");
    }

    function getFormData(form) {
        const data = new FormData(form);

        return {
            name: String(data.get("medicineName") || "").trim(),
            category: String(data.get("medicineCategory") || "").trim(),
            price: Number(data.get("medicinePrice")),
            branch: String(data.get("medicineBranch") || "").trim(),
            quantity: Number(data.get("medicineQuantity")),
            description: String(data.get("medicineDescription") || "").trim()
        };
    }

    function validateMedicine(data) {
        if (!data.name || !data.category || !data.branch) {
            return "Please complete all required fields.";
        }

        if (!Number.isFinite(data.price) || data.price < 0) {
            return "Please enter a valid price.";
        }

        if (!Number.isInteger(data.quantity) || data.quantity < 0) {
            return "Quantity must be a whole number.";
        }

        return null;
    }

    /* =========================
       TABLE
    ========================= */

    function renderTable() {
        tbody.innerHTML = medicines.map(medicine => {
            const status = getStockStatus(medicine.quantity);

            return `
                <tr data-medicine-id="${escapeHTML(medicine.id)}">
                    <td>${escapeHTML(medicine.id)}</td>

                    <td>
                        <strong>${escapeHTML(medicine.name)}</strong>
                    </td>

                    <td>${escapeHTML(medicine.category)}</td>

                    <td>${escapeHTML(medicine.branch)}</td>

                    <td>EGP ${Number(medicine.price).toFixed(2)}</td>

                    <td>
                        <span class="badge ${status.className}">
                            ${status.text}
                        </span>
                    </td>

                    <td>${medicine.quantity}</td>

                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="btn btn-outline btn-sm"
                                data-medicine-edit="${escapeHTML(medicine.id)}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="btn btn-danger btn-sm"
                                data-medicine-delete="${escapeHTML(medicine.id)}">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        updateStatistics();

        // Re-apply shared search, filters and pagination.
        if (window.PharmacyAdmin?.refreshTable) {
            window.PharmacyAdmin.refreshTable(table);
        }
    }

    function updateStatistics() {
        const total = medicines.length;

        const available = medicines.filter(
            item => item.quantity > LOW_STOCK_LIMIT
        ).length;

        const lowStock = medicines.filter(
            item => item.quantity > 0 &&
                    item.quantity <= LOW_STOCK_LIMIT
        ).length;

        const outOfStock = medicines.filter(
            item => item.quantity === 0
        ).length;

        const cards = document.querySelectorAll(
            ".stats-grid .stat-card .stat-value"
        );

        if (cards[0]) cards[0].textContent = total;
        if (cards[1]) cards[1].textContent = available;
        if (cards[2]) cards[2].textContent = lowStock;
        if (cards[3]) cards[3].textContent = outOfStock;
    }

    /* =========================
       ADD MEDICINE
    ========================= */

    addForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (!addForm.reportValidity()) return;

        const data = getFormData(addForm);
        const error = validateMedicine(data);

        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            await MedicineService.create(data);

            renderTable();
            addForm.reset();
            closeModal(addModal);

            showToast("Medicine added successfully.");
        } catch (error) {
            showToast(error.message || "Could not add medicine.", "error");
        }
    });

    /* =========================
       EDIT MEDICINE
    ========================= */

    tbody.addEventListener("click", event => {
        const button = event.target.closest("[data-medicine-edit]");

        if (!button) return;

        const id = button.dataset.medicineEdit;
        const medicine = medicines.find(item => item.id === id);

        if (!medicine) {
            showToast("Medicine not found.", "error");
            return;
        }

        if (!editForm || !editId) {
            showToast("Edit form is missing from this page.", "error");
            return;
        }

        editId.value = medicine.id;

        document.getElementById("editMedicineName").value =
            medicine.name;

        document.getElementById("editMedicineCategory").value =
            medicine.category;

        document.getElementById("editMedicinePrice").value =
            medicine.price;

        document.getElementById("editMedicineBranch").value =
            medicine.branch;

        document.getElementById("editMedicineQuantity").value =
            medicine.quantity;

        document.getElementById("editMedicineDescription").value =
            medicine.description || "";

        openModal(editModal);
    });

    editForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (!editForm.reportValidity()) return;

        const id = editId?.value;

        if (!id) {
            showToast("No medicine selected.", "error");
            return;
        }

        const data = getFormData(editForm);
        const error = validateMedicine(data);

        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            await MedicineService.update(id, data);

            renderTable();
            editForm.reset();
            closeModal(editModal);

            showToast("Medicine updated successfully.");
        } catch (error) {
            showToast(error.message || "Could not update medicine.", "error");
        }
    });

    /* =========================
       DELETE MEDICINE
    ========================= */

    tbody.addEventListener("click", async event => {
        const button = event.target.closest("[data-medicine-delete]");

        if (!button) return;

        const id = button.dataset.medicineDelete;
        const medicine = medicines.find(item => item.id === id);

        if (!medicine) {
            showToast("Medicine not found.", "error");
            return;
        }

        const confirmed = confirm(
            `Delete ${medicine.name}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await MedicineService.delete(id);

            renderTable();
            showToast("Medicine deleted successfully.");
        } catch (error) {
            showToast(error.message || "Could not delete medicine.", "error");
        }
    });

    /* =========================
       INITIALIZATION & PUBLIC API
    ========================= */

    renderTable();

    window.PharmacyMedicines = {
        reload: renderTable,
        getAll: () => [...medicines],
        service: MedicineService
    };
})();


/* =========================================================
   PHARMACY ADMIN - BRANCHES MODULE
   Demo mode now - API-ready structure for MVC integration
========================================================= */

(() => {
    "use strict";

    const table = document.getElementById("branchesTable");
    const tbody = document.getElementById("branchesTableBody");

    // This module runs only on the branches page.
    if (!table || !tbody) return;

    const addForm = document.getElementById("addBranchForm");
    const editForm = document.getElementById("editBranchForm");

    const addModal = document.getElementById("addBranchModal");
    const editModal = document.getElementById("editBranchModal");
    const editId = document.getElementById("editBranchId");

    /* =========================
       DEMO DATA
    ========================= */

    let branches = [
        {
            id: "BR-001",
            name: "Sheikh Zayed Branch",
            location: "Sheikh Zayed, Giza",
            phone: "01012345678",
            status: "Active"
        },
        {
            id: "BR-002",
            name: "6th of October Branch",
            location: "6th of October, Giza",
            phone: "01098765432",
            status: "Active"
        },
        {
            id: "BR-003",
            name: "Dokki Branch",
            location: "Dokki, Giza",
            phone: "01122334455",
            status: "Active"
        },
        {
            id: "BR-004",
            name: "Maadi Branch",
            location: "Maadi, Cairo",
            phone: "01234567890",
            status: "Inactive"
        }
    ];

    /* =========================
       API SERVICE
    ========================= */

    const BranchService = {
        async getAll() {
            // TODO: Connect to the agreed branches endpoint.
            return [...branches];
        },

        async create(data) {
            // TODO: POST data to the agreed branches endpoint.

            const branch = {
                ...data,
                id: createBranchId()
            };

            branches.push(branch);
            return branch;
        },

        async update(id, data) {
            // TODO: PUT/PATCH data to the agreed branch endpoint.

            const index = branches.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error("Branch not found.");
            }

            branches[index] = {
                ...branches[index],
                ...data,
                id
            };

            return branches[index];
        },

        async delete(id) {
            // TODO: DELETE the branch through the agreed endpoint.

            const index = branches.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error("Branch not found.");
            }

            branches.splice(index, 1);
            return true;
        }
    };

    /* =========================
       HELPERS
    ========================= */

    function createBranchId() {
        const maxId = branches.reduce((max, item) => {
            const number = Number(String(item.id).replace("BR-", "")) || 0;
            return Math.max(max, number);
        }, 0);

        return `BR-${String(maxId + 1).padStart(3, "0")}`;
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function showToast(message, type = "success") {
        if (window.PharmacyUI?.toast) {
            window.PharmacyUI.toast(message, type);
        } else {
            alert(message);
        }
    }

    function openModal(modal) {
        modal?.classList.add("active");
    }

    function closeModal(modal) {
        modal?.classList.remove("active");
    }

    function getFormData(form) {
        const data = new FormData(form);

        return {
            name: String(data.get("branchName") || "").trim(),
            location: String(data.get("branchLocation") || "").trim(),
            phone: String(data.get("branchPhone") || "").trim(),
            status: String(data.get("branchStatus") || "Active").trim()
        };
    }

    function validateBranch(data) {
        if (!data.name || !data.location || !data.phone) {
            return "Please complete all required fields.";
        }

        if (!/^[0-9+\s()-]{8,20}$/.test(data.phone)) {
            return "Please enter a valid phone number.";
        }

        if (!["Active", "Inactive"].includes(data.status)) {
            return "Please select a valid branch status.";
        }

        return null;
    }

    /* =========================
       TABLE & STATISTICS
    ========================= */

    function renderTable() {
        tbody.innerHTML = branches.map(branch => {
            const active = branch.status === "Active";

            return `
                <tr data-branch-id="${escapeHTML(branch.id)}">
                    <td>${escapeHTML(branch.id)}</td>

                    <td>
                        <strong>${escapeHTML(branch.name)}</strong>
                    </td>

                    <td>${escapeHTML(branch.location)}</td>

                    <td>${escapeHTML(branch.phone)}</td>

                    <td>
                        <span class="badge ${active ? "badge-success" : "badge-secondary"}">
                            ${escapeHTML(branch.status)}
                        </span>
                    </td>

                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="btn btn-outline btn-sm"
                                data-branch-edit="${escapeHTML(branch.id)}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="btn btn-danger btn-sm"
                                data-branch-delete="${escapeHTML(branch.id)}">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        updateStatistics();

        // Re-apply shared search, filters and pagination.
        if (window.PharmacyAdmin?.refreshTable) {
            window.PharmacyAdmin.refreshTable(table);
        }
    }

    function updateStatistics() {
        const total = branches.length;

        const active = branches.filter(
            item => item.status === "Active"
        ).length;

        const inactive = branches.filter(
            item => item.status === "Inactive"
        ).length;

        const values = {
            total,
            active,
            inactive
        };

        Object.entries(values).forEach(([key, value]) => {
            const element = document.querySelector(
                `[data-branch-stat="${key}"]`
            );

            if (element) {
                element.textContent = String(value);
            }
        });
    }

    function resetForm(form) {
        form?.reset();
    }

    /* =========================
       ADD BRANCH
    ========================= */

    addForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (!addForm.reportValidity()) return;

        const data = getFormData(addForm);
        const error = validateBranch(data);

        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            await BranchService.create(data);

            renderTable();
            resetForm(addForm);
            closeModal(addModal);

            showToast("Branch added successfully.");
        } catch (error) {
            showToast(error.message || "Could not add branch.", "error");
        }
    });

    /* =========================
       EDIT BRANCH
    ========================= */

    tbody.addEventListener("click", event => {
        const button = event.target.closest("[data-branch-edit]");

        if (!button) return;

        const branch = branches.find(
            item => item.id === button.dataset.branchEdit
        );

        if (!branch) {
            showToast("Branch not found.", "error");
            return;
        }

        if (!editForm || !editId) {
            showToast("Edit form is missing from this page.", "error");
            return;
        }

        editId.value = branch.id;

        const nameInput = document.getElementById("editBranchName");
        const locationInput = document.getElementById("editBranchLocation");
        const phoneInput = document.getElementById("editBranchPhone");
        const statusInput = document.getElementById("editBranchStatus");

        if (nameInput) nameInput.value = branch.name;
        if (locationInput) locationInput.value = branch.location;
        if (phoneInput) phoneInput.value = branch.phone;
        if (statusInput) statusInput.value = branch.status;

        openModal(editModal);
    });

    editForm?.addEventListener("submit", async event => {
        event.preventDefault();

        if (!editForm.reportValidity()) return;

        const id = editId?.value;

        if (!id) {
            showToast("No branch selected.", "error");
            return;
        }

        const data = getFormData(editForm);
        const error = validateBranch(data);

        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            await BranchService.update(id, data);

            renderTable();
            resetForm(editForm);
            closeModal(editModal);

            showToast("Branch updated successfully.");
        } catch (error) {
            showToast(error.message || "Could not update branch.", "error");
        }
    });

    /* =========================
       DELETE BRANCH
    ========================= */

    tbody.addEventListener("click", async event => {
        const button = event.target.closest("[data-branch-delete]");

        if (!button) return;

        const id = button.dataset.branchDelete;

        const branch = branches.find(
            item => item.id === id
        );

        if (!branch) {
            showToast("Branch not found.", "error");
            return;
        }

        const confirmed = confirm(
            `Delete ${branch.name}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await BranchService.delete(id);

            renderTable();
            showToast("Branch deleted successfully.");
        } catch (error) {
            showToast(error.message || "Could not delete branch.", "error");
        }
    });

    /* =========================
       INITIALIZATION & PUBLIC API
    ========================= */

    renderTable();

    window.PharmacyBranches = {
        reload: renderTable,
        getAll: () => [...branches],
        service: BranchService
    };
})();

