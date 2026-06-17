// ========================================================
// THE HEALTHCARE PLATFORM SYSTEM REGISTRY DATA CONTROLLER
// ========================================================
const HealthSystem = {
    STORAGE_KEYS: {
        PATIENTS: "healthcare_active_registry",
        COUNTER: "healthcare_admission_total_log"
    },
    registry: [],
    cumulativeAdmissionsCounter: 0,

    // 1. Core Startup Initialization Loop Routine
    init() {
        // Hydrate active patient queue logs from browser local memory fields
        this.registry = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PATIENTS)) || [
            { id: "PT-7492", name: "Arthur Dent", age: 42, triage: "Urgent", doctor: "Dr. M. Lin (General Medicine)", notes: "Acute abdominal distress symptoms present. Blood pressure elevated slightly." },
            { id: "PT-1049", name: "Sarah Connor", age: 29, triage: "Emergency", doctor: "Dr. E. Vance (Trauma/ER)", notes: "Laceration tracking along right forearm layer. Continuous localized bleeding." }
        ];

        // Hydrate overall historic total analytics count parameter model
        this.cumulativeAdmissionsCounter = parseInt(localStorage.getItem(this.STORAGE_KEYS.COUNTER)) || 2;

        this.syncSystemState();
    },

    // 2. Ingest New Patient Admission File Object into active Matrix
    admitPatient(name, age, triage, doctor, notes) {
        const medicalRecordId = "PT-" + Math.floor(1000 + Math.random() * 9000);

        const newPatientFile = {
            id: medicalRecordId,
            name: name.trim(),
            age: parseInt(age) || 0,
            triage: triage,
            doctor: doctor,
            notes: notes.trim()
        };

        // Prepend Emergency tier items to ensure clinical view prioritization flow
        if (triage === "Emergency") {
            this.registry.unshift(newPatientFile);
        } else {
            this.registry.push(newPatientFile);
        }

        this.cumulativeAdmissionsCounter += 1;
        this.syncSystemState();
    },

    // 3. Purge Record Profile from Live Grid (Discharge Patient)
    dischargePatient(id) {
        this.registry = this.registry.filter(patient => patient.id !== id);
        this.syncSystemState();
    },

    syncSystemState() {
        localStorage.setItem(this.STORAGE_KEYS.PATIENTS, JSON.stringify(this.registry));
        localStorage.setItem(this.STORAGE_KEYS.COUNTER, this.cumulativeAdmissionsCounter.toString());
        this.calculateMetrics();
        this.renderLedgerUI();
    },

    // 4. Clinical System Analytics Engine Calculations
    calculateMetrics() {
        const activeCasesCount = this.registry.length;
        const criticalEmergencyAlerts = this.registry.filter(p => p.triage === "Emergency").length;

        // Push calculated scores straight out to scorecard layout view nodes
        document.getElementById('activeCasesCount').textContent = activeCasesCount;
        document.getElementById('emergencyCount').textContent = criticalEmergencyAlerts;
        document.getElementById('totalAdmissionsCount').textContent = this.cumulativeAdmissionsCounter;
    },

    // 5. Dynamic HTML Table View Node Reflow Painting
    renderLedgerUI() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = ""; // Clear canvas rows out to reset document layout nodes

        if (this.registry.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding: 25px;">No active patient tracking logs registered inside triage spaces.</td></tr>`;
            return;
        }

        this.registry.forEach(patient => {
            const tr = document.createElement('tr');

            // Apply distinct visual weights based on category flags
            let triageBadgeClass = "bg-routine";
            if (patient.triage === "Emergency") triageBadgeClass = "bg-emergency";
            else if (patient.triage === "Urgent") triageBadgeClass = "bg-urgent";

            tr.innerHTML = `
                <td>
                    <strong>${patient.name}</strong>
                    <div style="font-size:11px; color:#64748b; margin-top:2px; font-family:monospace;">ID: ${patient.id} | Age: ${patient.age}</div>
                </td>
                <td style="font-weight: 500; color:#e2e8f0;">${patient.doctor}</td>
                <td>
                    <span class="badge ${triageBadgeClass}">${patient.triage}</span>
                </td>
                <td style="color:#94a3b8; font-size:13px; max-width:280px; line-height:1.4;">${patient.notes}</td>
                <td>
                    <button class="btn-discharge discharge-btn" data-id="${patient.id}">Process Discharge</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }
};

// ========================================================
// CONTROLLER EVENT HANDLING INTERFACE LOGIC INTERCONNECTS
// ========================================================

// Handle Intake Registration Input Form Processing Submissions
document.getElementById('patientForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('patientName');
    const age = document.getElementById('patientAge');
    const triage = document.getElementById('triageLevel');
    const doctor = document.getElementById('assignedDoctor');
    const notes = document.getElementById('symptomsNotes');

    // Route input entries into system abstract array modifiers
    HealthSystem.admitPatient(name.value, age.value, triage.value, doctor.value, notes.value);

    // Reset entry widgets back to clear default conditions
    name.value = "";
    age.value = "";
    triage.selectedIndex = 0;
    doctor.selectedIndex = 0;
    notes.value = "";
});

// Event Delegation capture block matches discharge click events inside rows
document.getElementById('tableBody').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('discharge-btn')) {
        const selectedPatientId = target.getAttribute('data-id');
        if (confirm(`Authorize absolute clinical file data discharge loop for profile identifier ${selectedPatientId}?`)) {
            HealthSystem.dischargePatient(selectedPatientId);
        }
    }
});

// Fire foundational engine systems when document structural components compile safely
document.addEventListener('DOMContentLoaded', () => {
    HealthSystem.init();
});