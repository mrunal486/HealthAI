/**
 * HealthAI Platform — Centralized Data Simulation Engine
 * Provides realistic, live-updating data across all pages.
 */

const HealthAIData = (() => {

    // ── Hospital Data ─────────────────────────────────────────────────────────
    const hospitals = [
        {
            id: 'h1', name: 'City General Hospital', area: 'Sector 12, Noida',
            lat: 28.5830, lng: 77.3090,
            totalBeds: 320, occupiedBeds: 278,
            totalICU: 40, occupiedICU: 35,
            totalVentilators: 20, occupiedVentilators: 14,
            doctors: { total: 48, available: 12, onDuty: 36 },
            ambulances: { total: 8, active: 5, available: 3 },
            bloodBank: { 'A+': 14, 'B+': 8, 'O+': 20, 'AB+': 5, 'A-': 3, 'B-': 2, 'O-': 6, 'AB-': 1 },
            status: 'moderate', emergencyWait: 18, specialties: ['Cardiology', 'Neurology', 'Trauma'],
            rating: 4.6, contact: '+91 120-456-7890',
        },
        {
            id: 'h2', name: 'Apollo Multispeciality', area: 'Sector 26, Noida',
            lat: 28.5705, lng: 77.3220,
            totalBeds: 280, occupiedBeds: 196,
            totalICU: 35, occupiedICU: 20,
            totalVentilators: 16, occupiedVentilators: 8,
            doctors: { total: 55, available: 22, onDuty: 33 },
            ambulances: { total: 6, active: 2, available: 4 },
            bloodBank: { 'A+': 22, 'B+': 15, 'O+': 30, 'AB+': 8, 'A-': 5, 'B-': 3, 'O-': 9, 'AB-': 2 },
            status: 'available', emergencyWait: 8, specialties: ['Orthopedics', 'Oncology', 'Cardiology'],
            rating: 4.8, contact: '+91 120-789-0123',
        },
        {
            id: 'h3', name: 'Fortis Healthcare', area: 'Sector 62, Noida',
            lat: 28.6235, lng: 77.3620,
            totalBeds: 240, occupiedBeds: 230,
            totalICU: 30, occupiedICU: 29,
            totalVentilators: 14, occupiedVentilators: 13,
            doctors: { total: 40, available: 4, onDuty: 36 },
            ambulances: { total: 5, active: 5, available: 0 },
            bloodBank: { 'A+': 5, 'B+': 3, 'O+': 8, 'AB+': 1, 'A-': 0, 'B-': 1, 'O-': 2, 'AB-': 0 },
            status: 'critical', emergencyWait: 45, specialties: ['Neurology', 'Pediatrics', 'Trauma'],
            rating: 4.4, contact: '+91 120-321-0987',
        },
        {
            id: 'h4', name: 'Max Super Specialty', area: 'Vaishali, Ghaziabad',
            lat: 28.6449, lng: 77.3433,
            totalBeds: 360, occupiedBeds: 252,
            totalICU: 50, occupiedICU: 31,
            totalVentilators: 24, occupiedVentilators: 16,
            doctors: { total: 62, available: 28, onDuty: 34 },
            ambulances: { total: 10, active: 4, available: 6 },
            bloodBank: { 'A+': 30, 'B+': 20, 'O+': 40, 'AB+': 12, 'A-': 8, 'B-': 5, 'O-': 15, 'AB-': 4 },
            status: 'available', emergencyWait: 12, specialties: ['Cardiac Surgery', 'Transplant', 'Cancer'],
            rating: 4.9, contact: '+91 120-654-3210',
        },
        {
            id: 'h5', name: 'Kailash Hospital', area: 'Greater Noida',
            lat: 28.4759, lng: 77.5030,
            totalBeds: 180, occupiedBeds: 155,
            totalICU: 20, occupiedICU: 18,
            totalVentilators: 10, occupiedVentilators: 9,
            doctors: { total: 28, available: 6, onDuty: 22 },
            ambulances: { total: 4, active: 3, available: 1 },
            bloodBank: { 'A+': 10, 'B+': 7, 'O+': 14, 'AB+': 3, 'A-': 2, 'B-': 1, 'O-': 4, 'AB-': 1 },
            status: 'moderate', emergencyWait: 25, specialties: ['General Medicine', 'Gynecology', 'Pediatrics'],
            rating: 4.2, contact: '+91 120-987-6543',
        },
    ];

    // ── Ambulances ─────────────────────────────────────────────────────────────
    const ambulances = [
        { id: 'a1', regNo: 'KA-01-Z-1234', driver: 'Rajan Kumar', phone: '+91 98765-43210', hospitalId: 'h1', status: 'available', lat: 28.5790, lng: 77.3120, paramedic: true },
        { id: 'a2', regNo: 'UP-16-X-5678', driver: 'Suresh Yadav', phone: '+91 87654-32109', hospitalId: 'h2', status: 'en-route', lat: 28.5750, lng: 77.3180, paramedic: true },
        { id: 'a3', regNo: 'DL-08-Y-9012', driver: 'Mohan Singh', phone: '+91 76543-21098', hospitalId: 'h1', status: 'available', lat: 28.5810, lng: 77.3050, paramedic: false },
        { id: 'a4', regNo: 'UP-32-A-3456', driver: 'Anil Sharma', phone: '+91 65432-10987', hospitalId: 'h4', status: 'en-route', lat: 28.6400, lng: 77.3380, paramedic: true },
        { id: 'a5', regNo: 'KA-03-B-7890', driver: 'Vikram Gupta', phone: '+91 54321-09876', hospitalId: 'h2', status: 'available', lat: 28.5680, lng: 77.3270, paramedic: false },
    ];

    // ── Doctor Roster ──────────────────────────────────────────────────────────
    const doctors = [
        { id: 'd1', name: 'Dr. Priya Sharma', specialty: 'Cardiologist', hospitalId: 'h1', status: 'on-duty', patients: 8, shift: 'Morning', avatar: 'PS' },
        { id: 'd2', name: 'Dr. Rahul Mehta', specialty: 'Neurologist', hospitalId: 'h1', status: 'available', patients: 3, shift: 'Morning', avatar: 'RM' },
        { id: 'd3', name: 'Dr. Anita Rao', specialty: 'Emergency Medicine', hospitalId: 'h2', status: 'on-duty', patients: 12, shift: 'Morning', avatar: 'AR' },
        { id: 'd4', name: 'Dr. Sunil Kapoor', specialty: 'Orthopedist', hospitalId: 'h2', status: 'off-duty', patients: 0, shift: 'Evening', avatar: 'SK' },
        { id: 'd5', name: 'Dr. Meena Joshi', specialty: 'Pediatrician', hospitalId: 'h3', status: 'on-duty', patients: 7, shift: 'Morning', avatar: 'MJ' },
        { id: 'd6', name: 'Dr. Arjun Nair', specialty: 'Trauma Surgeon', hospitalId: 'h4', status: 'available', patients: 5, shift: 'Morning', avatar: 'AN' },
    ];

    // ── Patient Queue ─────────────────────────────────────────────────────────
    let patientQueue = [
        { id: 'p1', name: 'Arjun Sharma', age: 28, type: 'Cardiac', severity: 'high', eta: 4, hospitalId: 'h1', bloodGroup: 'O+', status: 'en-route' },
        { id: 'p2', name: 'Sunita Verma', age: 65, type: 'Stroke', severity: 'high', eta: 8, hospitalId: 'h2', bloodGroup: 'A+', status: 'en-route' },
        { id: 'p3', name: 'Rohit Patel', age: 34, type: 'Trauma', severity: 'medium', eta: 15, hospitalId: 'h1', bloodGroup: 'B+', status: 'waiting' },
        { id: 'p4', name: 'Kavita Singh', age: 52, type: 'Breathing', severity: 'medium', eta: 22, hospitalId: 'h4', bloodGroup: 'AB+', status: 'waiting' },
        { id: 'p5', name: 'Deepak Kumar', age: 19, type: 'Accident', severity: 'low', eta: 30, hospitalId: 'h2', bloodGroup: 'O-', status: 'scheduled' },
    ];

    // ── System Metrics ─────────────────────────────────────────────────────────
    let systemMetrics = {
        totalPatients: 1847,
        emergenciesToday: 34,
        avgResponseTime: 6.2,
        resourceUtilization: 74,
        livesAssisted: 12483,
        hospitalsOnline: 5,
        ambulancesActive: 5,
        aiTriagesCompleted: 287,
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    function getOccupancyPct(hospital) {
        return Math.round((hospital.occupiedBeds / hospital.totalBeds) * 100);
    }
    function getICUPct(hospital) {
        return Math.round((hospital.occupiedICU / hospital.totalICU) * 100);
    }
    function getStatusLabel(hospital) {
        const pct = getOccupancyPct(hospital);
        if (pct >= 93) return 'critical';
        if (pct >= 75) return 'moderate';
        return 'available';
    }
    function getNearestHospital(excludeCritical = true) {
        return hospitals
            .filter(h => !excludeCritical || h.status !== 'critical')
            .sort((a, b) => getOccupancyPct(a) - getOccupancyPct(b))[0];
    }
    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // ── Live Simulation ───────────────────────────────────────────────────────
    function simulateLiveChanges() {
        hospitals.forEach(h => {
            // Beds fluctuate ±2
            h.occupiedBeds = Math.max(0, Math.min(h.totalBeds, h.occupiedBeds + Math.floor(Math.random() * 5) - 2));
            h.occupiedICU = Math.max(0, Math.min(h.totalICU, h.occupiedICU + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.7 ? 1 : 0)));
            h.emergencyWait = Math.max(3, h.emergencyWait + Math.floor(Math.random() * 7) - 3);
            h.status = getStatusLabel(h);
        });

        // Update ambulance ETAs
        patientQueue.forEach(p => {
            if (p.eta > 1) p.eta = Math.max(1, p.eta - 1);
        });

        // Metrics drift
        systemMetrics.totalPatients += Math.floor(Math.random() * 3);
        systemMetrics.avgResponseTime = +(systemMetrics.avgResponseTime + (Math.random() * 0.4 - 0.2)).toFixed(1);
        systemMetrics.resourceUtilization = Math.min(99, Math.max(55, systemMetrics.resourceUtilization + Math.floor(Math.random() * 4) - 2));
        systemMetrics.emergenciesToday += Math.random() > 0.85 ? 1 : 0;

        // Trigger custom event for any page listening
        window.dispatchEvent(new CustomEvent('healthai-data-updated', { detail: { hospitals, systemMetrics, patientQueue } }));
    }

    // ── Public API ────────────────────────────────────────────────────────────
    return {
        hospitals,
        ambulances,
        doctors,
        patientQueue,
        systemMetrics,
        getOccupancyPct,
        getICUPct,
        getStatusLabel,
        getNearestHospital,
        startSimulation(interval = 8000) {
            simulateLiveChanges(); // run immediately
            return setInterval(simulateLiveChanges, interval);
        },
        getHospitalById(id) { return hospitals.find(h => h.id === id); },
        getAmbulanceById(id) { return ambulances.find(a => a.id === id); },
        getAvailableHospitals() { return hospitals.filter(h => h.status === 'available'); },
        getHospitalsByArea(keyword) { return hospitals.filter(h => h.area.toLowerCase().includes(keyword.toLowerCase())); },
        getTotalBeds() { return hospitals.reduce((s, h) => s + h.totalBeds, 0); },
        getTotalOccupied() { return hospitals.reduce((s, h) => s + h.occupiedBeds, 0); },
        getTotalICU() { return hospitals.reduce((s, h) => s + h.totalICU, 0); },
        getOccupiedICU() { return hospitals.reduce((s, h) => s + h.occupiedICU, 0); },
    };
})();
